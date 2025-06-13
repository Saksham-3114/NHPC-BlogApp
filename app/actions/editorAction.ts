'use server'

import { revalidatePath } from 'next/cache'
import { db } from '@/lib/db'
import { redirect } from 'next/navigation'

export async function createBlogAction(data: {
  title: string
  categories: string[]
  content: string
  username: string
}) {
  // TODO: validate the data

  let post;

  try {
    const user=await db.user.findUnique({
        where: {name: data.username}
    })
    if(!user?.id) throw new Error("NO User Id");
    post = await db.post.create({
      data: {
        title: data.title,
        Category: data.categories,
        content: data.content,
        published: 'false',
        authorId: user?.id
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
