import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://gemuxctpjqhmwbtxrpul.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_ANON_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

export default supabase
 