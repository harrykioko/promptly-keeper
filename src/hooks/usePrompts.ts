
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from "@/components/ui/use-toast";
import { TagType } from '@/components/TagBadge';
import { Tag } from '@/types/database';

interface Prompt {
  id: string;
  title: string;
  content: string;
  tag: TagType;
  createdAt: Date;
  tags?: Tag[];
}

export const usePrompts = (userId?: string) => {
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [isLoadingPrompts, setIsLoadingPrompts] = useState(true);
  const [selectedTag, setSelectedTag] = useState<TagType>('all');
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { toast } = useToast();

  // Fetch prompts from Supabase
  useEffect(() => {
    if (!userId) return;
    
    const fetchPrompts = async () => {
      try {
        setIsLoadingPrompts(true);
        
        const { data, error } = await supabase
          .from('prompts')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform the data to include Date objects
          const transformedPrompts = data.map(prompt => ({
            id: prompt.id,
            title: prompt.title,
            content: prompt.content,
            tag: prompt.tag as TagType,
            createdAt: new Date(prompt.created_at),
            tags: [], // Initialize empty array for tags
          }));
          
          setPrompts(transformedPrompts);
        }
      } catch (error: any) {
        console.error('Error fetching prompts:', error);
        toast({
          title: "Failed to load prompts",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setIsLoadingPrompts(false);
      }
    };
    
    fetchPrompts();
  }, [userId, toast]);

  // Create a new prompt
  const handleCreatePrompt = async (promptData: { title: string; content: string; tag: string }) => {
    if (!userId) return;
    
    try {
      const { data, error } = await supabase
        .from('prompts')
        .insert([
          {
            title: promptData.title,
            content: promptData.content,
            tag: promptData.tag,
            user_id: userId,
          }
        ])
        .select();
        
      if (error) {
        throw error;
      }
      
      if (data && data.length > 0) {
        const newPrompt = {
          id: data[0].id,
          title: data[0].title,
          content: data[0].content,
          tag: data[0].tag as TagType,
          createdAt: new Date(data[0].created_at),
          tags: [],
        };
        
        setPrompts(current => [newPrompt, ...current]);
        
        toast({
          title: "Prompt created",
          description: "Your prompt has been created successfully.",
        });
      }
    } catch (error: any) {
      console.error('Error creating prompt:', error);
      toast({
        title: "Failed to create prompt",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Handle prompt click to show details
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
