import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import PromptCard from '@/components/PromptCard';
import CreatePromptDialog from '@/components/CreatePromptDialog';
import TagFilter from '@/components/TagFilter';
import PromptDetailDialog from '@/components/PromptDetailDialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { TagType } from '@/components/TagBadge';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

interface Prompt {
  id: string;
  title: string;
  content: string;
  tag: TagType;
  createdAt: Date;
}

const Index = () => {
  const [selectedTag, setSelectedTag] = useState<TagType | null>(null);
  const [selectedPrompt, setSelectedPrompt] = useState<Prompt | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [isLoading, user, navigate]);

  const { data: promptsData, isLoading: isLoadingPrompts } = useQuery({
    queryKey: ['prompts'],
    queryFn: async () => {
      if (!user) return [];
      
      const { data, error } = await supabase
        .from('prompts')
        .select('*')
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
      }));
    },
    enabled: !!user,
  });

  const createPromptMutation = useMutation({
    mutationFn: async (newPrompt: { title: string; content: string; tag: string }) => {
      if (!user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase
        .from('prompts')
        .insert([
          {
            title: newPrompt.title,
            content: newPrompt.content,
            tag: newPrompt.tag,
            user_id: user.id,
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
      queryClient.invalidateQueries({ queryKey: ['prompts'] });
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

  const prompts = promptsData || [];
  
  const availableTags = Array.from(
    new Set(prompts.map(prompt => prompt.tag))
  ) as TagType[];

  const filteredPrompts = selectedTag 
    ? prompts.filter(prompt => prompt.tag === selectedTag)
    : prompts;

  if (isLoading || !user) {
    return null;
  }

  const displayName = profile?.first_name || user.email?.split('@')[0] || 'there';

  return (
    <div className="container px-4 py-8 mx-auto fade-in">
      <div className="flex flex-col items-start gap-6">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-4xl font-bold">Promptly</h1>
            <p className="text-muted-foreground">Welcome, {displayName}</p>
          </div>
          <div className="flex items-center gap-4">
            <CreatePromptDialog onCreatePrompt={handleCreatePrompt} />
            <Button variant="outline" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {isLoadingPrompts ? (
          <div className="w-full text-center py-12">
            <p className="text-muted-foreground">Loading prompts...</p>
          </div>
        ) : (
          <>
            {prompts.length > 0 && (
              <TagFilter 
                tags={availableTags} 
                selectedTag={selectedTag} 
                onSelectTag={setSelectedTag} 
              />
            )}
            
            {filteredPrompts.length === 0 ? (
              <div className="w-full text-center py-12">
                <p className="text-muted-foreground">
                  {prompts.length === 0 
                    ? "No prompts yet. Create your first prompt to get started!" 
                    : "No prompts match the selected filter."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {filteredPrompts.map((prompt) => (
                  <PromptCard
                    key={prompt.id}
                    id={prompt.id}
                    title={prompt.title}
                    content={prompt.content}
                    tag={prompt.tag}
                    createdAt={prompt.createdAt}
                    onClick={() => handlePromptClick(prompt)}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      <PromptDetailDialog 
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        prompt={selectedPrompt}
      />
    </div>
  );
};

export default Index;
