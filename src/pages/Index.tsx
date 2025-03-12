
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import PromptDetailDialog from '@/components/PromptDetailDialog';
import TagFilter from '@/components/TagFilter';
import PromptHeader from '@/components/PromptHeader';
import PromptList from '@/components/PromptList';
import SearchBar from '@/components/SearchBar';
import { usePrompts } from '@/hooks/usePrompts';
import { useToast } from '@/components/ui/use-toast';
import { TagType } from '@/components/TagBadge';

const Index = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');

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
  
  const availableTags: TagType[] = prompts
    .map(prompt => prompt.tag)
    .filter((tag, index, self) => self.indexOf(tag) === index) as TagType[];

  const handlePromptCreate = (prompt: { title: string; content: string; tag: string }) => {
    console.log('Creating prompt:', prompt);
    handleCreatePrompt(prompt);
    toast({
      title: "Creating prompt",
      description: "Your prompt is being created...",
    });
  };

  // Filter prompts based on search query and selected tag
  const filteredPrompts = prompts.filter(prompt => {
    const matchesSearch = searchQuery === '' || 
      prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      prompt.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesTag = selectedTag === 'all' || prompt.tag === selectedTag;
    
    return matchesSearch && matchesTag;
  });

  return (
    <div className="container px-4 py-8 mx-auto fade-in">
      <div className="flex flex-col items-start gap-6">
        <PromptHeader 
          displayName={displayName}
          onSignOut={signOut}
          onCreatePrompt={handlePromptCreate}
        />
        
        <div className="w-full flex flex-col gap-4 sm:flex-row sm:items-center">
          <SearchBar 
            onSearch={setSearchQuery} 
            placeholder="Search your prompts..."
            className="w-full sm:max-w-md"
          />
          
          {prompts.length > 0 && (
            <TagFilter 
              tags={availableTags} 
              selectedTag={selectedTag} 
              onSelectTag={setSelectedTag} 
            />
          )}
        </div>
        
        <PromptList
          prompts={filteredPrompts}
          selectedTag={selectedTag}
          onPromptClick={handlePromptClick}
          isLoading={isLoadingPrompts}
          searchQuery={searchQuery}
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
