
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, AlignLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { formatDistanceToNow } from 'date-fns';

interface TemplateCardProps {
  id: string;
  title: string;
  description: string | null;
  promptCount: number;
  sequence: boolean;
  createdAt: Date;
  onClick: () => void;
}

const TemplateCard = ({
  id,
  title,
  description,
  promptCount,
  sequence,
  createdAt,
  onClick
}: TemplateCardProps) => {
  const { toast } = useToast();
  
  const handleCopyClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.stopPropagation();
    // This would be replaced with actual logic to copy all prompts
    toast({
      title: "Not implemented yet",
      description: "Copying all prompts will be implemented in a future update.",
    });
  };

  return (
    <Card 
      className="h-full flex flex-col hover:shadow-md transition-all cursor-pointer border-l-4 border-purple-500" 
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold line-clamp-1">{title}</CardTitle>
      </CardHeader>
      <CardContent className="py-2 flex-grow">
        {description ? (
          <p className="text-muted-foreground text-sm line-clamp-2">{description}</p>
        ) : (
          <p className="text-muted-foreground text-sm italic">No description</p>
        )}
        <div className="flex items-center gap-1 mt-3">
          <AlignLeft className="h-4 w-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">
            {promptCount} prompt{promptCount !== 1 ? 's' : ''}
          </span>
          {sequence && (
            <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full ml-2">
              Sequence
            </span>
          )}
        </div>
      </CardContent>
      <CardFooter className="pt-0 flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(createdAt, { addSuffix: true })}
        </span>
        <Button
          variant="outline"
          size="sm"
          className="h-8"
          onClick={handleCopyClick}
        >
          <Copy className="h-3.5 w-3.5 mr-1" />
          Copy All
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TemplateCard;
