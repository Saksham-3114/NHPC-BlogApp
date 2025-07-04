# Blog Platform Documentation

## Overview

**Blog Platform** is a modern, full-featured blogging application developed for **NHPC Ltd.**. It is designed to serve the content creation and management needs of NHPC employees and stakeholders. The platform integrates with NHPC's ERP login system for secure authentication, ensuring only authorized users can access and contribute to the platform. Built with Next.js, TypeScript, and Prisma, it offers a seamless experience for writing, managing, and discovering content. The platform is optimized for performance, accessibility, and SEO, ensuring high discoverability and user engagement.

---

## SEO Score

- **SEO Optimized**: The platform follows best practices for SEO, including server-side rendering, semantic HTML, meta tags, Open Graph support, and fast load times.
- **Typical Lighthouse SEO Score**: 95+ (with proper deployment and configuration)
- **Features for SEO**:
  - Dynamic meta tags for each blog post and page
  - Clean, crawlable URLs
  - Sitemap and robots.txt support
  - Optimized images and lazy loading

---

## Features

### User Authentication
- Secure registration, login, and logout
- Password reset and forgot password flows
- Credential Login and ERP Login
- Role-based access (admin, user)

### Blog Management
- Create, edit, and delete blog posts
- Rich text editor with image upload (Tiptap/ProseMirror)
- Drafts and publishing workflow
- Blog post review and approval (admin)
- Blog listing, filtering, and search
- View counts and engagement metrics

### Category Management
- Create, edit, and delete categories (admin)
- Assign categories to blog posts
- Category-based filtering

### User Profile
- View and edit profile information
- List of user’s own blogs
- Profile image upload

### Admin Dashboard
- Manage users, blogs, and categories
- Approve or reject blog posts
- Analytics and overview (future prospect)

### UI/UX
- Responsive and accessible design
- Modern UI with Tailwind CSS
- Reusable UI components

### Utilities
- Email notifications (password reset, approvals)
- Database seeding and admin creation scripts
- Dockerized for easy deployment

---

## Tech Stack

- **Next.js** (App Router, SSR, SSG)
- **TypeScript**
- **Tailwind CSS**
- **Prisma ORM**
- **PostgreSQL** (default, configurable)
- **Tiptap/ProseMirror** (rich text editor)
- **Docker**
- **ESLint**

---

## Project Structure & Key Modules

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
