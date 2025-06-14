import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
)
console.log('Supabase URL:', import.meta.env.VITE_SUPABASE_URL)
export default supabase
