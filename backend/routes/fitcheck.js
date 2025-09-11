const express = require('express');
const router = express.Router();
const supabase = require('../../utils/supabase');
const { requireAuth } = require('../../middleware/auth');
const { sanitizeText } = require('../utils/sanitize');

router.use((req, res, next) => {
  if (!supabase) return res.status(500).json({ error: 'Database not configured' });
  next();
});

// Record a new assessment
router.post('/', requireAuth, async (req, res) => {
  try {
  const { user_id, mood, stress, energy, notes } = req.body;
    if (![mood, stress, energy].every(v => Number.isInteger(v) && v >= 1 && v <= 5)) {
      return res.status(400).json({ error: 'Invalid mood/stress/energy values' });
    }
    const { data, error } = await supabase
      .from('fitcheck_assessments')
      .insert([{ user_id, mood, stress, energy, notes: sanitizeText(notes, { maxLength: 1000 }) }])
      .select('*')
      .single();
    if (error) throw error;
    res.status(201).json(data);
  } catch (err) {
    console.error('FitCheck create error', err);
    res.status(500).json({ error: 'Failed to record assessment' });
  }
});

// Recent assessments for user
router.get('/history', requireAuth, async (req, res) => {
  try {
    const { user_id, limit = 30 } = req.query;
    if (!user_id) return res.status(400).json({ error: 'user_id required' });
    const { data, error } = await supabase
      .from('fitcheck_assessments')
      .select('*')
      .eq('user_id', user_id)
      .order('created_at', { ascending: false })
      .limit(Number(limit));
    if (error) throw error;
    res.json(data);
  } catch (err) {
    console.error('FitCheck history error', err);
    res.status(500).json({ error: 'Failed to load history' });
  }
});

module.exports = router;