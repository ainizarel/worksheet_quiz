// ✅ FIXED VERSION: submit-score.mjs
import { createClient } from '@supabase/supabase-js';

// Create Supabase client using environment variables
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
);

export default async function handler(req, res) {
  console.log('Incoming request method:', req.method);

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('GET error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, worksheetId, score } = req.body;

    if (!name || !worksheetId || score === undefined) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { error } = await supabase.from('scores').insert([
      { name, worksheet_id: worksheetId, score }
    ]);

    if (error) {
      console.error('POST error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}
