
import React from 'react';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import CreatePromptDialog from '@/components/CreatePromptDialog';

interface PromptHeaderProps {
  displayName: string;
  onSignOut: () => void;
  onCreatePrompt: (prompt: { title: string; content: string; tag: string }) => void;
}

const PromptHeader: React.FC<PromptHeaderProps> = ({ 
  displayName, 
  onSignOut, 
  onCreatePrompt 
}) => {
  return (
    <div className="flex items-center justify-between w-full">
      <div>
        <h1 className="text-4xl font-bold">Promptly</h1>
        <p className="text-muted-foreground">Welcome, {displayName}</p>
      </div>
      <div className="flex items-center gap-4">
        <CreatePromptDialog onCreatePrompt={onCreatePrompt} />
        <Button variant="outline" size="icon" onClick={onSignOut}>
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default PromptHeader;
