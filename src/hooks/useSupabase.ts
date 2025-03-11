import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { User, Prompt, Category, PromptVersion, SharedPrompt } from '../types/database';

// Hook for authentication
export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Get the current user
    const getCurrentUser = async () => {
      try {
        setLoading(true);
        
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          const { data, error } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          if (error) throw error;
          setUser(data);
        }
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    getCurrentUser();

    // Listen for auth changes
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const { data } = await supabase
            .from('users')
            .select('*')
            .eq('id', session.user.id)
            .single();
            
          setUser(data || null);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({ 
        email, 
        password,
        options: {
          data: { name }
        }
      });
      
      if (authError) throw authError;
      
      if (authData.user) {
        // Create user record in users table
        const { error: userError } = await supabase.from('users').insert({
          id: authData.user.id,
          email,
          name
        });
        
        if (userError) throw userError;
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'));
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, error, signIn, signUp, signOut };
};

// Hook for prompts
export const usePrompts = (userId?: string) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    const fetchPrompts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .eq('user_id', userId)
          .order('updated_at', { ascending: false });
          
        if (error) throw error;
        setPrompts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchPrompts();

    // Subscribe to changes
    const promptsSubscription = supabase
      .channel('prompts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'prompts',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setPrompts(prev => [payload.new as Prompt, ...prev]);
          } else if (payload.eventType === 'UPDATE') {
            setPrompts(prev => 
              prev.map(prompt => 
                prompt.id === payload.new.id ? (payload.new as Prompt) : prompt
              )
            );
          } else if (payload.eventType === 'DELETE') {
            setPrompts(prev => 
              prev.filter(prompt => prompt.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(promptsSubscription);
    };
  }, [userId]);

  return { prompts, loading, error };
};

// Hook for categories
export const useCategories = (userId?: string) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('categories')
          .select('*')
          .eq('user_id', userId)
          .order('name');
          
        if (error) throw error;
        setCategories(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();

    // Subscribe to changes
    const categoriesSubscription = supabase
      .channel('categories_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'categories',
          filter: `user_id=eq.${userId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setCategories(prev => [...prev, payload.new as Category].sort((a, b) => a.name.localeCompare(b.name)));
          } else if (payload.eventType === 'UPDATE') {
            setCategories(prev => 
              prev.map(category => 
                category.id === payload.new.id ? (payload.new as Category) : category
              ).sort((a, b) => a.name.localeCompare(b.name))
            );
          } else if (payload.eventType === 'DELETE') {
            setCategories(prev => 
              prev.filter(category => category.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(categoriesSubscription);
    };
  }, [userId]);

  return { categories, loading, error };
};

// Hook for prompt versions
export const usePromptVersions = (promptId?: string) => {
  const [versions, setVersions] = useState<PromptVersion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!promptId) return;
    
    const fetchVersions = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('prompt_versions')
          .select('*')
          .eq('prompt_id', promptId)
          .order('version_number', { ascending: false });
          
        if (error) throw error;
        setVersions(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchVersions();

    // Subscribe to changes
    const versionsSubscription = supabase
      .channel('versions_changes')
      .on('postgres_changes', 
        { 
          event: 'INSERT', 
          schema: 'public', 
          table: 'prompt_versions',
          filter: `prompt_id=eq.${promptId}`
        }, 
        (payload) => {
          setVersions(prev => [payload.new as PromptVersion, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(versionsSubscription);
    };
  }, [promptId]);

  return { versions, loading, error };
};

// Hook for shared prompts
export const useSharedPrompts = (userId?: string) => {
  const [sharedPrompts, setSharedPrompts] = useState<SharedPrompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!userId) return;
    
    const fetchSharedPrompts = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('shared_prompts')
          .select(`
            *,
            prompts:prompt_id(*)
          `)
          .eq('shared_with', userId);
          
        if (error) throw error;
        setSharedPrompts(data || []);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchSharedPrompts();

    // Subscribe to changes
    const sharedPromptsSubscription = supabase
      .channel('shared_prompts_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'shared_prompts',
          filter: `shared_with=eq.${userId}`
        }, 
        (payload) => {
          if (payload.eventType === 'INSERT') {
            // Need to fetch the full data with the prompt
            fetchSharedPrompts();
          } else if (payload.eventType === 'DELETE') {
            setSharedPrompts(prev => 
              prev.filter(shared => shared.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(sharedPromptsSubscription);
    };
  }, [userId]);

  return { sharedPrompts, loading, error };
}; 