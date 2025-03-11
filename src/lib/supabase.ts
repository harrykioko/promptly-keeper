import { createClient } from '@supabase/supabase-js';
import { Database, TypedSupabaseClient } from '../types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey) as TypedSupabaseClient;

// Helper functions for common database operations

// Prompts
export const getPrompts = async (userId: string) => {
  return supabase
    .from('prompts')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false });
};

export const getPromptById = async (id: string) => {
  return supabase
    .from('prompts')
    .select('*')
    .eq('id', id)
    .single();
};

export const createPrompt = async (prompt: {
  title: string;
  content: string;
  user_id: string;
  category_id?: string | null;
  tags?: string[] | null;
  is_public?: boolean;
}) => {
  const { title, content, user_id, category_id, tags, is_public } = prompt;
  
  return supabase.from('prompts').insert({
    title,
    content,
    user_id,
    category_id,
    tags,
    is_public: is_public ?? false,
    version: 1,
    is_favorite: false,
    usage_count: 0,
  });
};

export const updatePrompt = async (
  id: string,
  updates: {
    title?: string;
    content?: string;
    category_id?: string | null;
    tags?: string[] | null;
    is_public?: boolean;
    is_favorite?: boolean;
  }
) => {
  // Update the updated_at timestamp
  const updatedData = {
    ...updates,
    updated_at: new Date().toISOString(),
  };
  
  return supabase
    .from('prompts')
    .update(updatedData)
    .eq('id', id);
};

export const deletePrompt = async (id: string) => {
  return supabase
    .from('prompts')
    .delete()
    .eq('id', id);
};

export const incrementPromptUsage = async (id: string) => {
  // First get the current usage count
  const { data, error } = await supabase
    .from('prompts')
    .select('usage_count')
    .eq('id', id)
    .single();
  
  if (error || !data) {
    return { error };
  }
  
  // Then increment it
  return supabase
    .from('prompts')
    .update({
      usage_count: data.usage_count + 1,
      last_used_at: new Date().toISOString(),
    })
    .eq('id', id);
};

// Categories
export const getCategories = async (userId: string) => {
  return supabase
    .from('categories')
    .select('*')
    .eq('user_id', userId)
    .order('name');
};

export const createCategory = async (category: {
  name: string;
  user_id: string;
  description?: string | null;
  color?: string | null;
  icon?: string | null;
}) => {
  return supabase.from('categories').insert(category);
};

export const updateCategory = async (
  id: string,
  updates: {
    name?: string;
    description?: string | null;
    color?: string | null;
    icon?: string | null;
  }
) => {
  return supabase
    .from('categories')
    .update(updates)
    .eq('id', id);
};

export const deleteCategory = async (id: string) => {
  return supabase
    .from('categories')
    .delete()
    .eq('id', id);
};

// Prompt Versions
export const getPromptVersions = async (promptId: string) => {
  return supabase
    .from('prompt_versions')
    .select('*')
    .eq('prompt_id', promptId)
    .order('version_number', { ascending: false });
};

export const createPromptVersion = async (version: {
  prompt_id: string;
  content: string;
  version_number: number;
  title: string;
  user_id: string;
}) => {
  return supabase.from('prompt_versions').insert(version);
};

// Shared Prompts
export const getSharedPrompts = async (userId: string) => {
  return supabase
    .from('shared_prompts')
    .select(`
      *,
      prompts:prompt_id(*)
    `)
    .eq('shared_with', userId);
};

export const sharePrompt = async (share: {
  prompt_id: string;
  shared_by: string;
  shared_with: string;
  permissions: string;
}) => {
  return supabase.from('shared_prompts').insert(share);
};

export const removeSharedPrompt = async (id: string) => {
  return supabase
    .from('shared_prompts')
    .delete()
    .eq('id', id);
};

// Prompt Usage
export const recordPromptUsage = async (usage: {
  prompt_id: string;
  user_id: string;
  context?: any;
}) => {
  return supabase.from('prompt_usage').insert(usage);
};

export const getPromptUsageHistory = async (promptId: string) => {
  return supabase
    .from('prompt_usage')
    .select('*')
    .eq('prompt_id', promptId)
    .order('created_at', { ascending: false });
};

// Tags
export const getTags = async () => {
  return supabase
    .from('tags')
    .select('*')
    .order('name');
};

export const createTag = async (name: string) => {
  return supabase.from('tags').insert({ name });
};

// Prompt Tags
export const getPromptTags = async (promptId: string) => {
  return supabase
    .from('prompt_tags')
    .select(`
      *,
      tags:tag_id(*)
    `)
    .eq('prompt_id', promptId);
};

export const addTagToPrompt = async (promptId: string, tagId: string) => {
  return supabase.from('prompt_tags').insert({
    prompt_id: promptId,
    tag_id: tagId
  });
};

export const removeTagFromPrompt = async (promptId: string, tagId: string) => {
  return supabase
    .from('prompt_tags')
    .delete()
    .eq('prompt_id', promptId)
    .eq('tag_id', tagId);
};

// Templates
export const getTemplates = async (userId: string) => {
  return supabase
    .from('templates_with_prompts')
    .select('*')
    .eq('user_id', userId);
};

export const getTemplateById = async (id: string) => {
  return supabase
    .from('templates_with_prompts')
    .select('*')
    .eq('template_id', id);
};

export const createTemplate = async (template: {
  title: string;
  description: string | null;
  sequence: boolean;
  user_id: string;
}) => {
  return supabase.from('templates').insert(template);
};

export const updateTemplate = async (
  id: string,
  updates: {
    title?: string;
    description?: string | null;
    sequence?: boolean;
  }
) => {
  return supabase
    .from('templates')
    .update(updates)
    .eq('id', id);
};

export const deleteTemplate = async (id: string) => {
  return supabase
    .from('templates')
    .delete()
    .eq('id', id);
};

// Template Prompts
export const addPromptToTemplate = async (
  templateId: string,
  promptId: string,
  position: number
) => {
  return supabase.from('template_prompts').insert({
    template_id: templateId,
    prompt_id: promptId,
    position
  });
};

export const updatePromptPosition = async (
  id: string,
  position: number
) => {
  return supabase
    .from('template_prompts')
    .update({ position })
    .eq('id', id);
};

export const removePromptFromTemplate = async (
  templateId: string,
  promptId: string
) => {
  return supabase
    .from('template_prompts')
    .delete()
    .eq('template_id', templateId)
    .eq('prompt_id', promptId);
}; 