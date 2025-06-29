'use client'

import React, { useState, useMemo } from 'react';
import { Calendar, ArrowRight, Hash, Heart } from 'lucide-react';
import { Button } from './ui/button';
import { DeleteBlogAction, UnpublishBlogAction } from '@/app/actions/deleteBlog';
import { useRouter } from 'next/navigation';

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
  category?: Categories;
}

type PostwithLike=Post&{
  likeCount: number;
}

interface BlogPageProps {
  posts: PostwithLike[];
  deleteButton: boolean
}

const ProfileBlogList: React.FC<BlogPageProps> = ({ posts: initialPosts = [] , deleteButton}) => {
  const router=useRouter();
  const [posts, setPosts] = useState(initialPosts);
  const [deletingPosts, setDeletingPosts] = useState<Set<string>>(new Set());
  const [unpublishPosts, setUnpublishPosts] = useState<Set<string>>(new Set());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedtags, setSelectedtags] = useState('All');

  const filteredPosts = useMemo(() => {
    return posts.filter(() => {
      const matchestags = selectedtags === 'All' 
      return matchestags;
    });
  }, [posts, selectedtags]);


  //handling deletion of post
  const handleDeletePost = async (postId: string) => {
        const confirmed = window.confirm('Are you sure you want to delete this post? This action cannot be undone.');
    
    if (!confirmed) {
      return; 
    }
    try {
    
      setDeletingPosts(prev => new Set(prev).add(postId));
      
      const formData = new FormData();
      formData.append('postId', postId);
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await DeleteBlogAction(formData);
      
      setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
      
    } catch (error) {
      console.error('Failed to delete post:', error);
    } finally {
      setDeletingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  // handling unpublish of post
  const handleUnpublishPost = async (postId: string) => {
    const confirmed = window.confirm('Are you sure you want to unpublish this post? This post will be moved under review.');
    if (!confirmed) {
      return; 
    }
    try {
      setUnpublishPosts(prev => new Set(prev).add(postId));
      const formData = new FormData();
      formData.append('postId', postId);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await UnpublishBlogAction(formData);
      // const updPost = posts.filter((post)=>{
      //   if(post.id==postId) post.published='false' 
      // })
      // setPosts(updPost)
    } catch (error) {
      console.error('Failed to unpublish post:', error);
    } finally {
      setUnpublishPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const formatDate = (dateString: Date | string): string => {
    if (!dateString) return 'No date';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getReadTime = (content: string): string => {
    if (!content) return '1 min read';
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    const readTime = Math.ceil(wordCount / wordsPerMinute);
    return `${readTime} min read`;
  };

  return (
    <div className="min-h-fit bg-white mt-16 rounded-lg">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 max-w-5xl">
            {/* Posts List */}
            {(
              <div className="space-y-8">
                {filteredPosts.map((post) => {
                  const isDeleting = deletingPosts.has(post.id);
                  const isUnpublish = unpublishPosts.has(post.id);
                  return (
                    <article 
                      key={post.id} 
                      className={`group border-b border-gray-500 pb-5 transition-opacity ${
                        isDeleting ? 'opacity-50 pointer-events-none' : ''
                      } ${
                        isUnpublish ? 'opacity-50 pointer-events-none' : ''
                      }`}
                    >
                      <div className="flex flex-col space-y-3">
                        {/* Meta information */}
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4" />
                            <time dateTime={post.createdAt.toString()}>
                              {formatDate(post.createdAt)}
                            </time>
                          </div>
                          <span>{getReadTime(post.content)}</span>
                          
                          {/* Engagement metrics */}
                          <div className="flex items-center space-x-3">
                            {(
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span>{post.likeCount}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Title */}
                        <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          <a href={`/blog/${post.id}`} className="hover:underline">
                            {post.title}
                          </a>
                        </h2>

                        {/* Categories */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-wrap gap-1">
                              {post.tags.map((tags, index) => (
                                <button
                                  key={index}
                                  disabled
                                  className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors cursor-pointer capitalize"
                                >
                                  {tags}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Publication Status */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                              post.published === 'true'
                                ? 'bg-green-100 text-green-800' 
                                : post.published === 'false' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {post.published === 'true'
                                ? 'Published' 
                                : post.published === 'false' ? 'Under Review' : 'Rejected'
                            }
                            </span>
                          </div>
                          
                          {/* Read more link or Delete button */}
                          {deleteButton ? (
                            <div className='flex gap-4'>
                              {
                                post.published==='true' ? 
                                (
                                  <Button 
                              type="button"
                              onClick={() => handleUnpublishPost(post.id)}
                              disabled={isUnpublish}
                              className="px-4 py-2 rounded-md bg-gray-950 text-white hover:bg-gray-700 transition focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isUnpublish ? 'loading...' : 'Unpublish'}
                            </Button>
                                ) : <div></div>
                              }
                              <Button 
                              type="button"
                              onClick={() => {router.push(`/editpage/${post.id}`)}}
                              className="px-4 py-2 rounded-md bg-blue-500 text-white hover:bg-blue-400 transition focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {'Edit Post'}
                            </Button>
                              <Button 
                              type="button"
                              onClick={() => handleDeletePost(post.id)}
                              disabled={isDeleting}
                              className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-400 transition focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isDeleting ? 'Deleting...' : 'Delete Post'}
                            </Button>
                            </div>
                          ) : (
                            <a 
                              href={`/blog/${post.id}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors group-hover:underline"
                            >
                              Read more
                              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </a>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ProfileBlogList;