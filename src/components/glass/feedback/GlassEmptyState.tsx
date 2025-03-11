import React from 'react';
import { cn } from '@/lib/utils';

interface GlassEmptyStateProps {
  title: string;
  description?: string;
  icon?: JSX.Element;
  action?: JSX.Element;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'info' | 'warning';
}

export const GlassEmptyState = ({
  title,
  description,
  icon,
  action,
  className = '',
  size = 'md',
  variant = 'default',
}: GlassEmptyStateProps) => {
  // Size mappings
  const sizeClasses = {
    sm: {
      container: 'p-4',
      icon: 'h-8 w-8 mb-2',
      title: 'text-sm',
      description: 'text-xs',
    },
    md: {
      container: 'p-6',
      icon: 'h-12 w-12 mb-3',
      title: 'text-base',
      description: 'text-sm',
    },
    lg: {
      container: 'p-8',
      icon: 'h-16 w-16 mb-4',
      title: 'text-lg',
      description: 'text-base',
    },
  };

  // Variant mappings
  const variantClasses = {
    default: {
      container: 'bg-white/70 border-neutral-200',
      icon: 'text-neutral-400',
      title: 'text-neutral-800',
      description: 'text-neutral-500',
    },
    info: {
      container: 'bg-blue-50/70 border-blue-200',
      icon: 'text-blue-400',
      title: 'text-blue-800',
      description: 'text-blue-600',
    },
    warning: {
      container: 'bg-amber-50/70 border-amber-200',
      icon: 'text-amber-400',
      title: 'text-amber-800',
      description: 'text-amber-600',
    },
  };

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center text-center rounded-lg border backdrop-blur-sm',
        sizeClasses[size].container,
        variantClasses[variant].container,
        className
      )}
    >
      {icon && (
        <div className={cn(
          sizeClasses[size].icon,
          variantClasses[variant].icon
        )}>
          {icon}
        </div>
      )}
      
      <h3 className={cn(
        'font-medium',
        sizeClasses[size].title,
        variantClasses[variant].title
      )}>
        {title}
      </h3>
      
      {description && (
        <p className={cn(
          'mt-1',
          sizeClasses[size].description,
          variantClasses[variant].description
        )}>
          {description}
        </p>
      )}
      
      {action && (
        <div className="mt-4">
          {action}
        </div>
      )}
    </div>
  );
}; 