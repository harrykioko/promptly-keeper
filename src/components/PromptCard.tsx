import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import TagBadge, { TagType } from './TagBadge';

interface PromptCardProps {
  id: string;
  title: string;
  content: string;
  tag: TagType;
  createdAt: Date;
  onClick: () => void;
  searchQuery?: string;
}

const PromptCard = ({ 
  id, 
  title, 
  content, 
  tag, 
  createdAt, 
  onClick, 
  searchQuery = '' 
}: PromptCardProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation(); // Prevent opening the dialog when clicking the copy button
    await navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  // Function to highlight text that matches the search query
  const highlightText = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const regex = new RegExp(`(${query.trim()})`, 'gi');
    const parts = text.split(regex);
    
    return parts.map((part, i) => 
      regex.test(part) ? <mark key={i} className="bg-yellow-100 dark:bg-yellow-800/30">{part}</mark> : part
    );
  };

  return (
    <Card className="prompt-card cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">
          {highlightText(title, searchQuery)}
        </CardTitle>
        <Button
          variant="ghost"
          size="icon"
          onClick={copyToClipboard}
          className="h-8 w-8"
        >
          <Copy className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <TagBadge tag={tag} />
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap line-clamp-3">
          {highlightText(content, searchQuery)}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">
          Created: {createdAt.toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptCard;
