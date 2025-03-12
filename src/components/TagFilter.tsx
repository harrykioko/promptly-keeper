
import * as React from 'react';
import TagBadge, { TagType } from './TagBadge';

interface TagFilterProps {
  tags: TagType[];
  selectedTag: TagType | null;
  onSelectTag: (tag: TagType | null) => void;
}

const TagFilter: React.FC<TagFilterProps> = ({ tags, selectedTag, onSelectTag }) => {
  return (
    <div className="flex flex-wrap gap-2 mb-6">
      <TagBadge 
        tag="all" 
        className={`bg-${selectedTag === null ? 'primary text-primary-foreground' : 'background text-foreground'}`}
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
