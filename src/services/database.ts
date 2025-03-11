import { supabase } from '@/lib/supabase';
import { 
  Profile, 
  Prompt, 
  Category, 
  PromptVersion, 
  PromptUsage,
  SharedPrompt,
  User,
  Tag,
  PromptTag,
  Template,
  TemplatePrompt,
  NewPrompt,
  NewProfile,
  NewCategory,
  UpdatePrompt,
  UpdateProfile,
  UpdateCategory
} from '@/types/database';

/**
 * Profile Operations
 */
export const profileService = {
  async fetchProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      console.error('Error fetching profile:', error);
      return null;
    }

    return data as Profile;
  },

  async createProfile(profile: NewProfile): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .insert(profile)
      .select()
      .single();

    if (error) {
      console.error('Error creating profile:', error);
      return null;
    }

    return data as Profile;
  },

  async updateProfile(userId: string, updates: UpdateProfile): Promise<Profile | null> {
    const { data, error } = await supabase
      .from('profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      console.error('Error updating profile:', error);
      return null;
    }

    return data as Profile;
  }
};

/**
 * Prompt Operations
 */
export const promptService = {
  async fetchPrompts(userId: string): Promise<Prompt[]> {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Error fetching prompts:', error);
      return [];
    }

    return data as Prompt[];
  },

  async fetchPromptById(promptId: string): Promise<Prompt | null> {
    const { data, error } = await supabase
      .from('prompts')
      .select('*')
      .eq('id', promptId)
      .single();

    if (error) {
      console.error('Error fetching prompt:', error);
      return null;
    }

    return data as Prompt;
  },

  async createPrompt(prompt: NewPrompt): Promise<Prompt | null> {
    const { data, error } = await supabase
      .from('prompts')
      .insert({
        ...prompt,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        version: 1,
        usage_count: 0,
        is_favorite: false,
      })
      .select()
      .single();

    if (error) {
      console.error('Error creating prompt:', error);
      return null;
    }

    return data as Prompt;
  },

  async updatePrompt(promptId: string, updates: UpdatePrompt): Promise<Prompt | null> {
    const { data, error } = await supabase
      .from('prompts')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', promptId)
      .select()
      .single();

    if (error) {
      console.error('Error updating prompt:', error);
      return null;
    }

    return data as Prompt;
  },

  async deletePrompt(promptId: string): Promise<boolean> {
    const { error } = await supabase
      .from('prompts')
      .delete()
      .eq('id', promptId);

    if (error) {
      console.error('Error deleting prompt:', error);
      return false;
    }

    return true;
  },

  async incrementUsageCount(promptId: string): Promise<boolean> {
    // First get the current prompt
    const { data: prompt, error: fetchError } = await supabase
      .from('prompts')
      .select('usage_count')
      .eq('id', promptId)
      .single();
      
    if (fetchError) {
      console.error('Error fetching prompt for usage count:', fetchError);
      return false;
    }
    
    // Then increment the usage count
    const { error } = await supabase
      .from('prompts')
      .update({
        usage_count: (prompt?.usage_count || 0) + 1,
        last_used_at: new Date().toISOString()
      })
      .eq('id', promptId);

    if (error) {
      console.error('Error incrementing usage count:', error);
      return false;
    }

    return true;
  }
};

/**
 * Category Operations
 */
export const categoryService = {
  async fetchCategories(userId: string): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) {
      console.error('Error fetching categories:', error);
      return [];
    }

    return data as Category[];
  },

  async fetchCategoryById(categoryId: string): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', categoryId)
      .single();

    if (error) {
      console.error('Error fetching category:', error);
      return null;
    }

    return data as Category;
  },

  async createCategory(category: NewCategory): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .insert(category)
      .select()
      .single();

    if (error) {
      console.error('Error creating category:', error);
      return null;
    }

    return data as Category;
  },

  async updateCategory(categoryId: string, updates: UpdateCategory): Promise<Category | null> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', categoryId)
      .select()
      .single();

    if (error) {
      console.error('Error updating category:', error);
      return null;
    }

    return data as Category;
  },

  async deleteCategory(categoryId: string): Promise<boolean> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId);

    if (error) {
      console.error('Error deleting category:', error);
      return false;
    }

    return true;
  }
}; 