
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Copy, Copy as CopyIcon, Check } from "lucide-react";
import { Template } from '@/hooks/useTemplates';
import { useToast } from '@/components/ui/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';
import TagBadge from './TagBadge';

interface TemplateDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  template: Template | null;
}

const TemplateDetailDialog = ({
  open,
  onOpenChange,
  template
}: TemplateDetailDialogProps) => {
  const { toast } = useToast();
  const [copiedPromptId, setCopiedPromptId] = React.useState<string | null>(null);
  
  if (!template) {
    return null;
  }

  const handleCopyPrompt = (content: string, id: string) => {
    navigator.clipboard.writeText(content)
      .then(() => {
        setCopiedPromptId(id);
        toast({
          title: "Copied to clipboard",
          description: "Prompt has been copied to your clipboard.",
        });
        
        setTimeout(() => {
          setCopiedPromptId(null);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard.",
          variant: "destructive",
        });
      });
  };

  const handleCopyAll = () => {
    const allContent = template.prompts.map(prompt => prompt.content).join('\n\n---\n\n');
    
    navigator.clipboard.writeText(allContent)
      .then(() => {
        toast({
          title: "All prompts copied",
          description: "All prompts have been copied to your clipboard.",
        });
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
        toast({
          title: "Failed to copy",
          description: "Could not copy to clipboard.",
          variant: "destructive",
        });
      });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>{template.title}</DialogTitle>
          {template.description && (
            <p className="text-sm text-muted-foreground">{template.description}</p>
          )}
        </DialogHeader>
        
        <div className="flex items-center justify-between mt-2 mb-4">
          <div className="flex items-center gap-1.5">
            <span className="text-sm text-muted-foreground">
              {template.prompts.length} prompt{template.prompts.length !== 1 ? 's' : ''}
            </span>
            {template.sequence && (
              <span className="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded-full">
                Sequence
              </span>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyAll}
            disabled={template.prompts.length === 0}
          >
            <Copy className="h-3.5 w-3.5 mr-1.5" />
            Copy All
          </Button>
        </div>
        
        <ScrollArea className="flex-grow">
          <div className="space-y-4 pr-4">
            {template.prompts.length > 0 ? (
              template.prompts.map((prompt, index) => (
                <div 
                  key={prompt.id} 
                  className="p-3 border rounded-lg hover:border-gray-400 transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      {template.sequence && (
                        <span className="flex items-center justify-center w-5 h-5 text-xs font-medium rounded-full bg-gray-100">
                          {index + 1}
                        </span>
                      )}
                      <h3 className="font-medium">{prompt.title}</h3>
                    </div>
                    <TagBadge tag={prompt.tag} />
                  </div>
                  
                  <p className="text-sm line-clamp-3 mb-2">{prompt.content}</p>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 mt-1"
                    onClick={() => handleCopyPrompt(prompt.content, prompt.id)}
                  >
                    {copiedPromptId === prompt.id ? (
                      <>
                        <Check className="h-3.5 w-3.5 mr-1.5 text-green-500" />
                        Copied
                      </>
                    ) : (
                      <>
                        <CopyIcon className="h-3.5 w-3.5 mr-1.5" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-muted-foreground">
                This template has no prompts.
              </div>
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateDetailDialog;
