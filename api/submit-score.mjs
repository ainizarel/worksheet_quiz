import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
)

export default async function handler(req, res) {
  console.log('Incoming request method:', req.method)

  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      console.error('GET error:', error.message)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json(data)
  }

  if (req.method === 'POST') {
    const { name, worksheetId, score, studentId } = req.body

    if (!name || !worksheetId || !studentId || score === undefined) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    // 🔒 1. Check if student is authorized
    const { data: authorized, error: authError } = await supabase
      .from('authorized_ids')
      .select('*')
      .eq('worksheet_id', worksheetId)
      .eq('student_id', studentId)
      .maybeSingle()

    if (authError) {
      console.error('Auth check error:', authError.message)
      return res.status(500).json({ error: authError.message })
    }

    if (!authorized) {
      return res.status(403).json({ error: 'Not authorized to access this worksheet.' })
    }

    // 🔒 2. Check if already submitted
    const { data: existing, error: checkError } = await supabase
      .from('scores')
      .select('id')
      .eq('student_id', studentId)
      .eq('worksheet_id', worksheetId)
      .maybeSingle()

    if (checkError) {
      console.error('Check error:', checkError.message)
      return res.status(500).json({ error: checkError.message })
    }

    if (existing) {
      return res.status(409).json({ error: 'You have already submitted this worksheet.' })
    }

    // ✅ 3. Insert new submission
    const { error } = await supabase.from('scores').insert([
      { name, worksheet_id: worksheetId, student_id: studentId, score }
    ])

    if (error) {
      console.error('POST error:', error.message)
      return res.status(500).json({ error: error.message })
    }

    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
