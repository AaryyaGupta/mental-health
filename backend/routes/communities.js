const express = require("express");
const router = express.Router();
const supabase = require('../../utils/supabase');
const { sanitizeText } = require('../utils/sanitize');
const { requireAuth, optionalAuth } = require('../../middleware/auth');

// Helper: fetch user profile by user_id
async function getUserProfile(userId) {
    if (!userId || !supabase) return null;
    const { data, error } = await supabase
        .from('user_profiles')
        .select('nickname, avatar')
        .eq('user_id', userId)
        .single();
    if (error) return null;
    return data;
}

// Middleware: ensure database configured
router.use((req, res, next) => {
    if (!supabase) {
        return res.status(500).json({ error: 'Database not configured on server' });
    }
    next();
});

// Get all posts or filter by community
router.get("/posts", optionalAuth, async (req, res) => {
    try {
        const { community, limit = 25, offset = 0 } = req.query;
        let query = supabase
            .from('community_posts')
            .select('*')
            .order('created_at', { ascending: false })
            .range(Number(offset), Number(offset) + Number(limit) - 1);

        if (community && community !== 'all') {
            query = query.eq('community', community);
        }

        const { data, error } = await query;
        if (error) throw error;

        // Attach author profile and reaction counts (already in row) plus replies count
        const postIds = data.map(p => p.id);
        let replies = [];
        if (postIds.length) {
            const { data: repliesData } = await supabase
                .from('post_replies')
                .select('id, post_id')
                .in('post_id', postIds);
            replies = repliesData || [];
        }

        // Build response similar to old shape
        const enriched = await Promise.all(data.map(async p => {
            const profile = await getUserProfile(p.user_id);
            return {
                id: p.id,
                content: p.content,
                community: p.community,
                author: profile ? { nickname: profile.nickname, avatar: profile.avatar } : { nickname: 'Anon', avatar: '🦋' },
                timestamp: p.created_at,
                polls: {
                    support: p.support_count,
                    relate: p.relate_count,
                    helpful: p.helpful_count
                },
                replies: replies.filter(r => r.post_id === p.id).length
            };
        }));

        res.json(enriched);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// Create a new post
router.post("/posts", requireAuth, async (req, res) => {
    try {
    const { content, community, user_id } = req.body;
        if (!content || !community) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        if (content.length > 500) {
            return res.status(400).json({ error: 'Content too long' });
        }
        const safeContent = sanitizeText(content, { maxLength: 500 });
        const { data, error } = await supabase
            .from('community_posts')
            .insert([
        { content: safeContent, community: sanitizeText(community, { maxLength: 60 }), user_id: user_id || (req.user && req.user.id) }
            ])
            .select('*')
            .single();
        if (error) throw error;
    const profile = await getUserProfile(user_id || (req.user && req.user.id));
        res.status(201).json({
            id: data.id,
            content: data.content,
            community: data.community,
            author: profile ? { nickname: profile.nickname, avatar: profile.avatar } : { nickname: 'Anon', avatar: '🦋' },
            timestamp: data.created_at,
            polls: { support: 0, relate: 0, helpful: 0 },
            replies: 0
        });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
});

// Vote on a post poll
router.post('/posts/:id/vote', requireAuth, async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const { pollType, user_id } = req.body;
        if (!['support','relate','helpful'].includes(pollType)) {
            return res.status(400).json({ error: 'Invalid poll type' });
        }
        const effectiveUser = user_id || (req.user && req.user.id);
        // Check if reaction exists
        const { data: existing, error: existingErr } = await supabase
            .from('post_reactions')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', effectiveUser)
            .eq('reaction_type', pollType)
            .maybeSingle();
        if (existingErr) throw existingErr;
        if (existing) {
            // Toggle off -> delete
            const { error: delErr } = await supabase
                .from('post_reactions')
                .delete()
                .eq('id', existing.id);
            if (delErr) throw delErr;
        } else {
            // Insert
            const { error: insErr } = await supabase
                .from('post_reactions')
                .insert([{ post_id: postId, user_id: effectiveUser, reaction_type: pollType }]);
            if (insErr) throw insErr;
        }
        // Recount reactions
        const { data: countsData, error: countsError } = await supabase
            .from('post_reactions')
            .select('reaction_type, count:reaction_type', { count: 'exact' })
            .eq('post_id', postId);
        if (countsError) throw countsError;
        // Aggregate counts
        const counts = { support: 0, relate: 0, helpful: 0 };
        (countsData || []).forEach(r => { counts[r.reaction_type] = (counts[r.reaction_type] || 0) + 1; });
        // Update denormalized counts
        await supabase
            .from('community_posts')
            .update({ support_count: counts.support, relate_count: counts.relate, helpful_count: counts.helpful })
            .eq('id', postId);
        res.json({ success: true, polls: counts });
    } catch (error) {
        console.error('Error voting on post:', error);
        res.status(500).json({ error: 'Failed to vote' });
    }
});

// Add reply to a post
router.post('/posts/:id/reply', requireAuth, async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const { content, user_id } = req.body;
        if (!content || content.length > 300) {
            return res.status(400).json({ error: 'Invalid reply content' });
        }
        const safeReply = sanitizeText(content, { maxLength: 300 });
        const { data, error } = await supabase
            .from('post_replies')
            .insert([{ post_id: postId, user_id: user_id || (req.user && req.user.id), content: safeReply }])
            .select('*')
            .single();
        if (error) throw error;
        const profile = await getUserProfile(user_id || (req.user && req.user.id));
        res.status(201).json({
            id: data.id,
            content: data.content,
            author: profile ? { nickname: profile.nickname, avatar: profile.avatar } : { nickname: 'Anon', avatar: '🦋' },
            timestamp: data.created_at,
            support: 0
        });
    } catch (error) {
        console.error('Error adding reply:', error);
        res.status(500).json({ error: 'Failed to add reply' });
    }
});

// List replies for a post
router.get('/posts/:id/replies', optionalAuth, async (req, res) => {
    try {
        const postId = parseInt(req.params.id, 10);
        const { data, error } = await supabase
            .from('post_replies')
            .select('*')
            .eq('post_id', postId)
            .order('created_at', { ascending: true });
        if (error) throw error;
        const enriched = await Promise.all((data || []).map(async r => {
            const profile = await getUserProfile(r.user_id);
            return {
                id: r.id,
                content: r.content,
                author: profile ? { nickname: profile.nickname, avatar: profile.avatar } : { nickname: 'Anon', avatar: '🦋' },
                timestamp: r.created_at,
                support: r.support_count || 0
            };
        }));
        res.json(enriched);
    } catch (err) {
        console.error('Error fetching replies:', err);
        res.status(500).json({ error: 'Failed to fetch replies' });
    }
});

// Get all polls
router.get('/polls', optionalAuth, async (req, res) => {
    try {
        const { status } = req.query;
        let query = supabase.from('polls').select('*').order('created_at', { ascending: false });
        if (status) query = query.eq('status', status);
        const { data, error } = await query;
        if (error) throw error;
        // fetch options
        const pollIds = data.map(p => p.id);
        let options = [];
        if (pollIds.length) {
            const { data: optData } = await supabase.from('poll_options').select('*').in('poll_id', pollIds);
            options = optData || [];
        }
        // votes aggregated
        const enriched = await Promise.all(data.map(async p => {
            const profile = await getUserProfile(p.user_id);
            const pollOptions = options.filter(o => o.poll_id === p.id).map(o => ({ id: o.option_id, text: o.text, emoji: o.emoji }));
            // Count votes per option
            const { data: voteRows } = await supabase.from('poll_votes').select('option_id').eq('poll_id', p.id);
            const counts = {};
            (voteRows || []).forEach(v => { counts[v.option_id] = (counts[v.option_id] || 0) + 1; });
            const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);
            return {
                id: p.id,
                question: p.question,
                type: p.type,
                category: p.category,
                author: profile ? { nickname: profile.nickname, avatar: profile.avatar } : { nickname: 'Anon', avatar: '🦋' },
                timestamp: p.created_at,
                options: pollOptions,
                votes: counts,
                totalVotes,
                status: p.status
            };
        }));
        res.json(enriched);
    } catch (error) {
        console.error('Error fetching polls:', error);
        res.status(500).json({ error: 'Failed to fetch polls' });
    }
});

// Create a new poll
router.post('/polls', requireAuth, async (req, res) => {
    try {
        const { question, type, category, user_id, options, scale } = req.body;
        if (!question || !type) {
            return res.status(400).json({ error: 'Missing required fields' });
        }
        const safeQuestion = sanitizeText(question, { maxLength: 400 });
        const { data: pollData, error } = await supabase
            .from('polls')
            .insert([{ question: safeQuestion, type: sanitizeText(type, { maxLength: 30 }), category: sanitizeText(category, { maxLength: 50 }), user_id, scale_range: scale?.range }])
            .select('*')
            .single();
        if (error) throw error;
        if (options && options.length) {
            const optionRows = options.map(o => ({ poll_id: pollData.id, option_id: o.id, text: sanitizeText(o.text, { maxLength: 100 }), emoji: sanitizeText(o.emoji, { maxLength: 10 }) }));
            const { error: optError } = await supabase.from('poll_options').insert(optionRows);
            if (optError) throw optError;
        }
        const profile = await getUserProfile(user_id);
        res.status(201).json({
            id: pollData.id,
            question: pollData.question,
            type: pollData.type,
            category: pollData.category,
            author: profile ? { nickname: profile.nickname, avatar: profile.avatar } : { nickname: 'Anon', avatar: '🦋' },
            timestamp: pollData.created_at,
            options: options || [],
            votes: {},
            totalVotes: 0,
            status: pollData.status
        });
    } catch (error) {
        console.error('Error creating poll:', error);
        res.status(500).json({ error: 'Failed to create poll' });
    }
});

// Vote on a poll
router.post('/polls/:id/vote', requireAuth, async (req, res) => {
    try {
        const pollId = parseInt(req.params.id, 10);
        const { optionId, user_id } = req.body;
        if (!optionId) return res.status(400).json({ error: 'Missing option' });
        // Ensure poll exists
        const { data: pollRow, error: pollError } = await supabase.from('polls').select('id').eq('id', pollId).single();
        if (pollError || !pollRow) return res.status(404).json({ error: 'Poll not found' });
        // Insert vote (unique constraint handles one vote per user)
        const { error: voteError } = await supabase.from('poll_votes').insert([{ poll_id: pollId, option_id: optionId, user_id }]);
        if (voteError && voteError.code !== '23505') throw voteError; // ignore duplicate
        // Recount
        const { data: votesRows } = await supabase.from('poll_votes').select('option_id').eq('poll_id', pollId);
        const counts = {};
        (votesRows || []).forEach(v => { counts[v.option_id] = (counts[v.option_id] || 0) + 1; });
        const totalVotes = Object.values(counts).reduce((a, b) => a + b, 0);
        res.json({ success: true, votes: counts, totalVotes });
    } catch (error) {
        console.error('Error voting on poll:', error);
        res.status(500).json({ error: 'Failed to vote' });
    }
});

module.exports = router;
