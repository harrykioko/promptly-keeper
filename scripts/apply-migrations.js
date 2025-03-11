// Script to apply database migrations to Supabase
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Configuration
const MIGRATIONS_DIR = path.join(__dirname, '../supabase/migrations');
const SQL_EDITOR_URL = 'https://supabase.com/dashboard/project/juxjuijwrrlgyfgskakf/sql';

// Get all migration files in order
const migrationFiles = fs.readdirSync(MIGRATIONS_DIR)
  .filter(file => file.endsWith('.sql'))
  .sort();

console.log('Found migration files:');
migrationFiles.forEach(file => console.log(`- ${file}`));
console.log('\n');

// Instructions for manual application
console.log(`To apply these migrations, follow these steps:

1. Go to the Supabase SQL Editor: ${SQL_EDITOR_URL}
2. Apply each migration file in the following order:
`);

migrationFiles.forEach(file => {
  const filePath = path.join(MIGRATIONS_DIR, file);
  const content = fs.readFileSync(filePath, 'utf8');
  console.log(`   - ${file}`);
});

console.log(`
3. For each file:
   - Copy the SQL content
   - Paste it into the SQL Editor
   - Click "Run" to execute the migration
   - Verify that the migration completed successfully

4. After applying all migrations, update your application code to use the new database structure.

Note: If you have the Supabase CLI installed, you can also run:
  supabase login
  supabase link --project-ref juxjuijwrrlgyfgskakf
  supabase db push
`);

// Check if Supabase CLI is installed
try {
  const supabaseVersion = execSync('supabase --version', { stdio: 'pipe' }).toString().trim();
  console.log(`\nDetected Supabase CLI: ${supabaseVersion}`);
  console.log('You can use the CLI to apply migrations automatically.');
} catch (error) {
  console.log('\nSupabase CLI not detected. Install it with: npm install -g supabase');
} 