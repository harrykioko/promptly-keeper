import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import PromptDetailDialog from '@/components/PromptDetailDialog';
import TagFilter from '@/components/TagFilter';
import PromptHeader from '@/components/PromptHeader';
import PromptList from '@/components/PromptList';
import { usePrompts } from '@/hooks/usePrompts';
import { useToast } from '@/components/ui/use-toast';

const Index = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('No user found, redirecting to auth page');
      navigate('/auth');
    } else if (user) {
      console.log('User authenticated:', user.id);
    }
  }, [isLoading, user, navigate]);

  const {
    prompts,
    isLoadingPrompts,
    selectedTag,
    setSelectedTag,
    selectedPrompt,
    detailDialogOpen,
    setDetailDialogOpen,
    handleCreatePrompt,
    handlePromptClick
  } = usePrompts(user?.id);

  useEffect(() => {
    console.log('Prompts in Index component:', prompts);
  }, [prompts]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  const displayName = profile?.first_name || user.email?.split('@')[0] || 'there';
  
  const availableTags = Array.from(
    new Set(prompts.map(prompt => prompt.tag))
  );

  const handlePromptCreate = (prompt: { title: string; content: string; tag: string }) => {
    console.log('Creating prompt:', prompt);
    handleCreatePrompt(prompt);
    toast({
      title: "Creating prompt",
      description: "Your prompt is being created...",
    });
  };

  return (
    <div className="container px-4 py-8 mx-auto fade-in">
      <div className="flex flex-col items-start gap-6">
        <PromptHeader 
          displayName={displayName}
          onSignOut={signOut}
          onCreatePrompt={handlePromptCreate}
        />
        
        {prompts.length > 0 && (
          <TagFilter 
            tags={availableTags} 
            selectedTag={selectedTag} 
            onSelectTag={setSelectedTag} 
          />
        )}
        
        <PromptList
          prompts={prompts}
          selectedTag={selectedTag}
          onPromptClick={handlePromptClick}
          isLoading={isLoadingPrompts}
        />
      </div>

      {selectedPrompt && (
        <PromptDetailDialog 
          open={detailDialogOpen}
          onOpenChange={setDetailDialogOpen}
          prompt={selectedPrompt}
        />
      )}
    </div>
  );
};

export default Index;
