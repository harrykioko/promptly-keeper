
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

  const { data: prompts = [], isLoading: isLoadingPrompts } = useQuery({
    queryKey: ['prompts', userId],
    queryFn: async () => {
      if (!userId) return [];
      
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
      
      return data.map(prompt => ({
        id: prompt.id,
        title: prompt.title,
        content: prompt.content,
        tag: prompt.tag as TagType,
        createdAt: new Date(prompt.created_at),
      })) as Prompt[];
    },
    enabled: !!userId,
  });

  const createPromptMutation = useMutation({
    mutationFn: async (newPrompt: { title: string; content: string; tag: string }) => {
      if (!userId) throw new Error('User not authenticated');
      
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
        .select()
        .single();
      
      if (error) throw error;
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

  const handleCreatePrompt = (prompt: { title: string; content: string; tag: string }) => {
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
    handlePromptClick
  };
};
