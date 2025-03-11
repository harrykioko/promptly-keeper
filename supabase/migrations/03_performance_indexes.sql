-- Migration: 03_performance_indexes.sql
-- Description: Adds indexes for frequently queried columns to improve performance

-- Add indexes for frequently queried columns
CREATE INDEX IF NOT EXISTS idx_prompts_user_id ON prompts(user_id);
CREATE INDEX IF NOT EXISTS idx_prompts_tag ON prompts(tag);
CREATE INDEX IF NOT EXISTS idx_templates_user_id ON templates(user_id);
CREATE INDEX IF NOT EXISTS idx_template_prompts_template_position ON template_prompts(template_id, position);

-- Add composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_template_prompts_template_prompt ON template_prompts(template_id, prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompts_user_created ON prompts(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_templates_user_created ON templates(user_id, created_at DESC); 