
import * as React from 'react';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Info } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";
import TagBadge, { TagType } from './TagBadge';

interface PromptDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prompt: {
    id: string;
    title: string;
    content: string;
    tag: TagType;
    createdAt: Date;
  } | null;
}

const PromptDetailDialog: React.FC<PromptDetailDialogProps> = ({ 
  open, 
  onOpenChange, 
  prompt 
}) => {
  const { toast } = useToast();

  const copyToClipboard = async () => {
    if (!prompt) return;
    
    await navigator.clipboard.writeText(prompt.content);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  if (!prompt) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            {prompt.title}
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 mt-2">
            <TagBadge tag={prompt.tag} />
            <span className="text-xs text-muted-foreground">
              Created: {prompt.createdAt.toLocaleDateString()}
            </span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 flex-1 overflow-hidden">
          <ScrollArea className="h-[50vh]">
            <div className="bg-muted p-4 rounded-md">
              <pre className="whitespace-pre-wrap text-sm font-mono break-words">
                {prompt.content}
              </pre>
            </div>
          </ScrollArea>
          
          <div className="mt-4 flex items-start gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <p>
              This prompt can be used in various AI tools like ChatGPT, Claude, or Gemini. 
              Copy the text and paste it into your preferred AI assistant.
            </p>
          </div>
        </div>
        
        <DialogFooter className="mt-6">
          <Button onClick={copyToClipboard} className="w-full sm:w-auto">
            <Copy className="mr-2 h-4 w-4" />
            Copy to Clipboard
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PromptDetailDialog;
