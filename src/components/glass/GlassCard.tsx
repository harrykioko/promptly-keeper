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
    light: 'bg-white/10 backdrop-blur-sm',
    medium: 'bg-white/15 backdrop-blur-md border border-white/30',
    heavy: 'bg-white/25 backdrop-blur-xl',
  }[intensity];
  
  return (
    <div 
      className={cn(
        'transition-all duration-300 rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.1)] hover:shadow-lg',
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
