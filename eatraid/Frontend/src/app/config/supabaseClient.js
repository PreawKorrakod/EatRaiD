import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://gemuxctpjqhmwbtxrpul.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_ANON_KEY
export const supabase = createClient(supabaseUrl, supabaseKey)
export const api_port = 3300
export const web_port = 3000
export const NEXT_PUBLIC_BASE_API_URL = `http://localhost:${api_port}`
export const NEXT_PUBLIC_BASE_WEB_URL = `http://localhost:${web_port}`

 