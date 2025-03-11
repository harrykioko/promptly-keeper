
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/components/ui/use-toast';
import { Prompt } from '@/hooks/usePrompts';

export interface Template {
  id: string;
  title: string;
  description: string | null;
  sequence: boolean;
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
    queryKey: ['templates'],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data: templatesData, error: templatesError } = await supabase
        .from('templates')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (templatesError) {
        console.error('Error fetching templates:', templatesError);
        toast({
          title: 'Error fetching templates',
          description: templatesError.message,
          variant: 'destructive',
        });
        return [];
      }

      const templates = [];
      
      for (const template of templatesData) {
        // Get the prompts for each template
        const { data: templatePromptsData, error: templatePromptsError } = await supabase
          .from('template_prompts')
          .select('prompt_id, position')
          .eq('template_id', template.id)
          .order('position', { ascending: true });
          
        if (templatePromptsError) {
          console.error('Error fetching template prompts:', templatePromptsError);
          continue;
        }
        
        if (templatePromptsData.length === 0) {
          templates.push({
            id: template.id,
            title: template.title,
            description: template.description,
            sequence: template.sequence,
            createdAt: new Date(template.created_at),
            prompts: [],
          });
          continue;
        }
        
        const promptIds = templatePromptsData.map(tp => tp.prompt_id);
        
        const { data: promptsData, error: promptsError } = await supabase
          .from('prompts')
          .select('*')
          .in('id', promptIds);
          
        if (promptsError) {
          console.error('Error fetching prompts for template:', promptsError);
          continue;
        }
        
        // Map the prompts to their positions
        const positionedPrompts = templatePromptsData.map(tp => {
          const prompt = promptsData.find(p => p.id === tp.prompt_id);
          if (!prompt) return null;
          
          return {
            id: prompt.id,
            title: prompt.title,
            content: prompt.content,
            tag: prompt.tag,
            createdAt: new Date(prompt.created_at),
            position: tp.position,
          };
        }).filter(Boolean).sort((a, b) => a.position - b.position);
        
        templates.push({
          id: template.id,
          title: template.title,
          description: template.description,
          sequence: template.sequence,
          createdAt: new Date(template.created_at),
          prompts: positionedPrompts,
        });
      }
      
      return templates;
    },
    enabled: !!userId,
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (templateInput: CreateTemplateInput) => {
      if (!userId) throw new Error('User not authenticated');
      
      // Create the template
      const { data: newTemplate, error: templateError } = await supabase
        .from('templates')
        .insert([
          {
            title: templateInput.title,
            description: templateInput.description,
            sequence: templateInput.sequence,
            user_id: userId,
          }
        ])
        .select();
      
      if (templateError) {
        console.error('Error creating template:', templateError);
        throw templateError;
      }
      
      const templateId = newTemplate[0].id;
      
      // Add template prompts
      const templatePrompts = templateInput.promptIds.map((promptId, index) => ({
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
      queryClient.invalidateQueries({ queryKey: ['templates'] });
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

  const handleCreateTemplate = (template: CreateTemplateInput) => {
    createTemplateMutation.mutate(template);
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
    handleTemplateClick
  };
};
