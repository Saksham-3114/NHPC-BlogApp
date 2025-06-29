'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function createBlogAction(data: {
  title: string
  category: string
  summary: string
  content: string
  tags: string[]
  featureImage: string
  username: string
}) {
  let post;

  try {
    const user=await db.user.findUnique({
        where: {name: data.username}
    })
    if(!user?.id) throw new Error("NO User Id");
    post = await db.post.create({
      data: {
        title: data.title,
        categoryId: data.category,
        summary: data.summary,
        content: data.content,
        published: 'false',
        authorId: user?.id,
        image: data.featureImage,
        tags: data.tags
      }
    })

    if (!post) {
      return { error: 'Failed to create the blog.' }
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { error: error.message || 'Failed to create the blog.' }
  }

  revalidatePath('/')
  redirect(`/blog/${post.id}`)
}


export async function editBlogAction(data: {
  title: string
  category: string
  summary: string
  content: string
  tags: string[]
  featureImage: string
  username: string
  postId: string
}) {
  let post;

  try {
    const user=await db.user.findUnique({
        where: {name: data.username}
    })
    if(!user?.id) throw new Error("NO User Id");
    post = await db.post.update({
      where:{id: data.postId},
      data: {
        title: data.title,
        categoryId: data.category,
        summary: data.summary,
        content: data.content,
        published: 'false',
        authorId: user?.id,
        image: data.featureImage,
        tags: data.tags
      }
    })

    if (!post) {
      return { error: 'Failed to create the blog.' }
    }
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    return { error: error.message || 'Failed to create the blog.' }
  }

  revalidatePath('/')
  redirect(`/blog/${post.id}`)
}
