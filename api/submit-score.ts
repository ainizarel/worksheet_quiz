import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

// ✅ Only use process.env (no import.meta.env here)
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // ✅ GET: Return recent scores
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('created_at', { ascending: false });
  
    console.log('GET data:', data);
    console.log('GET error:', error);
  
    if (error) {
      return res.status(500).json({ error: error.message });
    }
  
    return res.status(200).json(data);
  }  

  // ✅ POST: Save new score
  if (req.method === 'POST') {
    const { name, worksheetId, score } = req.body;

    if (!name || !worksheetId || score === undefined) {
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { error } = await supabase.from('scores').insert([
      { name, worksheet_id: worksheetId, score }
    ]);

    if (error) {
      console.error('POST error:', error);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  // ❌ Other methods not allowed
  return res.status(405).json({ error: 'Method not allowed' });
}
