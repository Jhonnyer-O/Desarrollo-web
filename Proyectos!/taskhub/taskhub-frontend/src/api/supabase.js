import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://owvgpqyojjnxipxptvoz.supabase.co'
const supabaseAnonKey = 'sb_publishable_FzurowgsQJbMC906w6iH3A_6toTNnZk'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)