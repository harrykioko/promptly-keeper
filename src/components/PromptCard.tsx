
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Copy } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface PromptCardProps {
  title: string;
  content: string;
  tag: string;
  createdAt: Date;
}

const PromptCard = ({ title, content, tag, createdAt }: PromptCardProps) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(content);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  return (
    <Card className="prompt-card">
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
          <Badge variant="secondary">{tag}</Badge>
        </div>
        <p className="text-sm text-muted-foreground whitespace-pre-wrap">{content}</p>
        <div className="mt-4 text-xs text-muted-foreground">
          Created: {createdAt.toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptCard;
