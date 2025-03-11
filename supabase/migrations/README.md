# Promptly Database Migrations

This directory contains SQL migration files to optimize the Supabase database structure for the Promptly application.

## Migration Files

1. **01_security_rls_policies.sql**
   - Implements Row Level Security (RLS) policies for all tables
   - Ensures data isolation between users
   - Prevents unauthorized access to data

2. **02_foreign_key_constraints.sql**
   - Adds missing foreign key constraints
   - Implements proper referential actions (ON DELETE CASCADE)
   - Ensures data integrity between related tables

3. **03_performance_indexes.sql**
   - Adds indexes for frequently queried columns
   - Creates composite indexes for common query patterns
   - Improves query performance

4. **04_performance_views.sql**
   - Creates a view to efficiently join templates with their prompts
   - Solves N+1 query issues
   - Improves application performance

5. **05_data_integrity.sql**
   - Adds unique constraints for template titles per user
   - Implements check constraints for data validation
   - Sets default values for nullable columns

6. **06_tags_system.sql**
   - Implements a proper tags system with many-to-many relationships
   - Creates a view to efficiently retrieve prompts with their tags
   - Improves data model flexibility

7. **07_security_encryption.sql**
   - Implements encryption for sensitive data
   - Creates functions for encrypting and decrypting content
   - Provides a secure view for accessing encrypted data

## How to Apply Migrations

To apply these migrations to your Supabase project, you can use the Supabase CLI:

```bash
# Install Supabase CLI if you haven't already
npm install -g supabase

# Login to Supabase
supabase login

# Link your project
supabase link --project-ref juxjuijwrrlgyfgskakf

# Apply migrations
supabase db push
```

Alternatively, you can run these SQL scripts directly in the Supabase SQL Editor in the following order:

1. 01_security_rls_policies.sql
2. 02_foreign_key_constraints.sql
3. 03_performance_indexes.sql
4. 04_performance_views.sql
5. 05_data_integrity.sql
6. 06_tags_system.sql
7. 07_security_encryption.sql

## Application Code Updates

After applying these migrations, you'll need to update your application code to use the new database structure. Here are some key changes:

1. **Use the templates_with_prompts view** to replace the nested queries in useTemplates.ts
2. **Use the prompts_with_tags view** to get prompts with their tags
3. **Use the secure_prompts view** for accessing potentially sensitive prompt content
4. **Update your types** to match the new database schema

## Setting the Encryption Key

To use the encryption features, you need to set the `app.encryption_key` setting in your Supabase project:

```sql
ALTER SYSTEM SET app.encryption_key = 'your-secure-encryption-key';
```

Make sure to store this key securely and include it in your application's environment variables. 