
// Add or update the existing database.ts file with the Profile type
export interface Profile {
  id: string;
  created_at: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  email: string;
  updated_at?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  tag: string;
  created_at: string;
  user_id: string;
  tags?: Tag[];
}

export interface Template {
  id: string;
  title: string;
  description: string | null;
  prompts: string[];
  sequence: boolean;
  created_at: string;
  user_id: string;
}

// Define a Json type for data from Supabase
export type Json = 
  | string
  | number
  | boolean
  | { [key: string]: Json | undefined }
  | Json[]
  | null;
