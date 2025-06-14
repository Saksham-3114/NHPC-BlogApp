import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { auth } from '@/auth' 

export async function POST(
  req: NextRequest
) {
   const url = new URL(req.url);
  const postId = url.pathname.split('/').at(-2) as string;
  try {
    // Get the current user (adjust this based on your auth implementation)
    const session = await auth()
    if (!session?.user?.name) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    // console.log(session.user.id);

    const username = session.user.name as string

    const user= await db.user.findUnique({
        where: {
            name: username
        }
    })
    const authorId=user?.id as string

    // Check if user already liked this post
    const existingLike = await db.like.findUnique({
      where: {
        postId_authorId:{
            postId,
            authorId
        }
      }
    })

    if (existingLike) {
      // Unlike the post
      await db.like.delete({
        where: {
          id: existingLike.id
        }
      })

      // Get updated like count
      const likeCount = await db.like.count({
        where: { postId }
      })

      return NextResponse.json({ 
        liked: false, 
        likeCount,
        message: 'Post unliked successfully' 
      })
    } else {
      // Like the post
      await db.like.create({
        data: {
          postId: postId,
          authorId: authorId
        }
      })

      // Get updated like count
      const likeCount = await db.like.count({
        where: { postId }
      })

      return NextResponse.json({ 
        liked: true, 
        likeCount,
        message: 'Post liked successfully' 
      })
    }
  } catch (error) {
    console.error('Error handling like:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}