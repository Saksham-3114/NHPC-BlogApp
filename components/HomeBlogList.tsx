/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useMemo, useEffect, useCallback } from 'react';
import { Calendar, ArrowRight, Hash, Heart, Tag } from 'lucide-react';

type Categories={
  id: string;
  name: string;
}

type Post=({
    _count: {
        likes: number;
    };
} & {
    id: string;
    createdAt: Date;
    content: string;
    authorId: string;
    title: string;
    published: "true" | "false" | "reject";
    tags: string[];
    image: string;
    summary: string | null;
    category: Categories;
})

interface BlogPageProps {
  posts: Post[];
  onPostsChange?: (posts: Post[]) => void; // Callback for external updates
  refreshTrigger?: number; // External trigger for refresh
  fetchPosts?: () => Promise<Post[]>; // Function to fetch latest posts
  autoRefresh?: boolean; // Enable automatic refresh
  autoRefreshInterval?: number; // Auto refresh interval in milliseconds (default: 30000ms)
}

const HomeBlogList: React.FC<BlogPageProps> = ({ 
  posts: initialPosts = [],
  onPostsChange,
  refreshTrigger,
  fetchPosts,
  autoRefresh = false,
  autoRefreshInterval = 30000
}) => {
  const [posts, setPosts] = useState(initialPosts);
  const [isRefreshing, setIsRefreshing] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [selectedCategory, setSelectedCategory] = useState('All');

  // Update local state when initialPosts change
  useEffect(() => {
    setPosts(initialPosts);
  }, [initialPosts]); 

  // Handle external refresh triggers
  useEffect(() => {
    if (refreshTrigger && fetchPosts) {
      refreshPosts();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshTrigger]);

  // Auto refresh functionality
  useEffect(() => {
    if (!autoRefresh || !fetchPosts) return;

    const interval = setInterval(() => {
      refreshPosts();
    }, autoRefreshInterval);

    return () => clearInterval(interval);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoRefresh, autoRefreshInterval, fetchPosts]);

  // Function to refresh posts from server
  const refreshPosts = useCallback(async () => {
    if (!fetchPosts) return;
    
    try {
      setIsRefreshing(true);
      const latestPosts = await fetchPosts();
      setPosts(latestPosts);
      onPostsChange?.(latestPosts);
    } catch (error) {
      console.error('Failed to refresh posts:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [fetchPosts, onPostsChange]);

  // Function to add a new post
  const addPost = useCallback((newPost: Post) => {
    setPosts(prevPosts => {
      // Check if post already exists to avoid duplicates
      const postExists = prevPosts.some(post => post.id === newPost.id);
      if (postExists) return prevPosts;
      
      const updatedPosts = [newPost, ...prevPosts];
      onPostsChange?.(updatedPosts);
      return updatedPosts;
    });
  }, [onPostsChange]);

  // Function to update an existing post
  const updatePost = useCallback((updatedPost: Post) => {
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => 
        post.id === updatedPost.id ? updatedPost : post
      );
      onPostsChange?.(updatedPosts);
      return updatedPosts;
    });
  }, [onPostsChange]);

  // Function to remove a post
  const removePost = useCallback((postId: string) => {
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.filter(post => post.id !== postId);
      onPostsChange?.(updatedPosts);
      return updatedPosts;
    });
  }, [onPostsChange]);

  // Function to update like count
  const updateLikeCount = useCallback((postId: string, newLikeCount: number) => {
    setPosts(prevPosts => {
      const updatedPosts = prevPosts.map(post => 
        post.id === postId 
          ? { ...post, _count: { ...post._count, likes: newLikeCount } }
          : post
      );
      onPostsChange?.(updatedPosts);
      return updatedPosts;
    });
  }, [onPostsChange]);

  // Expose functions for external use via global window object
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).homeBlogListActions = {
        addPost,
        updatePost,
        removePost,
        updateLikeCount,
        refreshPosts
      };
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        delete (window as any).homeBlogListActions;
      }
    };
  }, [addPost, updatePost, removePost, updateLikeCount, refreshPosts]);

  const filteredPosts = useMemo(() => {
    return posts.filter(() => {
      const matchesCategory = selectedCategory === 'All' 
      return matchesCategory;
    });
  }, [posts, selectedCategory]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    return filteredPosts.slice(start, end);
  }, [filteredPosts, currentPage]);

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
    <div className="min-h-fit bg-white mt-16 rounded-lg min-w-full">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <main className="flex-1 max-w-7xl">
            {/* Refresh indicator */}
            {isRefreshing && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-md">
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  <p className="text-blue-800 text-sm">Loading latest posts...</p>
                </div>
              </div>
            )}

            {/* Posts List */}
            <div className="space-y-8">
              {filteredPosts.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">
                    {isRefreshing ? 'Loading posts...' : 'No posts available.'}
                  </p>
                </div>
              ) : (
                paginatedPosts.map((post) => {
                  return (
                    <article 
                      key={post.id} 
                      className="group border-b border-gray-500 pb-8 transition-all duration-300 animate-in fade-in"
                    >
                      <div className="flex flex-col lg:flex-row gap-6">
                        {/* Image Section */}
                        {post.image && (
                          <div className="lg:w-80 lg:flex-shrink-0">
                            <div className="relative h-48 lg:h-40 w-full rounded-lg overflow-hidden bg-gray-100">
                              <img 
                                src={post.image} 
                                alt={post.title}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                onError={(e) => {
                                  const target = e.target as HTMLImageElement;
                                  target.style.display = 'none';
                                  (target.parentNode as HTMLElement | null)?.classList.add('bg-gray-200');
                                }}
                              />
                            </div>
                          </div>
                        )}

                        {/* Content Section */}
                        <div className="flex-1 space-y-4">
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
                              <div className="flex items-center space-x-1">
                                <Heart className="w-4 h-4" />
                                <span className="transition-all duration-300">
                                  {post._count.likes}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Category */}
                          {post.category && (
                            <div className="flex items-center space-x-2">
                              <Tag className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full">
                                {post.category.name}
                              </span>
                            </div>
                          )}

                          {/* Title */}
                          <h2 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                            <a href={`/blog/${post.id}`} className="hover:underline">
                              {post.title}
                            </a>
                          </h2>

                          {/* Summary */}
                          {post.summary && (
                            <p className="text-gray-600 text-base leading-relaxed line-clamp-3">
                              {post.summary}
                            </p>
                          )}
                          </div>
                          </div>

                          {/* Publication Status and Read More */}
                          <div className="flex items-center justify-between pt-2 my-2">
                            <div className="flex items-center space-x-2">
                              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                                post.published === 'true'
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {post.published === 'true' ? 'Published' : 'Under Review'}
                              </span>
                            </div>
                              
                              {/* Tags */}
                          {post.tags && post.tags.length > 0 && (
                            <div className="flex items-center space-x-2">
                              <Hash className="w-4 h-4 text-gray-400" />
                              <div className="flex flex-wrap gap-2">
                                {post.tags.map((tag, index) => (
                                  <button
                                    key={index}
                                    disabled
                                    className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md hover:bg-gray-200 transition-colors cursor-pointer capitalize"
                                  >
                                    {tag}
                                  </button>
                                ))}
                              </div>
                            </div>
                          )}

                            {/* Read more link */}
                            <a 
                              href={`/blog/${post.id}`}
                              className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors group-hover:underline"
                            >
                              Read more
                              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                            </a>
                          </div>
                        
                      
                    </article>
                  );
                })
              )}
              
              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-10 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-4 py-2 rounded-md text-sm font-medium border transition-colors ${
                        page === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomeBlogList;