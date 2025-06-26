import { db } from '@/lib/db'
import { auth } from '@/auth'
import LikeButton from '@/app/(root)/component/likeButton'
import Link from 'next/link';
import { redirect } from 'next/navigation';
import Image from 'next/image';
import { Tag } from 'lucide-react';

export default async function Blog({ params }: { params: Promise<{ id: string }> }) {
  const blogid = (await params).id;
  const session = await auth() 
  if(!session?.user){
    redirect("/login")
  }
  
  const blog = await db.post.findUnique({
    where: {
      id: blogid
    },
    include: {
      author: true,
      likes: true,
      category:true,
      _count: {
        select: {
          likes: true
        }
      }
    }
  })

  if (!blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center ">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600">The blog post you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    )
  }

  const tags = blog.tags;
  const date = new Date(blog.createdAt);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const user = await db.user.findUnique({
    where:{name: session?.user?.name as string}
  })
  const userLiked = blog.likes.some(like => like.authorId === user?.id)

  const likeCount = blog._count.likes;

  return (
    <div className="min-h-screen bg-white my-10">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Header Section */}
        <header className="mb-12">
          <div className="text-sm text-gray-500 mb-4">
            Created on {formattedDate}
          </div>

          <div className="mx-auto py-10 flex items-center justify-end gap-6">
            <Image
              height={200}
              width={200}
              alt='Feature Image'
              src={blog.image}
            />
          
          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
            {blog.title}
          </h1>
          </div>

          <div className="flex items-center space-x-2 mb-6">
            <Tag className="w-4 h-4 text-blue-500" />
            <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors">
              {blog.category.name}
            </div>
          </div>

          {/* tags */}
          {tags && tags.length > 0 && (
            <div className="mb-8">
              <h2 className="text-sm font-semibold text-gray-700 mb-3 uppercase tracking-wide">
                tags
              </h2>
              <div className="flex flex-wrap gap-2">
                {tags.map((category, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100 transition-colors"
                  >
                    {category}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Author Info */}
          <div className="flex items-center space-x-4 pb-8 border-b border-gray-200">
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <Image
                src={blog.author.image}
                height={500}
                width={500}
                alt="Profile pic"
                className='rounded-full'
              />
            </div>
            <div>
              <div className="text-sm font-medium text-gray-900">
                {blog.author.name}
              </div>
              <div className="text-sm text-gray-500">
                <Link href={`/blog/user/${blog.author.name}`}>More by {blog.author.name} ↗</Link>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <article className="mb-16 text-wrap">
          <div
            className="prose prose-lg prose-gray max-w-none
              prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
              prose-h1:text-3xl prose-h1:mt-8 prose-h1:mb-4
              prose-h2:text-2xl prose-h2:mt-8 prose-h2:mb-4
              prose-h3:text-xl prose-h3:mt-6 prose-h3:mb-3
              prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-4
              prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline
              prose-strong:text-gray-900 prose-strong:font-semibold
              prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:font-mono
              prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-lg prose-pre:p-4
              prose-blockquote:border-l-4 prose-blockquote:border-blue-200 prose-blockquote:bg-blue-50 prose-blockquote:pl-6 prose-blockquote:py-2 prose-blockquote:italic prose-blockquote:text-gray-700
              prose-ul:text-gray-700 prose-ol:text-gray-700
              prose-li:text-gray-700 prose-li:mb-1
              prose-img:rounded-lg prose-img:shadow-lg prose-img:border prose-img:border-gray-200
              prose-hr:border-gray-200 prose-hr:my-8
              focus:outline-none break-words whitespace-normal"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </article>

        {/* Footer/Navigation */}
        <footer className="pt-8 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            
            <div className="flex items-center space-x-4 ">
              <LikeButton 
                postId={blog.id}
                
                initialLiked={userLiked}
                initialLikeCount={likeCount}
              />
            </div>
          </div>
        </footer>
      </div>
    </div>
  )
}