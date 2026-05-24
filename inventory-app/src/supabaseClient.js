import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://bktxzbpwsbjoxtsmzpxe.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJrdHh6YnB3c2Jqb3h0c216cHhlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkzMDM0MjgsImV4cCI6MjA5NDg3OTQyOH0.AXHuhMUTcR6l6q452iw3TMkkKKtHX1VgeP8UgyhGz4I"

export const supabase = createClient(supabaseUrl, supabaseAnonKey)