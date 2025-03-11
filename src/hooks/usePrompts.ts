import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { TagType } from '@/components/TagBadge';
import { Prompt as DbPrompt, NewPrompt } from '@/types/database';

export interface Tag {
  id: string;
  name: string;
}

// Extended Prompt interface that includes UI-specific properties
export interface Prompt extends Omit<DbPrompt, 'tags'> {
  tag: TagType;
  tags: Tag[];
  createdAt: Date;
  isEncrypted?: boolean;
  position?: number; // Add position property for template ordering
}

export const usePrompts = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: prompts = [], isLoading: isLoadingPrompts } = useQuery({
    queryKey: ['prompts', userId, selectedTag],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching prompts for user ID:', userId);
      
      // Use the prompts_with_tags view for better performance
      let query = supabase
        .from('prompts_with_tags')
        .select('*')
        .eq('user_id', userId);
      
      // Apply tag filter if selected
      if (selectedTag) {
        query = query.eq('tag', selectedTag);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching prompts:', error);
        toast({
          title: 'Error fetching prompts',
          description: error.message,
          variant: 'destructive',
        });
        return [];
      }
      
      console.log('Prompts fetched:', data);
      
      return data.map(prompt => ({
        ...prompt,
        createdAt: new Date(prompt.created_at),
        tags: prompt.tags as Tag[],
      })) as Prompt[];
    },
    enabled: !!userId,
  });

  const { data: availableTags = [] } = useQuery({
    queryKey: ['tags'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tags')
        .select('*')
        .order('name');
      
      if (error) {
        console.error('Error fetching tags:', error);
        return [];
      }
      
      return data as Tag[];
    },
  });

  const createPromptMutation = useMutation({
    mutationFn: async (newPrompt: { 
      title: string; 
      content: string; 
      tag: string;
      isEncrypted?: boolean;
      tagIds?: string[];
    }) => {
      if (!userId) throw new Error('User not authenticated');
      
      console.log('Creating prompt for user ID:', userId, 'Prompt:', newPrompt);
      
      // Start a transaction
      // 1. Create the prompt
      const promptData: NewPrompt = {
        title: newPrompt.title,
        content: newPrompt.content,
        user_id: userId,
        is_public: false,
        version: 1,
        is_favorite: false,
        usage_count: 0,
      };
      
      // Add tag-related fields
      if (newPrompt.tag) {
        promptData.tags = [newPrompt.tag];
      }
      
      // Add encryption-related fields if needed
      if (newPrompt.isEncrypted) {
        const encryptedContent = await encryptContent(newPrompt.content);
        if (encryptedContent) {
          // These fields would be added to the actual database schema
          // but we're using them here for compatibility with the UI
          (promptData as any).is_encrypted = true;
          (promptData as any).encrypted_content = encryptedContent;
        }
      }
      
      const { data, error: promptError } = await supabase
        .from('prompts')
        .insert(promptData)
        .select()
        .single();
      
      if (promptError) {
        console.error('Error creating prompt:', promptError);
        throw promptError;
      }
      
      // 2. Add tags if provided
      if (newPrompt.tagIds && newPrompt.tagIds.length > 0 && data) {
        const promptTags = newPrompt.tagIds.map(tagId => ({
          prompt_id: data.id,
          tag_id: tagId
        }));
        
        const { error: tagError } = await supabase
          .from('prompt_tags')
          .insert(promptTags);
        
        if (tagError) {
          console.error('Error adding tags to prompt:', tagError);
          // Continue anyway, the prompt was created successfully
        }
      }
      
      console.log('Prompt created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', userId] });
      toast({
        title: "Success",
        description: "Your prompt has been saved successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Helper function to encrypt content
  const encryptContent = async (content: string): Promise<string | null> => {
    try {
      // In a real app, you would use a secure encryption key from environment variables
      // For this example, we'll use a placeholder
      const encryptionKey = 'PLACEHOLDER_ENCRYPTION_KEY';
      
      const { data, error } = await supabase.rpc('encrypt_content', {
        content,
        key: encryptionKey
      });
      
      if (error) {
        console.error('Error encrypting content:', error);
        return null;
      }
      
      return data;
    } catch (error) {
      console.error('Error encrypting content:', error);
      return null;
    }
  };

  const handleCreatePrompt = (prompt: { 
    title: string; 
    content: string; 
    tag: string;
    isEncrypted?: boolean;
    tagIds?: string[];
  }) => {
    createPromptMutation.mutate(prompt);
  };

  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setDetailDialogOpen(true);
  };

  return {
    prompts,
    isLoadingPrompts,
    selectedTag,
    setSelectedTag,
    selectedPrompt,
    detailDialogOpen,
    setDetailDialogOpen,
    handleCreatePrompt,
    handlePromptClick,
    availableTags
  };
};
