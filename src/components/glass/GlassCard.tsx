import * as React from 'react';
import { cn } from '@/lib/utils';

interface GlassCardProps {
  children: any;
  intensity?: 'light' | 'medium' | 'heavy';
  className?: string;
  [key: string]: any; // For additional HTML attributes
}

export const GlassCard = ({
  children,
  intensity = 'medium',
  className = '',
  ...props
}: GlassCardProps) => {
  const intensityClasses = {
    light: 'bg-white/40 backdrop-blur-sm',
    medium: 'glass-card',
    heavy: 'bg-white/80 backdrop-blur-xl',
  }[intensity];
  
  return (
    <div 
      className={cn(
        'transition-all duration-300 hover:shadow-lg',
        intensityClasses,
        className
      )}
      {...props}
    >
      <div className="p-6">
        {children}
      </div>
    </div>
  );
};

GlassCard.displayName = 'GlassCard'; 
