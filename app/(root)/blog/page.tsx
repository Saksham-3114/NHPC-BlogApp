import { db } from '@/lib/db' 
import BlogPage from '@/components/BlogPage'

// Force dynamic rendering - this ensures the page is never cached
export const dynamic = 'force-dynamic'

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date | string;
}

interface Like {
  id: string;
  liked: boolean;
  postId: string;
  authorId: string;
  createdAt: Date | string;
  author?: User;
}

interface Categories{
  id: string;
  name: string;
}

export interface Post {
  id: string;
  title: string;
  summary: string | null;
  image: string;
  content: string;
  published: "true" | "false" | "reject";
  tags: string[];
  authorId: string;
  createdAt: Date | string;
  author?: User;
  category?: Categories;
  likes?: Like[];
}

export default async function Blog() {
  try {
    const posts = await db.post.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
            bio: true,
            createdAt: true
          }
        },
        likes: {
          select: {
            id: true,
            liked: true,
            postId: true,
            authorId: true,
            createdAt: true
          }
        },
        category: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      where: {
        published: 'true' 
      }
    })

    const serializedPosts = posts.map(post => ({
      ...post,
      createdAt: post.createdAt.toISOString(),
      author: post.author ? {
        ...post.author,
        createdAt: post.author.createdAt.toISOString()
      } : undefined,
      likes: post.likes?.map(like => ({
        ...like,
        createdAt: like.createdAt.toISOString()
      })),
    }))

    return <BlogPage posts={serializedPosts} />
  } catch (error) {
    console.error('Error fetching posts:', error)
    return <BlogPage posts={[]} />
  }
}