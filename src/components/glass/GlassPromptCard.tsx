
import React, { useState } from 'react';
import { TagType } from '../TagBadge';
import TagBadge from '../TagBadge';
import { cn } from '@/lib/utils';
import { GlassButton } from './GlassButton';
import { Transition } from '../animation/Transition';

interface GlassPromptCardProps {
  id: string;
  title: string;
  content: string;
  tag: TagType;
  createdAt: Date;
  onClick: () => void;
  onCopy: (content: string) => void;
  searchQuery?: string;
  className?: string;
}

export const GlassPromptCard = ({
  id,
  title,
  content,
  tag,
  createdAt,
  onClick,
  onCopy,
  searchQuery = '',
  className = '',
}: GlassPromptCardProps) => {
  const [isCopied, setIsCopied] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  
  // Automatically truncate long prompts
  const isLongPrompt = content.length > 200;
  const displayContent = isLongPrompt && !isExpanded 
    ? `${content.substring(0, 200)}...` 
    : content;
  
  const handleCopy = (e: any) => {
    e.stopPropagation(); // Prevent opening the dialog when clicking the copy button
    onCopy(content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Function to highlight text that matches the search query
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-100 dark:bg-yellow-800/30">{part}</mark> : part
    );
  };
  
  return (
    <div 
      className={cn(
        'glass-prompt-card cursor-pointer transform transition-all duration-300',
        isHovered ? 'scale-[1.02] shadow-xl' : 'scale-100',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
    >
      <div className="relative p-6">
        {/* Header */}
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-xl font-semibold text-neutral-800">
            {searchQuery ? highlightText(title, searchQuery) : title}
          </h3>
          
          <GlassButton 
            variant="primary" 
            size="sm" 
            onClick={(e) => handleCopy(e)}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </GlassButton>
        </div>
        
        {/* Content */}
        <div className="mb-3">
          <p className="text-neutral-700 whitespace-pre-wrap line-clamp-3">
            {searchQuery ? highlightText(displayContent, searchQuery) : displayContent}
          </p>
          
          {isLongPrompt && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsExpanded(!isExpanded);
              }}
              className="mt-2 text-sm text-primary-600 hover:text-primary-800 transition-colors"
            >
              {isExpanded ? 'Show less' : 'Show more'}
            </button>
          )}
        </div>
        
        {/* Footer */}
        <div className="flex justify-between items-center mt-4">
          <TagBadge tag={tag} />
          
          <div className="text-xs text-muted-foreground">
            {createdAt.toLocaleDateString()}
          </div>
        </div>
        
        {/* Copy animation */}
        <Transition
          show={isCopied}
          type="fade"
        >
          <div className="absolute inset-0 flex items-center justify-center bg-white/40 backdrop-blur-sm rounded-lg">
            <div className="flex items-center space-x-2 text-success-600">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-lg font-medium">Copied to clipboard!</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>
  );
};
