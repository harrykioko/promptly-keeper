
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
  updated_at: string | null;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  tag: string;
  user_id: string;
  created_at: string;
}

export interface Template {
  id: string;
  title: string;
  description: string | null;
  sequence: boolean;
  user_id: string;
  created_at: string;
}

export interface TemplatePrompt {
  id: string;
  template_id: string;
  prompt_id: string;
  position: number;
}

export type Tag = {
  id: string;
  name: string;
};
