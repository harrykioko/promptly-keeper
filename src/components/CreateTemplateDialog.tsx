
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Prompt } from '@/hooks/usePrompts';

interface CreateTemplateDialogProps {
  prompts: Prompt[];
  onCreateTemplate: (template: {
    title: string;
    description: string | null;
    sequence: boolean;
    promptIds: string[];
  }) => void;
}

const CreateTemplateDialog = ({ prompts, onCreateTemplate }: CreateTemplateDialogProps) => {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [sequence, setSequence] = useState(false);
  const [selectedPromptIds, setSelectedPromptIds] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form state when dialog closes
  useEffect(() => {
    if (!open) {
      setTitle("");
      setDescription("");
      setSequence(false);
      setSelectedPromptIds([]);
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedPromptIds.length === 0) {
      return; // Do not submit if no prompts are selected
    }
    
    setIsSubmitting(true);
    
    try {
      await onCreateTemplate({
        title,
        description: description || null,
        sequence,
        promptIds: selectedPromptIds,
      });
      setOpen(false);
    } catch (error) {
      console.error("Error creating template:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const togglePromptSelection = (promptId: string) => {
    setSelectedPromptIds(prev => {
      if (prev.includes(promptId)) {
        return prev.filter(id => id !== promptId);
      } else {
        return [...prev, promptId];
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Template
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter template title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter template description"
              className="min-h-[80px]"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="sequence"
              checked={sequence}
              onCheckedChange={(checked) => setSequence(checked as boolean)}
            />
            <Label
              htmlFor="sequence"
              className="font-normal text-sm cursor-pointer"
            >
              Enable sequencing (prompts will be arranged in selection order)
            </Label>
          </div>
          <div className="space-y-2">
            <Label>Select Prompts</Label>
            <ScrollArea className="h-[200px] border rounded-md p-2">
              {prompts.length > 0 ? (
                <div className="space-y-2">
                  {prompts.map((prompt) => (
                    <div key={prompt.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`prompt-${prompt.id}`}
                        checked={selectedPromptIds.includes(prompt.id)}
                        onCheckedChange={() => togglePromptSelection(prompt.id)}
                      />
                      <Label
                        htmlFor={`prompt-${prompt.id}`}
                        className="font-normal text-sm cursor-pointer"
                      >
                        {prompt.title}
                      </Label>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex justify-center items-center h-full text-muted-foreground">
                  No prompts available
                </div>
              )}
            </ScrollArea>
            {selectedPromptIds.length > 0 && (
              <p className="text-xs text-muted-foreground">
                {selectedPromptIds.length} prompt{selectedPromptIds.length !== 1 ? 's' : ''} selected
              </p>
            )}
          </div>
          <Button
            type="submit"
            className="w-full"
            disabled={isSubmitting || title.trim() === '' || selectedPromptIds.length === 0}
          >
            {isSubmitting ? "Creating..." : "Create Template"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateDialog;
