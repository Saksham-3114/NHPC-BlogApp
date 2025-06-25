import { db } from '@/lib/db' 
import BlogPage from '@/components/BlogPage'


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

export interface Post {
  id: string;
  title: string;
  content: string;
  published: "true" | "false" | "reject";
  Category: string[];
  authorId: string;
  createdAt: Date | string;
  author?: User;
  likes?: Like[];
}

export default async function Blog() {
  


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
}