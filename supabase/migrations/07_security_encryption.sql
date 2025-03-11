-- Migration: 07_security_encryption.sql
-- Description: Implements encryption for sensitive data

-- Add pgcrypto extension if not already available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create a function to encrypt sensitive data
CREATE OR REPLACE FUNCTION encrypt_content(content text, key text) RETURNS text AS $$
BEGIN
  RETURN pgp_sym_encrypt(content, key);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to decrypt sensitive data
CREATE OR REPLACE FUNCTION decrypt_content(encrypted_content text, key text) RETURNS text AS $$
BEGIN
  RETURN pgp_sym_decrypt(encrypted_content::bytea, key);
EXCEPTION
  WHEN OTHERS THEN
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Add option for encrypted prompts
ALTER TABLE prompts
ADD COLUMN is_encrypted BOOLEAN DEFAULT false,
ADD COLUMN encrypted_content TEXT;

-- Create a secure view that automatically decrypts content
CREATE OR REPLACE VIEW secure_prompts AS
SELECT
  id,
  title,
  CASE
    WHEN is_encrypted THEN 
      decrypt_content(encrypted_content, current_setting('app.encryption_key', true))
    ELSE content
  END AS content,
  tag,
  created_at,
  user_id,
  is_encrypted
FROM prompts;

-- Enable RLS on the secure view
ALTER VIEW secure_prompts ENABLE ROW LEVEL SECURITY;

-- Apply the same RLS policy as the prompts table
CREATE POLICY secure_prompts_select ON secure_prompts
  FOR SELECT USING (auth.uid() = user_id); 