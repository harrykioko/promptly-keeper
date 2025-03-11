-- Migration: 01_security_rls_policies.sql
-- Description: Implements Row Level Security (RLS) policies for all tables

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE template_prompts ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY profiles_select ON profiles
  FOR SELECT USING (auth.uid() = id);
  
CREATE POLICY profiles_insert ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
  
CREATE POLICY profiles_update ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Prompts policies
CREATE POLICY prompts_select ON prompts
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY prompts_insert ON prompts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY prompts_update ON prompts
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY prompts_delete ON prompts
  FOR DELETE USING (auth.uid() = user_id);

-- Templates policies
CREATE POLICY templates_select ON templates
  FOR SELECT USING (auth.uid() = user_id);
  
CREATE POLICY templates_insert ON templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);
  
CREATE POLICY templates_update ON templates
  FOR UPDATE USING (auth.uid() = user_id);
  
CREATE POLICY templates_delete ON templates
  FOR DELETE USING (auth.uid() = user_id);

-- Template_prompts policies (based on template ownership)
CREATE POLICY template_prompts_select ON template_prompts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM templates 
      WHERE templates.id = template_prompts.template_id 
      AND templates.user_id = auth.uid()
    )
  );
  
CREATE POLICY template_prompts_insert ON template_prompts
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM templates 
      WHERE templates.id = template_prompts.template_id 
      AND templates.user_id = auth.uid()
    )
  );
  
CREATE POLICY template_prompts_update ON template_prompts
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM templates 
      WHERE templates.id = template_prompts.template_id 
      AND templates.user_id = auth.uid()
    )
  );
  
CREATE POLICY template_prompts_delete ON template_prompts
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM templates 
      WHERE templates.id = template_prompts.template_id 
      AND templates.user_id = auth.uid()
    )
  ); 