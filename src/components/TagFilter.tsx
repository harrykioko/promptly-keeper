
import * as React from 'react';
import TagBadge, { TagType } from './TagBadge';
import { cn } from '@/lib/utils';

interface TagFilterProps {
  tags: TagType[];
  selectedTag: TagType | null;
  onSelectTag: (tag: TagType | null) => void;
}

const TagFilter = ({ tags, selectedTag, onSelectTag }: TagFilterProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <TagBadge 
        tag="all" 
        className={cn(selectedTag === null ? 'bg-primary text-primary-foreground' : 'bg-background text-foreground')}
        onClick={() => onSelectTag(null)} 
      />
      {tags.map((tag) => (
        <TagBadge 
          key={tag} 
          tag={tag} 
          className={selectedTag === tag ? 'ring-2 ring-primary' : ''}
          onClick={() => onSelectTag(tag)} 
        />
      ))}
    </div>
  );
};

export default TagFilter;
