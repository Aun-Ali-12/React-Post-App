import { createClient } from "@supabase/supabase-js";
const supabaseUrl = "https://fedfhzlwptkeysmxrfdw.supabase.co";
const supabaseKey = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZlZGZoemx3cHRrZXlzbXhyZmR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTk0MzIzNTcsImV4cCI6MjA3NTAwODM1N30.tKMkzLC0bxbFYsKfj-j-7k2A2PGFOPDM6caXxZ3kgTY`;
export const supabase = createClient(supabaseUrl, supabaseKey);