import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://bljbxzchhcjrhwntwell.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJsamJ4emNoaGNqcmh3bnR3ZWxsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI5NjIyOTAsImV4cCI6MjA3ODUzODI5MH0.GH1LBv3Yn9xn26mvq5eIZ9Bu7RNgcJ0HtXrd5cSSHoY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

