import { createClient } from '@supabase/supabase-js';

// Get the URL and key from the environment variables or use the default
let supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://sktwshsqlqtpfqtduheh.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNrdHdzaHNxbHF0cGZxdGR1aGVoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODgyNjUwNjUsImV4cCI6MjEwMzg0MTA2NX0.Rh5nquXpCS7qp7eZw6eUaaksuBCtD8oWZDctTacYlCc';

// Clean up the URL if the user accidentally copied the /rest/v1 portion from their dashboard
supabaseUrl = supabaseUrl.trim().replace(/\/rest\/v1\/?$/, '');
// Also remove any trailing slash just to be perfectly clean
supabaseUrl = supabaseUrl.replace(/\/$/, '');

export const supabase = createClient(supabaseUrl, supabaseKey);
