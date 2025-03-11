import React from 'react';
import { cn } from '@/lib/utils';

interface FrostedBackgroundProps {
  children: any;
  className?: string;
}

export const FrostedBackground = ({
  children,
  className = '',
}: FrostedBackgroundProps) => {
  return (
    <div className={cn('relative overflow-hidden', className)}>
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-neutral-50 to-neutral-100 z-0" />
      
      {/* Decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-subtle" />
      <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-2xl opacity-20" />
      <div className="absolute top-1/3 right-1/3 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-2xl opacity-10" />
      
      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}; 