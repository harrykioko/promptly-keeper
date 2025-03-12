
export interface Profile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  avatar_url: string | null;
}

export interface Prompt {
  id: string;
  title: string;
  content: string;
  tag: string;
  created_at: string;
  user_id: string;
}

export interface Template {
  id: string;
  title: string;
  description: string | null;
  sequence: boolean;
  created_at: string;
  user_id: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface TemplatePrompt {
  id: string;
  template_id: string;
  prompt_id: string;
  position: number;
}

// Type definitions for new data
export type NewPrompt = Omit<Prompt, 'id' | 'created_at'>;
export type NewTemplate = Omit<Template, 'id' | 'created_at'>;
export type NewTemplatePrompt = Omit<TemplatePrompt, 'id'>;

// Type definitions for updates
export type UpdatePrompt = Partial<Omit<Prompt, 'id' | 'created_at' | 'user_id'>>;
export type UpdateProfile = Partial<Omit<Profile, 'id'>>;
export type UpdateCategory = { name: string };

// Additional types that might be needed
export type User = any;
export type Category = any;
export type PromptVersion = any;
export type PromptUsage = any;
export type SharedPrompt = any;
export type NewCategory = any;
export type PromptTag = any;

// Complex types
export interface TemplateWithPrompts extends Template {
  prompts: Prompt[];
}
