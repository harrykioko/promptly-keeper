
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { cva } from "class-variance-authority";

// Define the tag variant styles
const tagVariants = cva("", {
  variants: {
    variant: {
      general: "bg-gray-100 text-gray-800 hover:bg-gray-200",
      coding: "bg-blue-100 text-blue-800 hover:bg-blue-200",
      writing: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      creative: "bg-pink-100 text-pink-800 hover:bg-pink-200",
      learning: "bg-green-100 text-green-800 hover:bg-green-200",
      custom: "bg-amber-100 text-amber-800 hover:bg-amber-200",
      all: "bg-slate-100 text-slate-800 hover:bg-slate-200",
    }
  },
  defaultVariants: {
    variant: "general",
  },
});

export type TagType = 'general' | 'coding' | 'writing' | 'creative' | 'learning' | 'custom' | 'all' | string;

export interface TagBadgeProps {
  tag: TagType;
  className?: string;
  onClick?: () => void;
  selected?: boolean;
}

const TagBadge = ({ tag, className = "", onClick, selected = false }: TagBadgeProps) => {
  // Determine the variant based on the tag
  let variant = tag as keyof typeof tagVariants.variants.variant;
  if (!tagVariants.variants.variant[variant]) {
    variant = 'custom';
  }

  // Set additional classes if tag is selected
  const selectedClass = selected ? "ring-2 ring-offset-1" : "";

  return (
    <Badge 
      variant="outline" 
      className={`${tagVariants({ variant })} ${selectedClass} transition-all cursor-pointer ${className}`}
      onClick={onClick}
    >
      {tag}
    </Badge>
  );
};

export default TagBadge;
