import { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';

console.log('SUPABASE_URL:', process.env.SUPABASE_URL);
console.log('SUPABASE_ANON_KEY:', process.env.SUPABASE_ANON_KEY);

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  console.log('Request method:', req.method);
  console.log('Request body:', req.body);

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Supabase GET error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json(data);
  }

  if (req.method === 'POST') {
    const { name, worksheetId, score } = req.body;

    console.log('POST data:', { name, worksheetId, score });

    if (!name || !worksheetId || score === undefined) {
      console.warn('Missing fields in POST data');
      return res.status(400).json({ error: 'Missing fields' });
    }

    const { error } = await supabase.from('scores').insert([
      { name, worksheet_id: worksheetId, score }
    ]);

    if (error) {
      console.error('Supabase INSERT error:', error.message);
      return res.status(500).json({ error: error.message });
    }

    return res.status(200).json({ success: true });
  }

  console.warn('Method not allowed');
  return res.status(405).json({ error: 'Method not allowed' });
}
