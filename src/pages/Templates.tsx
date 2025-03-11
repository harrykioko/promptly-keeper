
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/components/AuthProvider';
import CreateTemplateDialog from '@/components/CreateTemplateDialog';
import TemplateCard from '@/components/TemplateCard';
import TemplateDetailDialog from '@/components/TemplateDetailDialog';
import { Loader2 } from 'lucide-react';
import { useTemplates } from '@/hooks/useTemplates';
import { usePrompts } from '@/hooks/usePrompts';

const Templates = () => {
  const { user, isLoading: isLoadingAuth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoadingAuth && !user) {
      navigate('/auth');
    }
  }, [isLoadingAuth, user, navigate]);

  const {
    prompts,
    isLoadingPrompts,
  } = usePrompts(user?.id);

  const {
    templates,
    isLoadingTemplates,
    selectedTemplate,
    detailDialogOpen,
    setDetailDialogOpen,
    handleCreateTemplate,
    handleTemplateClick
  } = useTemplates(user?.id);

  if (isLoadingAuth || !user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8 fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-muted-foreground">
            Create and manage reusable collections of prompts
          </p>
        </div>
        <CreateTemplateDialog 
          prompts={prompts}
          onCreateTemplate={handleCreateTemplate}
        />
      </div>

      {isLoadingTemplates || isLoadingPrompts ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
          <span>Loading templates...</span>
        </div>
      ) : templates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard
              key={template.id}
              id={template.id}
              title={template.title}
              description={template.description}
              promptCount={template.prompts.length}
              sequence={template.sequence}
              createdAt={template.createdAt}
              onClick={() => handleTemplateClick(template)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-medium mb-2">No templates yet</h3>
          <p className="text-muted-foreground mb-4">
            Create your first template to organize related prompts together
          </p>
          <CreateTemplateDialog 
            prompts={prompts}
            onCreateTemplate={handleCreateTemplate}
          />
        </div>
      )}

      <TemplateDetailDialog
        open={detailDialogOpen}
        onOpenChange={setDetailDialogOpen}
        template={selectedTemplate}
      />
    </div>
  );
};

export default Templates;
