
import * as React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import TagBadge, { TagType } from './TagBadge';
import { useToast } from "@/components/ui/use-toast";

interface CreatePromptDialogProps {
  onCreatePrompt: (prompt: { title: string; content: string; tag: string }) => void;
}

const CreatePromptDialog = ({ onCreatePrompt }: CreatePromptDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tag, setTag] = React.useState<TagType>("");
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!title || !content || !tag) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log('Submitting prompt form with data:', { title, content, tag });
      await onCreatePrompt({ title, content, tag });
      setOpen(false);
      resetForm();
    } catch (error) {
      console.error("Error creating prompt:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setTitle("");
    setContent("");
    setTag("");
  };

  const availableTags: TagType[] = [
    'general', 'coding', 'writing', 'creative', 'learning', 'custom'
  ];

  return (
    <Dialog open={open} onOpenChange={(newOpen) => {
      setOpen(newOpen);
      if (!newOpen) resetForm();
    }}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          New Prompt
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Prompt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter prompt title"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="content">Content</Label>
            <Textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Enter prompt content"
              required
              className="min-h-[100px]"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tag">Tag</Label>
            <Select value={tag} onValueChange={setTag as any} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a tag" />
              </SelectTrigger>
              <SelectContent>
                {availableTags.map((tagOption) => (
                  <SelectItem key={tagOption} value={tagOption}>
                    <div className="flex items-center">
                      <TagBadge tag={tagOption} />
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating..." : "Create Prompt"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePromptDialog;
