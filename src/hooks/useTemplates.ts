import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/ui/use-toast';
import { Prompt } from '@/hooks/usePrompts';
import { Template as DbTemplate, NewTemplate, TemplateWithPrompts, NewTemplatePrompt } from '@/types/database';

// Extended Template interface that includes UI-specific properties
export interface Template extends Omit<DbTemplate, 'created_at'> {
  createdAt: Date;
  prompts: Prompt[];
}

interface CreateTemplateInput {
  title: string;
  description: string | null;
  sequence: boolean;
  promptIds: string[];
}

export const useTemplates = (userId: string | undefined) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  const { data: templatesData, isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['templates', userId],
    queryFn: async () => {
      if (!userId) return [];
      
      // Use the templates_with_prompts view for better performance
      const { data: templatesWithPromptsData, error: templatesError } = await supabase
        .from('templates_with_prompts')
        .select('*')
        .eq('user_id', userId);
      
      if (templatesError) {
        console.error('Error fetching templates:', templatesError);
        toast({
          title: 'Error fetching templates',
          description: templatesError.message,
          variant: 'destructive',
        });
        return [];
      }

      // Process the results to group prompts by template
      const templatesMap = new Map<string, Template>();
      
      templatesWithPromptsData.forEach((row: TemplateWithPrompts) => {
        if (!templatesMap.has(row.template_id)) {
          templatesMap.set(row.template_id, {
            id: row.template_id,
            title: row.template_title,
            description: row.template_description,
            sequence: row.sequence,
            createdAt: new Date(row.template_created_at),
            user_id: row.user_id,
            prompts: []
          });
        }
        
        if (row.prompt_id) {
          templatesMap.get(row.template_id)!.prompts.push({
            id: row.prompt_id,
            title: row.prompt_title || '',
            content: row.prompt_content || '',
            tag: row.prompt_tag || 'general',
            tags: [], // We don't have tags in this view, would need another query if needed
            createdAt: new Date(row.prompt_created_at || ''),
            position: row.position || 0,
            user_id: row.user_id,
            is_public: false,
            category_id: null,
            version: 1,
            is_favorite: false,
            usage_count: 0,
            created_at: row.prompt_created_at || '',
            updated_at: '',
            last_used_at: null
          });
        }
      });
      
      return Array.from(templatesMap.values());
    },
    enabled: !!userId,
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (templateInput: CreateTemplateInput) => {
      if (!userId) throw new Error('User not authenticated');
      
      // Create the template
      const templateData: NewTemplate = {
        title: templateInput.title,
        description: templateInput.description,
        sequence: templateInput.sequence,
        user_id: userId,
      };
      
      const { data: newTemplate, error: templateError } = await supabase
        .from('templates')
        .insert(templateData)
        .select();
      
      if (templateError) {
        console.error('Error creating template:', templateError);
        throw templateError;
      }
      
      const templateId = newTemplate[0].id;
      
      // Add template prompts
      const templatePrompts: NewTemplatePrompt[] = templateInput.promptIds.map((promptId, index) => ({
        template_id: templateId,
        prompt_id: promptId,
        position: index + 1,
      }));
      
      const { error: templatePromptsError } = await supabase
        .from('template_prompts')
        .insert(templatePrompts);
      
      if (templatePromptsError) {
        console.error('Error creating template prompts:', templatePromptsError);
        // Clean up the template if adding prompts fails
        await supabase.from('templates').delete().eq('id', templateId);
        throw templatePromptsError;
      }
      
      return newTemplate[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates', userId] });
      toast({
        title: "Template created",
        description: "Your template has been saved successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error creating template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const deleteTemplateMutation = useMutation({
    mutationFn: async (templateId: string) => {
      // With CASCADE delete, we only need to delete the template
      const { error } = await supabase.from('templates').delete().eq('id', templateId);
      
      if (error) {
        console.error('Error deleting template:', error);
        throw error;
      }
      
      return templateId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['templates', userId] });
      toast({
        title: "Template deleted",
        description: "Your template has been deleted successfully.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error deleting template",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCreateTemplate = (template: CreateTemplateInput) => {
    createTemplateMutation.mutate(template);
  };

  const handleDeleteTemplate = (templateId: string) => {
    deleteTemplateMutation.mutate(templateId);
  };

  const handleTemplateClick = (template: Template) => {
    setSelectedTemplate(template);
    setDetailDialogOpen(true);
  };

  return {
    templates: templatesData || [],
    isLoadingTemplates,
    selectedTemplate,
    detailDialogOpen,
    setDetailDialogOpen,
    handleCreateTemplate,
    handleDeleteTemplate,
    handleTemplateClick
  };
};
