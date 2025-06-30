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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Blog Not Found</h1>
          <p className="text-gray-600 mb-8">The blog post you&apos;re looking for doesn&apos;t exist.</p>
          <Link 
            href="/blog" 
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Blogs
          </Link>
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
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-white mt-8">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-12">
          {/* Breadcrumb/Date */}
          <div className="mb-6">
            <div className="text-sm text-gray-500 mb-2">
              Created on {formattedDate}
            </div>
          </div>

          <span className='flex justify-between'>
            {/* Category Badge */}
          <div className="mb-6">
            <div className="inline-flex items-center space-x-2 text-sm font-medium text-blue-700 bg-blue-100 px-4 py-2 rounded-full">
              <Tag className="w-4 h-4" />
              <span>{blog.category.name}</span>
            </div>
          </div>

          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="mb-8 flex gap-2">
              <p className='font-medium'> TAGS : </p>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors cursor-default"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          </span>

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            {blog.title}
          </h1>

          

          {/* Author Info */}
          <div className="flex items-center space-x-4 mb-8">
            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-200">
              <Image
                src={blog.author.image}
                height={48}
                width={48}
                alt={`${blog.author.name}'s profile picture`}
                className="object-cover w-full h-full"
              />
            </div>
            <div className="flex-1">
              <div className="text-base font-semibold text-gray-900">
                {blog.author.name}
              </div>
              <div className="text-sm text-gray-500">
                <Link 
                  href={`/blog/user/${blog.author.name}`}
                  className="hover:text-blue-600 transition-colors"
                >
                  View all posts by {blog.author.name} →
                </Link>
              </div>
            </div>
          </div>

          {/* Featured Image */}
          <div className="relative w-full h-64 md:h-80 lg:h-96 rounded-2xl overflow-hidden shadow-lg mb-6">
            <Image
              height={600}
              width={1200}
              alt="Featured image for blog post"
              src={blog.image}
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-12">
          {/* Main Content */}
          <article className="mb-16">
            <div
              className="prose prose-lg prose-gray max-w-none
                prose-headings:text-gray-900 prose-headings:font-bold prose-headings:tracking-tight
                prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
                prose-h2:text-3xl prose-h2:mt-10 prose-h2:mb-5
                prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
                prose-h4:text-xl prose-h4:mt-6 prose-h4:mb-3
                prose-p:text-gray-700 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
                prose-a:text-blue-600 prose-a:no-underline hover:prose-a:text-blue-800 hover:prose-a:underline prose-a:font-medium
                prose-strong:text-gray-900 prose-strong:font-semibold
                prose-em:text-gray-700 prose-em:italic
                prose-code:bg-gray-100 prose-code:text-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-base prose-code:font-mono
                prose-pre:bg-gray-50 prose-pre:border prose-pre:border-gray-200 prose-pre:rounded-xl prose-pre:p-6 prose-pre:my-8
                prose-blockquote:border-l-4 prose-blockquote:border-blue-300 prose-blockquote:bg-blue-50 prose-blockquote:pl-8 prose-blockquote:py-4 prose-blockquote:my-8 prose-blockquote:italic prose-blockquote:text-gray-700 prose-blockquote:rounded-r-lg
                prose-ul:text-gray-700 prose-ul:my-6 prose-ol:text-gray-700 prose-ol:my-6
                prose-li:text-gray-700 prose-li:mb-2 prose-li:text-lg
                prose-img:rounded-xl prose-img:shadow-lg prose-img:border prose-img:border-gray-200 prose-img:my-8
                prose-hr:border-gray-200 prose-hr:my-12
                prose-table:border-collapse prose-table:border prose-table:border-gray-200 prose-table:rounded-lg prose-table:overflow-hidden
                prose-th:bg-gray-50 prose-th:border prose-th:border-gray-200 prose-th:px-4 prose-th:py-3 prose-th:text-left prose-th:font-semibold prose-th:text-gray-900
                prose-td:border prose-td:border-gray-200 prose-td:px-4 prose-td:py-3 prose-td:text-gray-700
                focus:outline-none break-words whitespace-normal"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />
          </article>

          {/* Divider */}
          <div className="border-t border-gray-200 my-12"></div>

          {/* Footer/Actions */}
          <footer className=" rounded-2xl p-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-6 sm:space-y-0">
              
              {/* Like Button */}
              <div className="flex items-center space-x-4">
                <LikeButton 
                  postId={blog.id}
                  initialLiked={userLiked}
                  initialLikeCount={likeCount}
                />
              </div>

              {/* Author Card */}
              <div className="flex items-center space-x-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={blog.author.image}
                    height={40}
                    width={40}
                    alt={`${blog.author.name}'s profile picture`}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">
                    {blog.author.name}
                  </div>
                  <div className="text-xs text-gray-500">
                    Author
                  </div>
                </div>
              </div>
            </div>
          </footer>

          {/* Navigation */}
          <div className="mt-12 text-center">
            <Link 
              href="/blog"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
            >
              ← Back to All Posts
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}