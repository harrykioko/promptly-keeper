// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://juxjuijwrrlgyfgskakf.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp1eGp1aWp3cnJsZ3lmZ3NrYWtmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE3MjA1NTQsImV4cCI6MjA1NzI5NjU1NH0.wbW_W-yivR90Xiz1xM42vw_TAeks9qlHEwLHfCfaB88";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);