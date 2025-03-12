
import React from 'react';
import { Badge } from "@/components/ui/badge";
import { BookOpen, Code, PenTool, Brain, Zap, FileQuestion, Hash } from "lucide-react";
import { cn } from "@/lib/utils";

export type TagType = 'general' | 'coding' | 'writing' | 'creative' | 'learning' | 'custom' | 'all' | string;

interface TagBadgeProps {
  tag: TagType;
  className?: string;
  onClick?: () => void;
}

const tagConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  all: {
    color: "bg-primary hover:bg-primary/90 text-primary-foreground",
    icon: <Hash className="h-3 w-3 mr-1" />
  },
  general: { 
    color: "bg-slate-200 hover:bg-slate-300 text-slate-900", 
    icon: <Hash className="h-3 w-3 mr-1" /> 
  },
  coding: { 
    color: "bg-blue-100 hover:bg-blue-200 text-blue-900", 
    icon: <Code className="h-3 w-3 mr-1" /> 
  },
  writing: { 
    color: "bg-emerald-100 hover:bg-emerald-200 text-emerald-900", 
    icon: <PenTool className="h-3 w-3 mr-1" /> 
  },
  creative: { 
    color: "bg-purple-100 hover:bg-purple-200 text-purple-900", 
    icon: <Brain className="h-3 w-3 mr-1" /> 
  },
  learning: { 
    color: "bg-amber-100 hover:bg-amber-200 text-amber-900", 
    icon: <BookOpen className="h-3 w-3 mr-1" /> 
  },
  custom: { 
    color: "bg-rose-100 hover:bg-rose-200 text-rose-900", 
    icon: <Zap className="h-3 w-3 mr-1" /> 
  }
};

const TagBadge = ({ tag, className, onClick }: TagBadgeProps) => {
  const config = tagConfig[tag] || tagConfig.general;
  
  return (
    <Badge 
      variant="outline"
      className={cn(
        "flex items-center",
        config.color,
        onClick ? 'cursor-pointer' : '',
        className
      )}
      onClick={onClick}
    >
      {config.icon}
      <span className="capitalize">{tag}</span>
    </Badge>
  );
};

export default TagBadge;
