-- Migration: 04_performance_views.sql
-- Description: Creates views to optimize query performance and solve N+1 query issues

-- Create a view to efficiently join templates with their prompts
CREATE OR REPLACE VIEW templates_with_prompts AS
SELECT 
  t.id AS template_id,
  t.title AS template_title,
  t.description AS template_description,
  t.sequence,
  t.created_at AS template_created_at,
  t.user_id,
  p.id AS prompt_id,
  p.title AS prompt_title,
  p.content AS prompt_content,
  p.tag AS prompt_tag,
  p.created_at AS prompt_created_at,
  tp.position
FROM 
  templates t
LEFT JOIN 
  template_prompts tp ON t.id = tp.template_id
LEFT JOIN 
  prompts p ON tp.prompt_id = p.id
ORDER BY 
  t.created_at DESC, tp.position ASC;

-- Enable RLS on the view
ALTER VIEW templates_with_prompts ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the view
CREATE POLICY templates_with_prompts_select ON templates_with_prompts
  FOR SELECT USING (auth.uid() = user_id); 