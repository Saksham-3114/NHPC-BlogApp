'use client'

import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react' // Adjust based on your auth
import toast from 'react-hot-toast'

interface LikeButtonProps {
  postId: string
  initialLiked: boolean
  initialLikeCount: number
}

export default function LikeButton({ 
  postId, 
  initialLiked, 
  initialLikeCount 
}: LikeButtonProps) {
  const { data: session } = useSession()
  const [liked, setLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialLikeCount)
  const [isPending, startTransition] = useTransition()

  const handleLike = async () => {
    if (!session?.user) {
      // Redirect to login or show login modal
      window.location.href = '/login'
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch(`/api/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const err=await response.json();
            toast.error(`${err.error}`)
          throw new Error('Failed to update like')
        }

        const data = await response.json()
        setLiked(data.liked)
        setLikeCount(data.likeCount)
      } catch (error) {
        console.error('Error updating like:', error)
        // Optionally show an error toast/notification
      }
    })
  }

  return (
    <button
      onClick={handleLike}
      disabled={isPending}
      className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
        liked
          ? 'text-red-600 bg-red-50 hover:bg-red-100 border border-red-200'
          : 'text-gray-700 bg-white hover:bg-gray-50 border border-gray-300'
      } ${isPending ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-sm'}`}
    >
      <svg
        className={`w-4 h-4 mr-2 transition-all duration-200 ${
          liked ? 'fill-red-500 text-red-500' : 'fill-none text-current'
        }`}
        stroke="currentColor"
        viewBox="0 0 24 24"
        strokeWidth={liked ? 0 : 2}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      {isPending ? 'Loading...' : liked ? 'Liked' : 'Like'}
      {likeCount > 0 && (
        <span className="ml-1 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
          {likeCount}
        </span>
      )}
    </button>
  )
}