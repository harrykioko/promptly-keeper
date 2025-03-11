-- Migration: 02_foreign_key_constraints.sql
-- Description: Adds missing foreign key constraints and referential actions

-- Add missing foreign key constraints
ALTER TABLE prompts 
ADD CONSTRAINT fk_prompts_user_id 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

ALTER TABLE templates 
ADD CONSTRAINT fk_templates_user_id 
FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE;

-- Update existing foreign keys with proper referential actions
ALTER TABLE template_prompts
DROP CONSTRAINT IF EXISTS template_prompts_prompt_id_fkey,
ADD CONSTRAINT template_prompts_prompt_id_fkey
FOREIGN KEY (prompt_id) REFERENCES prompts(id) ON DELETE CASCADE;

ALTER TABLE template_prompts
DROP CONSTRAINT IF EXISTS template_prompts_template_id_fkey,
ADD CONSTRAINT template_prompts_template_id_fkey
FOREIGN KEY (template_id) REFERENCES templates(id) ON DELETE CASCADE; 