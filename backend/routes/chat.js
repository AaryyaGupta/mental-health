const express = require("express");
const router = express.Router();
const client = require("../utils/ai");

router.post("/", async (req, res) => {
  try {
    const { message, traits } = req.body;

    // Input validation
    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: "Message is required and cannot be empty" });
    }

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

    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message.trim() }
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

    res.json({ reply: response.choices[0].message.content });
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
