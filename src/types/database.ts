import { SupabaseClient } from '@supabase/supabase-js';

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      prompts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          title: string;
          content: string;
          user_id: string;
          is_public: boolean;
          category_id: string | null;
          tags: string[] | null;
          version: number;
          is_favorite: boolean;
          usage_count: number;
          last_used_at: string | null;
          tag?: string; // For backward compatibility
          is_encrypted?: boolean; // For encrypted prompts
          encrypted_content?: string; // For encrypted prompts
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title: string;
          content: string;
          user_id: string;
          is_public?: boolean;
          category_id?: string | null;
          tags?: string[] | null;
          version?: number;
          is_favorite?: boolean;
          usage_count?: number;
          last_used_at?: string | null;
          tag?: string; // For backward compatibility
          is_encrypted?: boolean; // For encrypted prompts
          encrypted_content?: string; // For encrypted prompts
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          title?: string;
          content?: string;
          user_id?: string;
          is_public?: boolean;
          category_id?: string | null;
          tags?: string[] | null;
          version?: number;
          is_favorite?: boolean;
          usage_count?: number;
          last_used_at?: string | null;
          tag?: string; // For backward compatibility
          is_encrypted?: boolean; // For encrypted prompts
          encrypted_content?: string; // For encrypted prompts
        };
        Relationships: [
          {
            foreignKeyName: "prompts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prompts_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at?: string;
          first_name: string | null;
          last_name: string | null;
          avatar_url: string | null;
          email: string;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          email: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          first_name?: string | null;
          last_name?: string | null;
          avatar_url?: string | null;
          email?: string;
        };
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          created_at: string;
          name: string;
          description: string | null;
          user_id: string;
          color: string | null;
          icon: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          name: string;
          description?: string | null;
          user_id: string;
          color?: string | null;
          icon?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          name?: string;
          description?: string | null;
          user_id?: string;
          color?: string | null;
          icon?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "categories_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      prompt_versions: {
        Row: {
          id: string;
          created_at: string;
          prompt_id: string;
          content: string;
          version_number: number;
          title: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          prompt_id: string;
          content: string;
          version_number: number;
          title: string;
          user_id: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          prompt_id?: string;
          content?: string;
          version_number?: number;
          title?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompt_versions_prompt_id_fkey";
            columns: ["prompt_id"];
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prompt_versions_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      prompt_usage: {
        Row: {
          id: string;
          created_at: string;
          prompt_id: string;
          user_id: string;
          context: Json | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          prompt_id: string;
          user_id: string;
          context?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          prompt_id?: string;
          user_id?: string;
          context?: Json | null;
        };
        Relationships: [
          {
            foreignKeyName: "prompt_usage_prompt_id_fkey";
            columns: ["prompt_id"];
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prompt_usage_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      shared_prompts: {
        Row: {
          id: string;
          created_at: string;
          prompt_id: string;
          shared_by: string;
          shared_with: string;
          permissions: string;
        };
        Insert: {
          id?: string;
          created_at?: string;
          prompt_id: string;
          shared_by: string;
          shared_with: string;
          permissions: string;
        };
        Update: {
          id?: string;
          created_at?: string;
          prompt_id?: string;
          shared_by?: string;
          shared_with?: string;
          permissions?: string;
        };
        Relationships: [
          {
            foreignKeyName: "shared_prompts_prompt_id_fkey";
            columns: ["prompt_id"];
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shared_prompts_shared_by_fkey";
            columns: ["shared_by"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "shared_prompts_shared_with_fkey";
            columns: ["shared_with"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      users: {
        Row: {
          id: string;
          created_at: string;
          email: string;
          name: string | null;
          avatar_url: string | null;
          preferences: Json | null;
        };
        Insert: {
          id: string;
          created_at?: string;
          email: string;
          name?: string | null;
          avatar_url?: string | null;
          preferences?: Json | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          email?: string;
          name?: string | null;
          avatar_url?: string | null;
          preferences?: Json | null;
        };
        Relationships: [];
      };
      tags: {
        Row: {
          id: string;
          name: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      prompt_tags: {
        Row: {
          id: string;
          prompt_id: string;
          tag_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          prompt_id: string;
          tag_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          prompt_id?: string;
          tag_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompt_tags_prompt_id_fkey";
            columns: ["prompt_id"];
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prompt_tags_tag_id_fkey";
            columns: ["tag_id"];
            referencedRelation: "tags";
            referencedColumns: ["id"];
          }
        ];
      };
      templates: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          sequence: boolean;
          created_at: string;
          user_id: string;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          sequence?: boolean;
          created_at?: string;
          user_id: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          sequence?: boolean;
          created_at?: string;
          user_id?: string;
        };
        Relationships: [
          {
            foreignKeyName: "templates_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      template_prompts: {
        Row: {
          id: string;
          template_id: string;
          prompt_id: string;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          template_id: string;
          prompt_id: string;
          position: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          template_id?: string;
          prompt_id?: string;
          position?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "template_prompts_template_id_fkey";
            columns: ["template_id"];
            referencedRelation: "templates";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "template_prompts_prompt_id_fkey";
            columns: ["prompt_id"];
            referencedRelation: "prompts";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: {
      prompts_with_tags: {
        Row: {
          id: string;
          title: string;
          content: string;
          tag: string | null;
          created_at: string;
          updated_at: string;
          user_id: string;
          is_public: boolean;
          category_id: string | null;
          version: number;
          is_favorite: boolean;
          usage_count: number;
          last_used_at: string | null;
          tags: Json;
          is_encrypted?: boolean;
          encrypted_content?: string;
        };
        Relationships: [
          {
            foreignKeyName: "prompts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "prompts_category_id_fkey";
            columns: ["category_id"];
            referencedRelation: "categories";
            referencedColumns: ["id"];
          }
        ];
      };
      templates_with_prompts: {
        Row: {
          template_id: string;
          template_title: string;
          template_description: string | null;
          sequence: boolean;
          template_created_at: string;
          user_id: string;
          prompt_id: string | null;
          prompt_title: string | null;
          prompt_content: string | null;
          prompt_tag: string | null;
          prompt_created_at: string | null;
          position: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "templates_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      secure_prompts: {
        Row: {
          id: string;
          title: string;
          content: string;
          tag: string | null;
          created_at: string;
          user_id: string;
          is_encrypted: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "prompts_user_id_fkey";
            columns: ["user_id"];
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Functions: {
      encrypt_content: {
        Args: {
          content: string;
          key: string;
        };
        Returns: string;
      };
      decrypt_content: {
        Args: {
          encrypted_content: string;
          key: string;
        };
        Returns: string;
      };
    };
    Enums: {
      tag_type: 'general' | 'code' | 'writing' | 'chat' | 'other';
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];
export type Views<T extends keyof Database['public']['Views']> = Database['public']['Views'][T]['Row'];

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;

export type Prompt = Tables<'prompts'>;
export type Profile = Tables<'profiles'>;
export type Category = Tables<'categories'>;
export type PromptVersion = Tables<'prompt_versions'>;
export type PromptUsage = Tables<'prompt_usage'>;
export type SharedPrompt = Tables<'shared_prompts'>;
export type User = Tables<'users'>;
export type Tag = Tables<'tags'>;
export type PromptTag = Tables<'prompt_tags'>;
export type Template = Tables<'templates'>;
export type TemplatePrompt = Tables<'template_prompts'>;

export type PromptWithTags = Views<'prompts_with_tags'>;
export type TemplateWithPrompts = Views<'templates_with_prompts'>;
export type SecurePrompt = Views<'secure_prompts'>;

export type NewPrompt = InsertTables<'prompts'>;
export type NewProfile = InsertTables<'profiles'>;
export type NewCategory = InsertTables<'categories'>;
export type NewPromptVersion = InsertTables<'prompt_versions'>;
export type NewPromptUsage = InsertTables<'prompt_usage'>;
export type NewSharedPrompt = InsertTables<'shared_prompts'>;
export type NewUser = InsertTables<'users'>;
export type NewTag = InsertTables<'tags'>;
export type NewPromptTag = InsertTables<'prompt_tags'>;
export type NewTemplate = InsertTables<'templates'>;
export type NewTemplatePrompt = InsertTables<'template_prompts'>;

export type UpdatePrompt = UpdateTables<'prompts'>;
export type UpdateProfile = UpdateTables<'profiles'>;
export type UpdateCategory = UpdateTables<'categories'>;
export type UpdatePromptVersion = UpdateTables<'prompt_versions'>;
export type UpdatePromptUsage = UpdateTables<'prompt_usage'>;
export type UpdateSharedPrompt = UpdateTables<'shared_prompts'>;
export type UpdateUser = UpdateTables<'users'>;
export type UpdateTag = UpdateTables<'tags'>;
export type UpdatePromptTag = UpdateTables<'prompt_tags'>;
export type UpdateTemplate = UpdateTables<'templates'>;
export type UpdateTemplatePrompt = UpdateTables<'template_prompts'>;

// Type-safe client
export type TypedSupabaseClient = SupabaseClient<Database>; 

// No need for additional exports since all types are already exported individually
// export type { Json }; 
