# Blog Platform

A full-featured blogging platform built with Next.js, TypeScript, Tailwind CSS, Prisma, and more. This project supports user authentication, blog creation and management, category management, profile editing, and rich text editing with image uploads.

## Tech Stack

- **Next.js**: React framework for server-side rendering and static site generation
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Prisma**: ORM for database access
- **PostgreSQL**: Database (configurable)
- **ProseMirror/Tiptap**: Rich text editor
- **Docker**: Containerization (via `docker-compose.yml`)
- **ESLint**: Linting
- **Other**: Custom hooks, utility libraries, and more

## Project Structure & Key Functions

### Authentication
- `app/(auth)/login/`, `register/`, `forgot-password/`, `reset-password/`: Pages for user authentication and password management.
- `lib/auth-utils.ts`: Utility functions for authentication (e.g., token handling, session management).
- `app/api/auth/`: API routes for login, registration, and authentication logic.

### Blog Management
- `app/(root)/blog/`: Blog listing and detail pages.
- `app/(root)/write/`: Page for creating new blog posts.
- `app/(root)/editpage/`: Page for editing existing blog posts.
- `app/(root)/manage/`: Admin interface for managing blogs and categories.
- `components/BlogPage.tsx`: Renders a single blog post.
- `components/HomeBlogList.tsx`, `ProfileBlogList.tsx`, `UserBlogList.tsx`: Render lists of blogs for home, profile, and user views.
- `app/actions/editorAction.ts`, `deleteBlog.ts`, `reviewActions.ts`: Server actions for creating, editing, deleting, and reviewing blogs.

### Rich Text Editor
- `components/editor/editor.tsx`: Main editor component using Tiptap/ProseMirror.
- `components/editor/extensions.ts`: Custom editor extensions.
- `components/editor/image-upload.ts`: Handles image uploads in the editor.
- `components/editor/editor-menu.tsx`, `slash-command.tsx`: Editor UI and commands.

### Category Management
- `components/ManageCategories.tsx`: UI for managing blog categories.
- `app/api/categories/`: API routes for category CRUD operations.

### User Profile
- `app/(root)/profile/`: User profile page.
- `components/ManagePageClient.tsx`: Client-side logic for profile and management pages.

### Utilities & Hooks
- `lib/utils.ts`: General utility functions.
- `lib/db.ts`: Database connection and helpers.
- `lib/email.ts`: Email sending utilities (for password reset, etc.).
- `hooks/use-mounted.tsx`: Custom React hook for component mount state.

### Database & Seeding
- `database/prisma/`: Prisma schema and migrations.
- `database/seed.ts`: Script to seed the database with initial data.
- `database/addAdmin.ts`: Script to add an admin user.

### UI Components
- `components/ui/`: Reusable UI components (buttons, forms, inputs, dropdowns, etc.).
- `components/form/`: Form components for login, registration, password reset, etc.

### Configuration
- `next.config.ts`: Next.js configuration.
- `tailwind.config.ts`: Tailwind CSS configuration.
- `eslint.config.mjs`: ESLint configuration.
- `docker-compose.yml`: Docker setup for local development.

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set up environment variables:**
   - Create a `.env` file based on `.env.example` (if provided).
3. **Run database migrations:**
   ```sh
   npx prisma migrate dev
   ```
4. **Seed the database (optional):**
   ```sh
   npm run seed
   ```
5. **Start the development server:**
   ```sh
   npm run dev
   ```
6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

## Contributing

Feel free to open issues or submit pull requests for improvements and bug fixes.

## License

MIT License
