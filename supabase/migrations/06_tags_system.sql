-- Migration: 06_tags_system.sql
-- Description: Implements a proper tags system with many-to-many relationships

-- Create an enum for tag types (for backward compatibility)
CREATE TYPE tag_type AS ENUM ('general', 'code', 'writing', 'chat', 'other');

-- Create tags table
CREATE TABLE IF NOT EXISTS tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS on tags table
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for tags
CREATE POLICY tags_select ON tags FOR SELECT USING (true);

-- Create prompt_tags junction table
CREATE TABLE IF NOT EXISTS prompt_tags (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  prompt_id UUID NOT NULL REFERENCES prompts(id) ON DELETE CASCADE,
  tag_id UUID NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  UNIQUE(prompt_id, tag_id)
);

-- Enable RLS on prompt_tags table
ALTER TABLE prompt_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for prompt_tags
CREATE POLICY prompt_tags_select ON prompt_tags
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM prompts 
      WHERE prompts.id = prompt_tags.prompt_id 
      AND prompts.user_id = auth.uid()
    )
  );
  
CREATE POLICY prompt_tags_insert ON prompt_tags
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM prompts 
      WHERE prompts.id = prompt_tags.prompt_id 
      AND prompts.user_id = auth.uid()
    )
  );
  
CREATE POLICY prompt_tags_delete ON prompt_tags
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM prompts 
      WHERE prompts.id = prompt_tags.prompt_id 
      AND prompts.user_id = auth.uid()
    )
  );

-- Create index on prompt_tags
CREATE INDEX IF NOT EXISTS idx_prompt_tags_prompt_id ON prompt_tags(prompt_id);
CREATE INDEX IF NOT EXISTS idx_prompt_tags_tag_id ON prompt_tags(tag_id);

-- Insert default tags
INSERT INTO tags (name) VALUES 
  ('general'),
  ('code'),
  ('writing'),
  ('chat'),
  ('other')
ON CONFLICT (name) DO NOTHING;

-- Create a view to get prompts with their tags
CREATE OR REPLACE VIEW prompts_with_tags AS
SELECT 
  p.id,
  p.title,
  p.content,
  p.tag,
  p.created_at,
  p.user_id,
  COALESCE(
    json_agg(
      json_build_object(
        'id', t.id,
        'name', t.name
      )
    ) FILTER (WHERE t.id IS NOT NULL),
    '[]'::json
  ) as tags
FROM 
  prompts p
LEFT JOIN 
  prompt_tags pt ON p.id = pt.prompt_id
LEFT JOIN 
  tags t ON pt.tag_id = t.id
GROUP BY 
  p.id;

-- Enable RLS on the view
ALTER VIEW prompts_with_tags ENABLE ROW LEVEL SECURITY;

-- Create RLS policy for the view
CREATE POLICY prompts_with_tags_select ON prompts_with_tags
  FOR SELECT USING (auth.uid() = user_id); 