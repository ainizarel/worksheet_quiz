// src/routes/leaderboard.js
const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    process.env.SUPABASE_URL || '',
    process.env.SUPABASE_ANON_KEY || ''
  )
  
// API to fetch leaderboard data
router.get('/leaderboard', async (req, res) => {
  const { worksheetId } = req.query;  // Get worksheetId from the query string

  // Query the 'scores' table in Supabase to get the leaderboard
  const { data, error } = await supabase
    .from('scores')
    .select('name, score')
    .eq('worksheet_id', worksheetId)  // Use the worksheetId passed from the frontend
    .order('score', { ascending: false });  // Sort by score in descending order

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);  // Send the leaderboard data back to the client
});

module.exports = router;
