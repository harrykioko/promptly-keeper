import { Database as SupabaseDatabase } from '@supabase/supabase-js';

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
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row'];
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert'];
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update'];

export type DbResult<T> = T extends PromiseLike<infer U> ? U : never;
export type DbResultOk<T> = T extends PromiseLike<{ data: infer U }> ? Exclude<U, null> : never;

export type Prompt = Tables<'prompts'>;
export type Category = Tables<'categories'>;
export type PromptVersion = Tables<'prompt_versions'>;
export type PromptUsage = Tables<'prompt_usage'>;
export type SharedPrompt = Tables<'shared_prompts'>;
export type User = Tables<'users'>;

export type NewPrompt = InsertTables<'prompts'>;
export type NewCategory = InsertTables<'categories'>;
export type NewPromptVersion = InsertTables<'prompt_versions'>;
export type NewPromptUsage = InsertTables<'prompt_usage'>;
export type NewSharedPrompt = InsertTables<'shared_prompts'>;
export type NewUser = InsertTables<'users'>;

export type UpdatePrompt = UpdateTables<'prompts'>;
export type UpdateCategory = UpdateTables<'categories'>;
export type UpdatePromptVersion = UpdateTables<'prompt_versions'>;
export type UpdatePromptUsage = UpdateTables<'prompt_usage'>;
export type UpdateSharedPrompt = UpdateTables<'shared_prompts'>;
export type UpdateUser = UpdateTables<'users'>;

// Type-safe client
export type TypedSupabaseClient = SupabaseDatabase<Database>; 