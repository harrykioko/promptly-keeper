import * as React from 'react';
import { cn } from '@/lib/utils';

interface GlassButtonProps {
  children: any;
  onClick?: (e?: any) => void;
  variant?: 'primary' | 'secondary' | 'accent';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  [key: string]: any; // For additional HTML attributes
}

export const GlassButton = ({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  type = 'button',
  ...props
}: GlassButtonProps) => {
  const variantClasses = {
    primary: 'bg-primary-500/80 hover:bg-primary-500/90 text-white',
    secondary: 'bg-white/50 hover:bg-white/60 text-neutral-800 border border-white/20',
    accent: 'bg-gradient-to-r from-purple-500/80 to-pink-500/80 hover:from-purple-500/90 hover:to-pink-500/90 text-white',
  }[variant];
  
  const sizeClasses = {
    sm: 'text-sm py-1.5 px-3',
    md: 'text-base py-2 px-4',
    lg: 'text-lg py-2.5 px-5',
  }[size];
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-lg font-medium backdrop-blur-sm shadow-sm transition-all duration-300',
        variantClasses,
        sizeClasses,
        disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}; 
