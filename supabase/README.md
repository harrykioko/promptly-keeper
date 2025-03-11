# Promptly Database Structure

This directory contains the database schema and migrations for the Promptly application.

## Database Tables

### Users
Stores user information.
- `id`: UUID (primary key)
- `created_at`: Timestamp
- `email`: String (unique)
- `name`: String (nullable)
- `avatar_url`: String (nullable)
- `preferences`: JSON (nullable)

### Prompts
Stores user prompts.
- `id`: UUID (primary key)
- `created_at`: Timestamp
- `updated_at`: Timestamp
- `title`: String
- `content`: String
- `user_id`: UUID (foreign key to users.id)
- `is_public`: Boolean
- `category_id`: UUID (foreign key to categories.id, nullable)
- `tags`: String array (nullable)
- `version`: Integer
- `is_favorite`: Boolean
- `usage_count`: Integer
- `last_used_at`: Timestamp (nullable)

### Categories
Stores prompt categories.
- `id`: UUID (primary key)
- `created_at`: Timestamp
- `name`: String
- `description`: String (nullable)
- `user_id`: UUID (foreign key to users.id)
- `color`: String (nullable)
- `icon`: String (nullable)

### Prompt Versions
Stores version history of prompts.
- `id`: UUID (primary key)
- `created_at`: Timestamp
- `prompt_id`: UUID (foreign key to prompts.id)
- `content`: String
- `version_number`: Integer
- `title`: String
- `user_id`: UUID (foreign key to users.id)

### Prompt Usage
Tracks usage of prompts.
- `id`: UUID (primary key)
- `created_at`: Timestamp
- `prompt_id`: UUID (foreign key to prompts.id)
- `user_id`: UUID (foreign key to users.id)
- `context`: JSON (nullable)

### Shared Prompts
Tracks prompts shared between users.
- `id`: UUID (primary key)
- `created_at`: Timestamp
- `prompt_id`: UUID (foreign key to prompts.id)
- `shared_by`: UUID (foreign key to users.id)
- `shared_with`: UUID (foreign key to users.id)
- `permissions`: String

## Indexes

The following indexes are created to optimize query performance:

- `prompts_user_id_idx`: Index on `prompts.user_id`
- `prompts_category_id_idx`: Index on `prompts.category_id`
- `categories_user_id_idx`: Index on `categories.user_id`
- `prompt_versions_prompt_id_idx`: Index on `prompt_versions.prompt_id`
- `prompt_versions_user_id_idx`: Index on `prompt_versions.user_id`
- `prompt_usage_prompt_id_idx`: Index on `prompt_usage.prompt_id`
- `prompt_usage_user_id_idx`: Index on `prompt_usage.user_id`
- `shared_prompts_prompt_id_idx`: Index on `shared_prompts.prompt_id`
- `shared_prompts_shared_by_idx`: Index on `shared_prompts.shared_by`
- `shared_prompts_shared_with_idx`: Index on `shared_prompts.shared_with`

## Foreign Key Constraints

The following foreign key constraints ensure data integrity:

- `prompts_user_id_fkey`: `prompts.user_id` references `users.id`
- `prompts_category_id_fkey`: `prompts.category_id` references `categories.id`
- `categories_user_id_fkey`: `categories.user_id` references `users.id`
- `prompt_versions_prompt_id_fkey`: `prompt_versions.prompt_id` references `prompts.id`
- `prompt_versions_user_id_fkey`: `prompt_versions.user_id` references `users.id`
- `prompt_usage_prompt_id_fkey`: `prompt_usage.prompt_id` references `prompts.id`
- `prompt_usage_user_id_fkey`: `prompt_usage.user_id` references `users.id`
- `shared_prompts_prompt_id_fkey`: `shared_prompts.prompt_id` references `prompts.id`
- `shared_prompts_shared_by_fkey`: `shared_prompts.shared_by` references `users.id`
- `shared_prompts_shared_with_fkey`: `shared_prompts.shared_with` references `users.id`

## Applying Migrations

To apply the migrations to your Supabase project, you can use one of the following methods:

### Method 1: Using the Supabase CLI

If you have the Supabase CLI installed, you can run:

```bash
supabase login
supabase link --project-ref juxjuijwrrlgyfgskakf
supabase db push
```

### Method 2: Using the SQL Editor

1. Go to the Supabase SQL Editor: https://supabase.com/dashboard/project/juxjuijwrrlgyfgskakf/sql
2. Apply each migration file in order from the `migrations` directory
3. For each file:
   - Copy the SQL content
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration
   - Verify that the migration completed successfully

### Method 3: Using the Migration Script

Run the migration script from the project root:

```bash
node scripts/apply-migrations.js
```

This will list all migration files and provide instructions for applying them.

## Type Definitions

The TypeScript type definitions for the database schema can be found in `src/types/database.ts`. These types are used throughout the application to ensure type safety when interacting with the database. 