
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import TagBadge, { TagType } from './TagBadge';

interface CreatePromptDialogProps {
  onCreatePrompt: (prompt: { title: string; content: string; tag: string }) => void;
}

const CreatePromptDialog = ({ onCreatePrompt }: CreatePromptDialogProps) => {
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [content, setContent] = React.useState("");
  const [tag, setTag] = React.useState<TagType>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCreatePrompt({ title, content, tag });
    setOpen(false);
    setTitle("");
    setContent("");
    setTag("");
  };

  const availableTags: TagType[] = [
    'general', 'coding', 'writing', 'creative', 'learning', 'custom'
  ];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
          <Button type="submit" className="w-full">Create Prompt</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePromptDialog;
