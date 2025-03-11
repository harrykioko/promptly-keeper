-- Migration: 05_data_integrity.sql
-- Description: Adds data integrity constraints and default values

-- Add unique constraint for template titles per user
ALTER TABLE templates
ADD CONSTRAINT unique_template_title_per_user UNIQUE (user_id, title);

-- Add check constraint for minimum prompt content length
ALTER TABLE prompts
ADD CONSTRAINT check_prompt_content_length CHECK (length(content) >= 1);

-- Add default values for nullable columns
ALTER TABLE templates 
ALTER COLUMN sequence SET DEFAULT false;

ALTER TABLE profiles
ALTER COLUMN updated_at SET DEFAULT now(); 