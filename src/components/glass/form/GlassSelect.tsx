import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown, Check, X } from 'lucide-react';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface GlassSelectProps {
  options: SelectOption[];
  value: string | null;
  onChange: (value: string | null) => void;
  placeholder?: string;
  disabled?: boolean;
  clearable?: boolean;
  className?: string;
  error?: string;
  label?: string;
  required?: boolean;
}

export const GlassSelect = ({
  options,
  value,
  onChange,
  placeholder = 'Select an option',
  disabled = false,
  clearable = false,
  className = '',
  error,
  label,
  required = false,
}: GlassSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const selectRef = useRef(null);

  const selectedOption = options.find(option => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (selectRef.current && !selectRef.current.contains(event.target)) {
        setIsOpen(false);
        setIsFocused(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle keyboard navigation
  const handleKeyDown = (e: any) => {
    if (disabled) return;

    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        setIsOpen(!isOpen);
        break;
      case 'Escape':
        e.preventDefault();
        setIsOpen(false);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // Find next non-disabled option
          const currentIndex = value ? options.findIndex(opt => opt.value === value) : -1;
          const nextIndex = findNextEnabledOption(currentIndex, 'down');
          if (nextIndex !== -1) {
            onChange(options[nextIndex].value);
          }
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          // Find previous non-disabled option
          const currentIndex = value ? options.findIndex(opt => opt.value === value) : options.length;
          const prevIndex = findNextEnabledOption(currentIndex, 'up');
          if (prevIndex !== -1) {
            onChange(options[prevIndex].value);
          }
        }
        break;
      default:
        break;
    }
  };

  // Find next enabled option in the specified direction
  const findNextEnabledOption = (currentIndex: number, direction: 'up' | 'down'): number => {
    const increment = direction === 'down' ? 1 : -1;
    let nextIndex = currentIndex + increment;
    
    // Loop through options until we find a non-disabled one or exhaust the list
    while (nextIndex >= 0 && nextIndex < options.length) {
      if (!options[nextIndex].disabled) {
        return nextIndex;
      }
      nextIndex += increment;
    }
    
    return -1;
  };

  const handleClear = (e: any) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className={cn('w-full', className)}>
      {label && (
        <label className="block text-sm font-medium text-neutral-700 mb-1">
          {label}
          {required && <span className="text-error-500 ml-1">*</span>}
        </label>
      )}
      
      <div 
        ref={selectRef}
        className={cn(
          'relative',
          disabled ? 'cursor-not-allowed' : 'cursor-pointer'
        )}
      >
        <div
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls="select-dropdown"
          aria-labelledby={label ? 'select-label' : undefined}
          aria-invalid={!!error}
          aria-describedby={error ? 'select-error' : undefined}
          className={cn(
            'flex items-center justify-between w-full px-3 py-2 rounded-lg',
            'bg-white/70 backdrop-blur-sm border transition-all duration-200',
            isFocused ? 'border-primary-400 ring-2 ring-primary-100' : 'border-neutral-200',
            error ? 'border-error-300 ring-2 ring-error-100' : '',
            disabled ? 'bg-neutral-50/70 text-neutral-400' : 'text-neutral-800',
          )}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onFocus={() => !disabled && setIsFocused(true)}
          onKeyDown={handleKeyDown}
        >
          <div className="flex-1 truncate">
            {selectedOption ? (
              <span>{selectedOption.label}</span>
            ) : (
              <span className="text-neutral-400">{placeholder}</span>
            )}
          </div>
          
          <div className="flex items-center">
            {clearable && value && !disabled && (
              <button
                type="button"
                onClick={handleClear}
                className="p-1 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                aria-label="Clear selection"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            <ChevronDown 
              className={cn(
                'h-4 w-4 ml-1 text-neutral-400 transition-transform duration-200',
                isOpen ? 'transform rotate-180' : ''
              )} 
            />
          </div>
        </div>
        
        {isOpen && !disabled && (
          <div 
            id="select-dropdown"
            role="listbox"
            className={cn(
              'absolute z-10 w-full mt-1 py-1 rounded-lg shadow-lg',
              'bg-white/90 backdrop-blur-sm border border-neutral-200',
              'max-h-60 overflow-auto scrollbar-thin scrollbar-thumb-neutral-300',
              'animate-in fade-in-50 zoom-in-95 slide-in-from-top-2'
            )}
          >
            {options.length === 0 ? (
              <div className="px-3 py-2 text-sm text-neutral-500">
                No options available
              </div>
            ) : (
              options.map((option) => (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={value === option.value}
                  aria-disabled={option.disabled}
                  className={cn(
                    'flex items-center px-3 py-2 text-sm',
                    option.disabled 
                      ? 'text-neutral-400 cursor-not-allowed' 
                      : value === option.value
                        ? 'bg-primary-50/70 text-primary-700 font-medium'
                        : 'text-neutral-700 hover:bg-neutral-50/70 cursor-pointer',
                  )}
                  onClick={() => {
                    if (!option.disabled) {
                      onChange(option.value);
                      setIsOpen(false);
                    }
                  }}
                >
                  <span className="flex-1">{option.label}</span>
                  {value === option.value && (
                    <Check className="h-4 w-4 text-primary-600 ml-2" />
                  )}
                </div>
              ))
            )}
          </div>
        )}
      </div>
      
      {error && (
        <p id="select-error" className="mt-1.5 text-sm text-error-600">
          {error}
        </p>
      )}
    </div>
  );
}; 
