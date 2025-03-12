
import React from 'react';
import PromptCard from '@/components/PromptCard';
import { TagType } from '@/components/TagBadge';

interface Prompt {
  id: string;
  title: string;
  content: string;
  tag: TagType;
  createdAt: Date;
}

interface PromptListProps {
  prompts: Prompt[];
  selectedTag: TagType | null;
  onPromptClick: (prompt: Prompt) => void;
  isLoading: boolean;
}

const PromptList: React.FC<PromptListProps> = ({ 
  prompts, 
  selectedTag, 
  onPromptClick, 
  isLoading 
}) => {
  const filteredPrompts = selectedTag 
    ? prompts.filter(prompt => prompt.tag === selectedTag)
    : prompts;

  if (isLoading) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-muted-foreground">Loading prompts...</p>
      </div>
    );
  }

  if (filteredPrompts.length === 0) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-muted-foreground">
          {prompts.length === 0 
            ? "No prompts yet. Create your first prompt to get started!" 
            : "No prompts match the selected filter."}
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {filteredPrompts.map((prompt) => (
        <PromptCard
          key={prompt.id}
          id={prompt.id}
          title={prompt.title}
          content={prompt.content}
          tag={prompt.tag}
          createdAt={prompt.createdAt}
          onClick={() => onPromptClick(prompt)}
        />
      ))}
    </div>
  );
};

export default PromptList;
