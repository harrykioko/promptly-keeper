
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { TagType } from '@/components/TagBadge';

export interface Prompt {
  id: string;
  title: string;
  content: string;
  tag: TagType;
  createdAt: Date;
}

export const usePrompts = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: promptsData, isLoading: isLoadingPrompts } = useQuery({
    queryKey: ['prompts', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      console.log('Fetching prompts for user ID:', userId);
      
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
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
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        tag: prompt.tag as TagType,
        createdAt: new Date(prompt.created_at),
      }));
    },
    enabled: !!userId,
  });

  const createPromptMutation = useMutation({
    mutationFn: async (newPrompt: { title: string; content: string; tag: string }) => {
      if (!userId) throw new Error('User not authenticated');
      
      console.log('Creating prompt for user ID:', userId);
      
      const { data, error } = await supabase
        .from('prompts')
        .insert([
          {
            title: newPrompt.title,
            content: newPrompt.content,
            tag: newPrompt.tag,
            user_id: userId,
          }
        ])
        .select();
      
      if (error) {
        console.error('Error creating prompt:', error);
        throw error;
      }
      
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['prompts', userId] });
      toast({
        title: "Prompt created",
        description: "Your prompt has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating prompt",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreatePrompt = (prompt: { title: string; content: string; tag: string }) => {
    createPromptMutation.mutate(prompt);
  };

  const handlePromptClick = (prompt: Prompt) => {
    setSelectedPrompt(prompt);
    setDetailDialogOpen(true);
  };

  return {
    prompts: promptsData || [],
    isLoadingPrompts,
    selectedTag,
    setSelectedTag,
    selectedPrompt,
    detailDialogOpen,
    setDetailDialogOpen,
    handleCreatePrompt,
    handlePromptClick
  };
};
