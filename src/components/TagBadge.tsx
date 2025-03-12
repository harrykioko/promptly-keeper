import React from 'react';

// Fixed BadgeProps interface - including children
interface BadgeProps {
  variant?: 'default' | 'secondary' | 'outline';
  className?: string;
  onClick?: () => void;
  children: any; // Simplified type for children
}

const Badge = ({ 
  variant = 'default', 
  className = '',
  onClick,
  children 
}: BadgeProps) => {
  return (
    <span 
      className={`badge badge-${variant} ${className}`} 
      onClick={onClick}
    >
      {children}
    </span>
  );
};

export type TagType = 'general' | 'coding' | 'writing' | 'creative' | 'learning' | 'custom' | 'all' | string;

export interface TagBadgeProps {
  tag: TagType;
  className?: string;
  onClick?: () => void;
}

const TagBadge = ({ tag, className, onClick }: TagBadgeProps) => {
  return (
    <Badge variant="default" className={className} onClick={onClick}>
      {tag}
    </Badge>
  );
};

export default TagBadge;
