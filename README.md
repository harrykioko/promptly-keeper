# Promptly - AI Prompt Management System

Promptly is a comprehensive AI prompt management system that helps you organize, version, and share your AI prompts.

## Features

- **Prompt Management**: Create, edit, and organize your AI prompts
- **Versioning**: Keep track of changes to your prompts over time
- **Categories**: Organize prompts into categories for easy access
- **Sharing**: Share prompts with other users
- **Usage Tracking**: Track how often prompts are used
- **Favorites**: Mark prompts as favorites for quick access

## Tech Stack

- **Frontend**: Next.js, React, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Authentication, Storage)
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/promptly.git
   cd promptly
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Apply database migrations:
   ```bash
   node scripts/apply-migrations.js
   ```
   Follow the instructions provided by the script to apply the migrations to your Supabase project.

5. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Database Structure

The application uses a PostgreSQL database hosted on Supabase with the following tables:

- `users`: User information
- `prompts`: AI prompts created by users
- `categories`: Categories for organizing prompts
- `prompt_versions`: Version history of prompts
- `prompt_usage`: Usage tracking for prompts
- `shared_prompts`: Prompts shared between users

For detailed information about the database structure, see [supabase/README.md](supabase/README.md).

## Type Safety

The application uses TypeScript for type safety. The database schema is defined as TypeScript types in `src/types/database.ts`.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- [Supabase](https://supabase.io/) for the backend infrastructure
- [Next.js](https://nextjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
