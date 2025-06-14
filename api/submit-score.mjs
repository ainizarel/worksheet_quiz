import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_ANON_KEY || ''
)

export default async function handler(req, res) {
  console.log('Incoming request method:', req.method)

  if (req.method === 'POST') {
    const { name, worksheetId, studentId, score } = req.body

    if (!name || !worksheetId || !studentId || score === undefined) {
      return res.status(400).json({ error: 'Missing fields' })
    }

    // 🔒 Step 1: Get authorized students from worksheets table
    const { data: worksheet, error: worksheetError } = await supabase
      .from('worksheets')
      .select('authorized_students')
      .eq('worksheet_id', worksheetId)
      .maybeSingle()

    if (worksheetError) {
      console.error('Worksheet fetch error:', worksheetError.message)
      return res.status(500).json({ error: worksheetError.message })
    }

    if (!worksheet) {
      return res.status(404).json({ error: 'Worksheet not found' })
    }

    // 🔒 Step 2: Check if student is authorized
    if (!worksheet.authorized_students?.includes(studentId)) {
      return res.status(403).json({
        error: 'Not authorized to access this worksheet. Please consult your teacher.',
      })
    }

    // 🔒 Step 3: Check if already submitted
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

    // ✅ Step 4: Insert score
    const { error: insertError } = await supabase.from('scores').insert([
      {
        name,
        worksheet_id: worksheetId,
        student_id: studentId,
        score,
      },
    ])

    if (insertError) {
      console.error('Insert error:', insertError.message)
      return res.status(500).json({ error: insertError.message })
    }

    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
