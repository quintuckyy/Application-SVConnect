import { createClient } from "@supabase/supabase-js";

// Supabase only serves the home screen's announcement banner. If it isn't
// configured, the client is null and the banner keeps its default content.
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = url && anonKey ? createClient(url, anonKey) : null;
