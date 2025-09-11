const express = require("express");
const router = express.Router();
const client = require("../utils/ai");
const supabase = require('../utils/supabase');
const { requireAuth, optionalAuth } = require('../middleware/auth');
const { rateLimitChat } = require('../middleware/rateLimit');
const { sanitizeText } = require('../utils/sanitize');

// Create or get a chat session for the user (one active session reused per day)
async function getOrCreateSession(userId) {
  if (!supabase || !userId) return null;
  const todayStart = new Date(); todayStart.setHours(0,0,0,0);
  const { data: existing } = await supabase
    .from('chat_sessions')
    .select('id, started_at')
    .eq('user_id', userId)
    .gte('started_at', todayStart.toISOString())
    .order('started_at', { ascending: false })
    .limit(1);
  if (existing && existing.length) return existing[0];
  const { data: created, error } = await supabase
    .from('chat_sessions')
    .insert([{ user_id: userId }])
    .select('id, started_at')
    .single();
  if (error) throw error;
  return created;
}

async function storeMessage(sessionId, userId, role, content) {
  if (!supabase || !sessionId) return;
  await supabase.from('chat_messages').insert([{ session_id: sessionId, user_id: userId || null, role, content }]);
}

// Fetch previous messages for session (limited)
async function fetchHistory(sessionId, limit = 15) {
  if (!supabase || !sessionId) return [];
  const { data } = await supabase
    .from('chat_messages')
    .select('role, content, created_at')
    .eq('session_id', sessionId)
    .order('created_at', { ascending: true })
    .limit(limit);
  return data || [];
}

// Get existing session history (requires auth to identify user)
router.get('/history', requireAuth, async (req, res) => {
  try {
    if (!supabase) return res.status(500).json({ error: 'Persistence not configured' });
    const session = await getOrCreateSession(req.user.id);
    const messages = await fetchHistory(session.id, 50);
    res.json({ session_id: session.id, messages });
  } catch (err) {
    console.error('Chat history error', err);
    res.status(500).json({ error: 'Failed to load history' });
  }
});

router.post("/", optionalAuth, rateLimitChat, async (req, res) => {
  try {
  const { message, traits } = req.body;

    // Input validation
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required and cannot be empty" });
    }
  const cleanMessage = sanitizeText(message, { maxLength: 1500 });

    // Create personalized system prompt based on user's emotional state
    let systemPrompt = "You are a compassionate mental health support assistant. ";
    
    if (traits && traits.mood && traits.stress) {
      const mood = parseInt(traits.mood);
      const stress = parseInt(traits.stress);
      
      systemPrompt += `The user's current mood level is ${mood}/5 and stress level is ${stress}/5. `;
      
      if (mood <= 2) {
        systemPrompt += "They seem to be feeling low, so provide extra encouragement and gentle support. ";
      } else if (mood >= 4) {
        systemPrompt += "They seem to be in a positive mood, so maintain that energy while being helpful. ";
      }
      
      if (stress >= 4) {
        systemPrompt += "They're experiencing high stress, so focus on calming, practical coping strategies. ";
      } else if (stress <= 2) {
        systemPrompt += "Their stress level is manageable, so you can explore deeper topics. ";
      }
    }
    
    systemPrompt += "Always be empathetic, non-judgmental, and provide helpful, evidence-based mental health support. Keep responses concise and actionable.";

    let session = null;
    if (req.user) {
      session = await getOrCreateSession(req.user.id);
    }

    // Build conversation context: system + last few messages if user logged in
    let historyMessages = [];
    if (session) {
      const history = await fetchHistory(session.id, 12); // last 12
      historyMessages = history.map(h => ({ role: h.role, content: h.content }));
    }

    const messages = [
      { role: "system", content: systemPrompt },
      ...historyMessages,
  { role: "user", content: cleanMessage }
    ];

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: messages,
      max_tokens: 500,
      temperature: 0.7
    });

    if (!response.choices || !response.choices[0] || !response.choices[0].message) {
      throw new Error("Invalid response from OpenAI API");
    }

    const aiReply = response.choices[0].message.content;

    // Persist messages
    if (session) {
      try {
  await storeMessage(session.id, req.user.id, 'user', cleanMessage);
        await storeMessage(session.id, null, 'assistant', aiReply);
      } catch (persistErr) {
        console.warn('Failed to persist chat message', persistErr.message);
      }
    }

    res.json({ reply: aiReply, session_id: session ? session.id : null });
  } catch (error) {
    console.error("Chat API Error:", error);
    
    // Better error handling
    if (error.status === 401) {
      res.status(500).json({ error: "API authentication failed. Please check configuration." });
    } else if (error.status === 429) {
      res.status(429).json({ error: "Too many requests. Please wait a moment and try again." });
    } else if (error.status === 400) {
      res.status(400).json({ error: "Invalid request. Please check your message." });
    } else {
      res.status(500).json({ error: "Sorry, I'm having trouble responding right now. Please try again." });
    }
  }
});

module.exports = router;
