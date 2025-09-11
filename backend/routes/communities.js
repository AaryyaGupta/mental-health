const express = require("express");
const router = express.Router();

// In-memory storage for demo (in production, use a database)
let posts = [
    {
        id: 1,
        content: "How do you handle exam stress? I feel like I'm drowning in assignments and can barely sleep. Any tips?",
        community: "exam-stress",
        author: { nickname: "StressedStudent", avatar: "😅" },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        polls: { support: 12, relate: 8, helpful: 3 },
        replies: []
    }
];

let polls = [
    {
        id: 1,
        question: "How ready are you for midterm exams?",
        type: "emoji",
        category: "academic",
        author: { nickname: "StudyBuddy", avatar: "📚" },
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        options: [
            { id: 'ready', text: 'Ready', emoji: '✅' },
            { id: 'somewhat', text: 'Somewhat', emoji: '😅' },
            { id: 'not-ready', text: 'Not ready', emoji: '😭' }
        ],
        votes: { ready: 12, somewhat: 25, 'not-ready': 18 },
        totalVotes: 55,
        status: 'active'
    }
];

// Get all posts or filter by community
router.get("/posts", (req, res) => {
    try {
        const { community } = req.query;
        let filteredPosts = posts;
        
        if (community && community !== 'all') {
            filteredPosts = posts.filter(post => post.community === community);
        }
        
        // Sort by newest first
        filteredPosts.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        res.json(filteredPosts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ error: "Failed to fetch posts" });
    }
});

// Create a new post
router.post("/posts", (req, res) => {
    try {
        const { content, community, author } = req.body;
        
        // Validation
        if (!content || !community || !author) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        if (content.length > 500) {
            return res.status(400).json({ error: "Content too long" });
        }
        
        const newPost = {
            id: Date.now() + Math.random(),
            content: content.trim(),
            community,
            author,
            timestamp: new Date(),
            polls: { support: 0, relate: 0, helpful: 0 },
            replies: []
        };
        
        posts.unshift(newPost);
        res.status(201).json(newPost);
    } catch (error) {
        console.error("Error creating post:", error);
        res.status(500).json({ error: "Failed to create post" });
    }
});

// Vote on a post poll
router.post("/posts/:id/vote", (req, res) => {
    try {
        const postId = parseFloat(req.params.id);
        const { pollType } = req.body;
        
        const post = posts.find(p => p.id === postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        if (!['support', 'relate', 'helpful'].includes(pollType)) {
            return res.status(400).json({ error: "Invalid poll type" });
        }
        
        post.polls[pollType]++;
        res.json({ success: true, polls: post.polls });
    } catch (error) {
        console.error("Error voting on post:", error);
        res.status(500).json({ error: "Failed to vote" });
    }
});

// Add reply to a post
router.post("/posts/:id/reply", (req, res) => {
    try {
        const postId = parseFloat(req.params.id);
        const { content, author } = req.body;
        
        const post = posts.find(p => p.id === postId);
        if (!post) {
            return res.status(404).json({ error: "Post not found" });
        }
        
        if (!content || !author || content.length > 300) {
            return res.status(400).json({ error: "Invalid reply content" });
        }
        
        const reply = {
            id: Date.now() + Math.random(),
            content: content.trim(),
            author,
            timestamp: new Date(),
            support: 0
        };
        
        post.replies.push(reply);
        res.status(201).json(reply);
    } catch (error) {
        console.error("Error adding reply:", error);
        res.status(500).json({ error: "Failed to add reply" });
    }
});

// Get all polls
router.get("/polls", (req, res) => {
    try {
        const { status } = req.query;
        let filteredPolls = polls;
        
        if (status) {
            filteredPolls = polls.filter(poll => poll.status === status);
        }
        
        // Sort by newest first
        filteredPolls.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        
        res.json(filteredPolls);
    } catch (error) {
        console.error("Error fetching polls:", error);
        res.status(500).json({ error: "Failed to fetch polls" });
    }
});

// Create a new poll
router.post("/polls", (req, res) => {
    try {
        const { question, type, category, author, options, scale } = req.body;
        
        // Validation
        if (!question || !type || !category || !author) {
            return res.status(400).json({ error: "Missing required fields" });
        }
        
        const newPoll = {
            id: Date.now() + Math.random(),
            question: question.trim(),
            type,
            category,
            author,
            timestamp: new Date(),
            votes: {},
            totalVotes: 0,
            status: 'active'
        };
        
        // Add type-specific data
        if (options) {
            newPoll.options = options;
            options.forEach(option => {
                newPoll.votes[option.id] = 0;
            });
        }
        
        if (scale) {
            newPoll.scale = scale;
            for (let i = 1; i <= scale.range; i++) {
                newPoll.votes[i] = 0;
            }
        }
        
        polls.unshift(newPoll);
        res.status(201).json(newPoll);
    } catch (error) {
        console.error("Error creating poll:", error);
        res.status(500).json({ error: "Failed to create poll" });
    }
});

// Vote on a poll
router.post("/polls/:id/vote", (req, res) => {
    try {
        const pollId = parseFloat(req.params.id);
        const { optionId } = req.body;
        
        const poll = polls.find(p => p.id === pollId);
        if (!poll) {
            return res.status(404).json({ error: "Poll not found" });
        }
        
        if (poll.votes[optionId] === undefined) {
            return res.status(400).json({ error: "Invalid option" });
        }
        
        poll.votes[optionId]++;
        poll.totalVotes++;
        
        res.json({ success: true, votes: poll.votes, totalVotes: poll.totalVotes });
    } catch (error) {
        console.error("Error voting on poll:", error);
        res.status(500).json({ error: "Failed to vote" });
    }
});

module.exports = router;
