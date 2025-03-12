import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Transition } from '../../animation/Transition';
import { useReducedMotion } from '@/hooks/animation/useReducedMotion';
import { X, Check } from 'lucide-react';

export interface Tag {
  id: string;
  label: string;
}

interface GlassTagInputProps {
  tags: Tag[];
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export const GlassTagInput = ({
  tags,
  selectedTags,
  onChange,
  placeholder = 'Add tags...',
  maxTags,
  disabled = false,
  className = '',
  error,
  label,
  required = false,
}: GlassTagInputProps) => {
  const [inputValue, setInputValue] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [filteredTags, setFilteredTags] = useState([]);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion();

  // Filter available tags based on input and already selected tags
  useEffect(() => {
    if (inputValue.trim() === '') {
      setFilteredTags([]);
      return;
    }

    const filtered = tags
      .filter(tag => 
        tag.label.toLowerCase().includes(inputValue.toLowerCase()) && 
        !selectedTags.some(selected => selected.id === tag.id)
      )
      .slice(0, 5); // Limit to 5 suggestions
    
    setFilteredTags(filtered);
    setActiveIndex(filtered.length > 0 ? 0 : -1);
  }, [inputValue, tags, selectedTags]);

  // Handle outside click to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        suggestionsRef.current && 
        !suggestionsRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
    setShowSuggestions(true);
  };

  const handleInputFocus = () => {
    setIsFocused(true);
    setShowSuggestions(inputValue.trim() !== '');
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Don't hide suggestions immediately to allow clicking on them
    setTimeout(() => {
      if (!suggestionsRef.current?.contains(document.activeElement)) {
        setShowSuggestions(false);
      }
    }, 150);
  };

  const handleKeyDown = (e: any) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => 
        prev < filteredTags.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => 
        prev > 0 ? prev - 1 : filteredTags.length - 1
      );
    } else if (e.key === 'Enter' && activeIndex >= 0 && filteredTags[activeIndex]) {
      e.preventDefault();
      addTag(filteredTags[activeIndex]);
    } else if (e.key === 'Backspace' && inputValue === '' && selectedTags.length > 0) {
      removeTag(selectedTags[selectedTags.length - 1].id);
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  const addTag = (tag: Tag) => {
    if (maxTags && selectedTags.length >= maxTags) return;
    
    if (!selectedTags.some(t => t.id === tag.id)) {
      onChange([...selectedTags, tag]);
      setInputValue('');
      setFilteredTags([]);
      setShowSuggestions(false);
      inputRef.current?.focus();
    }
  };

  const removeTag = (tagId: string) => {
    onChange(selectedTags.filter(tag => tag.id !== tagId));
  };

  const isMaxTagsReached = maxTags ? selectedTags.length >= maxTags : false;

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div
        className={cn(
          'relative bg-white/70 backdrop-blur-sm border rounded-lg transition-all duration-200',
          isFocused ? 'border-primary-400 ring-2 ring-primary-100' : 'border-neutral-200',
          error ? 'border-error-300 ring-2 ring-error-100' : '',
          disabled ? 'bg-neutral-50/70 cursor-not-allowed' : '',
          'p-1.5'
        )}
      >
        <div className="flex flex-wrap gap-1.5">
          {selectedTags.map(tag => (
            <Transition
              key={tag.id}
              show={true}
              type={prefersReducedMotion ? 'fade' : 'scale'}
              duration="fast"
            >
              <span 
                className={cn(
                  'inline-flex items-center px-2.5 py-0.5 rounded-full text-sm',
                  'bg-primary-100/70 text-primary-800 backdrop-blur-sm',
                  'border border-primary-200/50',
                  disabled ? 'opacity-60' : ''
                )}
              >
                {tag.label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => removeTag(tag.id)}
                    className="ml-1.5 text-primary-500 hover:text-primary-700 focus:outline-none"
                    aria-label={`Remove ${tag.label}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </span>
            </Transition>
          ))}
          
          {!isMaxTagsReached && (
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              onKeyDown={handleKeyDown}
              placeholder={selectedTags.length === 0 ? placeholder : ''}
              disabled={disabled}
              className={cn(
                'flex-grow min-w-[120px] bg-transparent border-none focus:outline-none focus:ring-0',
                'text-sm py-1 px-2',
                disabled ? 'cursor-not-allowed' : ''
              )}
              aria-label={placeholder}
              aria-invalid={!!error}
              aria-describedby={error ? 'tag-input-error' : undefined}
            />
          )}
        </div>
        
        {/* Suggestions dropdown */}
        {showSuggestions && filteredTags.length > 0 && (
          <div 
            ref={suggestionsRef}
            className="absolute z-10 mt-1 w-full bg-white/90 backdrop-blur-md shadow-lg rounded-lg border border-neutral-200/50 py-1 max-h-60 overflow-auto"
          >
            {filteredTags.map((tag, index) => (
              <button
                key={tag.id}
                className={cn(
                  'w-full text-left px-3 py-2 text-sm flex items-center justify-between',
                  'transition-colors duration-150',
                  index === activeIndex 
                    ? 'bg-primary-50/70 text-primary-900' 
                    : 'text-neutral-700 hover:bg-neutral-50/70'
                )}
                onClick={() => addTag(tag)}
                onMouseEnter={() => setActiveIndex(index)}
              >
                {tag.label}
                {index === activeIndex && (
                  <Check className="h-4 w-4 text-primary-500" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
      
      {error && (
        <p id="tag-input-error" className="mt-1.5 text-sm text-error-600">
          {error}
        </p>
      )}
      
      {maxTags && (
        <p className={cn(
          'mt-1 text-xs',
          isMaxTagsReached ? 'text-error-500' : 'text-neutral-500'
        )}>
          {selectedTags.length} of {maxTags} tags selected
        </p>
      )}
    </div>
  );
}; 
