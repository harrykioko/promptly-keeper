import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { useReducedMotion } from '@/hooks/animation/useReducedMotion';

interface TransitionProps {
  show: boolean;
  children: any;
  type?: 'fade' | 'slide-up' | 'slide-in-right' | 'slide-in-left' | 'scale';
  duration?: 'fast' | 'normal' | 'slow';
  delay?: number;
  className?: string;
}

export const Transition = ({
  show,
  children,
  type = 'fade',
  duration = 'normal',
  delay = 0,
  className = '',
}: TransitionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, delay);
      return () => clearTimeout(timer);
    } else {
      setIsVisible(false);
    }
  }, [show, delay]);
  
  // Skip animations if user prefers reduced motion
  if (prefersReducedMotion) {
    if (!show) return null;
    return <div className={className}>{children}</div>;
  }
  
  const animationClasses = {
    'fade': 'animate-fade-in',
    'slide-up': 'animate-slide-up',
    'slide-in-right': 'animate-slide-in-right',
    'slide-in-left': 'animate-slide-in-left',
    'scale': 'animate-scale-in',
  }[type];
  
  const durationClasses = {
    'fast': 'duration-150',
    'normal': 'duration-300',
    'slow': 'duration-500',
  }[duration];
  
  if (!show) return null;
  
  return (
    <div 
      className={cn(
        'opacity-0',
        isVisible ? animationClasses : '',
        durationClasses,
        className
      )}
      style={{ animationDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}; 