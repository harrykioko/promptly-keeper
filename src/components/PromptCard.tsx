
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
}

const PromptCard = ({ id, title, content, tag, createdAt, onClick }: PromptCardProps) => {
  const { toast } = useToast();

  const copyToClipboard = async (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the dialog when clicking the copy button
    await navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  return (
    <Card className="prompt-card cursor-pointer" onClick={onClick}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold">{title}</CardTitle>
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
          {content}
        </p>
        <div className="mt-4 text-xs text-muted-foreground">
          Created: {createdAt.toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptCard;
