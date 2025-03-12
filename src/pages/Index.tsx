
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import PromptDetailDialog from '@/components/PromptDetailDialog';
import TagFilter from '@/components/TagFilter';
import PromptHeader from '@/components/PromptHeader';
import PromptList from '@/components/PromptList';
import { usePrompts } from '@/hooks/usePrompts';
import { TagType } from '@/components/TagBadge';

const Index = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
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

  if (isLoading || !user) {
    return null;
  }

  const displayName = profile?.first_name || user.email?.split('@')[0] || 'there';
  
  const availableTags: TagType[] = Array.from(
    new Set(prompts.map(prompt => prompt.tag))
  ) as TagType[];

  return (
    <div className="container px-4 py-8 mx-auto fade-in">
      <div className="flex flex-col items-start gap-6">
        <PromptHeader 
          displayName={displayName}
          onSignOut={signOut}
          onCreatePrompt={handleCreatePrompt}
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

      <PromptDetailDialog 
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        prompt={selectedPrompt}
      />
    </div>
  );
};

export default Index;
