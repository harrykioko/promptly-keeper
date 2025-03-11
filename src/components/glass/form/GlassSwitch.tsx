import React from 'react';
import { cn } from '@/lib/utils';

interface GlassSwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
}

export const GlassSwitch = ({
  checked,
  onChange,
  disabled = false,
  size = 'md',
  className = '',
  label,
  description,
  error,
  required = false,
}: GlassSwitchProps) => {
  // Size mappings
  const sizeClasses = {
    sm: {
      switch: 'w-8 h-4',
      thumb: 'w-3 h-3',
      translate: 'translate-x-4',
    },
    md: {
      switch: 'w-11 h-6',
      thumb: 'w-5 h-5',
      translate: 'translate-x-5',
    },
    lg: {
      switch: 'w-14 h-7',
      thumb: 'w-6 h-6',
      translate: 'translate-x-7',
    },
  };

  const handleKeyDown = (e: any) => {
    if (disabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onChange(!checked);
    }
  };

  return (
    <div className={cn('flex items-start', className)}>
      <div className="flex-shrink-0 mt-0.5">
        <button
          type="button"
          role="switch"
          aria-checked={checked}
          disabled={disabled}
          onClick={() => !disabled && onChange(!checked)}
          onKeyDown={handleKeyDown}
          className={cn(
            'relative inline-flex flex-shrink-0 cursor-pointer rounded-full transition-colors duration-200 ease-in-out',
            'focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
            sizeClasses[size].switch,
            checked 
              ? 'bg-primary-500/90 backdrop-blur-sm' 
              : 'bg-neutral-200/80 backdrop-blur-sm',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          tabIndex={disabled ? -1 : 0}
          aria-labelledby={label ? 'switch-label' : undefined}
          aria-describedby={description ? 'switch-description' : error ? 'switch-error' : undefined}
        >
          <span
            className={cn(
              'pointer-events-none inline-block rounded-full bg-white shadow-lg transform ring-0 transition duration-200 ease-in-out',
              sizeClasses[size].thumb,
              checked ? sizeClasses[size].translate : 'translate-x-0.5',
              size === 'md' && 'mt-0.5',
              size === 'lg' && 'mt-0.5'
            )}
          />
        </button>
      </div>
      
      {(label || description || error) && (
        <div className="ml-3">
          {label && (
            <label 
              id="switch-label"
              className={cn(
                'text-sm font-medium',
                disabled ? 'text-neutral-400' : 'text-neutral-700',
                error ? 'text-error-700' : ''
              )}
            >
              {label}
              {required && <span className="text-error-500 ml-1">*</span>}
            </label>
          )}
          
          {description && (
            <p 
              id="switch-description" 
              className={cn(
                'text-xs',
                disabled ? 'text-neutral-400' : 'text-neutral-500'
              )}
            >
              {description}
            </p>
          )}
          
          {error && (
            <p id="switch-error" className="mt-1 text-xs text-error-600">
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
}; 