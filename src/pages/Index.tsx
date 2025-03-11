
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import PromptCard from '@/components/PromptCard';
import CreatePromptDialog from '@/components/CreatePromptDialog';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';

interface Prompt {
  id: string;
  title: string;
  content: string;
  tag: string;
  createdAt: Date;
}

const Index = () => {
  const [prompts, setPrompts] = React.useState<Prompt[]>([]);
  const { user, signOut, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      navigate('/auth');
    }
  }, [isLoading, user, navigate]);

  const handleCreatePrompt = ({ title, content, tag }: { title: string; content: string; tag: string }) => {
    const newPrompt: Prompt = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      content,
      tag,
      createdAt: new Date(),
    };
    setPrompts((prev) => [newPrompt, ...prev]);
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <div className="container px-4 py-8 mx-auto fade-in">
      <div className="flex flex-col items-start gap-6">
        <div className="flex items-center justify-between w-full">
          <div>
            <h1 className="text-4xl font-bold">Promptly</h1>
            <p className="text-muted-foreground">Welcome, {user.email}</p>
          </div>
          <div className="flex items-center gap-4">
            <CreatePromptDialog onCreatePrompt={handleCreatePrompt} />
            <Button variant="outline" size="icon" onClick={signOut}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        {prompts.length === 0 ? (
          <div className="w-full text-center py-12">
            <p className="text-muted-foreground">No prompts yet. Create your first prompt to get started!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {prompts.map((prompt) => (
              <PromptCard
                key={prompt.id}
                title={prompt.title}
                content={prompt.content}
                tag={prompt.tag}
                createdAt={prompt.createdAt}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
