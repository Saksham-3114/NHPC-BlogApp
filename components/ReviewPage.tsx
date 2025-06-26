'use client'

import React, { useState, useMemo,} from 'react';
import { Search, Calendar, User, Hash, Heart, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from './ui/button';
import { ReviewBlog } from '@/app/actions/reviewActions';

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

interface BlogPageProps {
  posts: Post[];
}

interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

const ReviewPage: React.FC<BlogPageProps> = ({ posts: initialPosts = [] }) => {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedtags, setSelectedtags] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [isLoading, setIsLoading] = useState<string | null>(null);

  const categories = useMemo(() => {
    const allCategories = posts.flatMap(post => post.tags || []);
    const uniqueCategories = [...new Set(allCategories)].filter(Boolean);
    return ['All', ...uniqueCategories.sort()];
  }, [posts]);

  const filteredPosts = useMemo(() => { 
    return posts.filter(post => {
      const matchestags = selectedtags === 'All' || 
                             (post.tags && post.tags.includes(selectedtags));
      
      const matchesSearch = searchTerm === '' || 
                           post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (post.tags && post.tags.some(cat => 
                             cat.toLowerCase().includes(searchTerm.toLowerCase())
                           )) ||
                           post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchestags && matchesSearch;
    });
  }, [posts, selectedtags, searchTerm]);

  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    return filteredPosts.slice(start, end);
  }, [filteredPosts, currentPage]);

  // Toast functions
  const addToast = (message: string, type: 'success' | 'error' | 'info') => {
    const id = Date.now().toString();
    const newToast = { id, message, type };
    setToasts(prev => [...prev, newToast]);
    
    // Auto remove toast after 5 seconds
    setTimeout(() => {
      removeToast(id);
    }, 5000);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  // Handle post review action
  const handleReviewAction = async (postId: string, action: 'publish' | 'reject') => {
    setIsLoading(postId);
    
    try {
      const formData = new FormData();
      formData.append('action', JSON.stringify({ postId, act: action }));
      
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const result = await ReviewBlog(formData);
      
      // Update the post in the local state
      setPosts(prevPosts => 
        prevPosts.filter(post => 
          post.id !== postId 
        )
      );
      
      // Show success toast
      const actionText = action === 'publish' ? 'published' : 'rejected';
      const postTitle = posts.find(p => p.id === postId)?.title || 'Post';
      addToast(`"${postTitle}" has been ${actionText} successfully!`, 'success');
      
    } catch (error) {
      console.error('Error updating post:', error);
      addToast('Failed to update post. Please try again.', 'error');
    } finally {
      setIsLoading(null);
    }
  };

  const gettagsCount = (tags: string): number => {
    if (tags === 'All') return posts.length;
    return posts.filter(post => post.tags && post.tags.includes(tags)).length;
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

  const getLikeCount = (likes?: Like[]): number => {
    if (!likes || !Array.isArray(likes)) return 0;
    return likes.filter(like => like.liked === false).length;
  };

  // Toast Component
  const ToastContainer = () => (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-center p-4 rounded-lg shadow-lg max-w-sm transition-all duration-300 ${
            toast.type === 'success' 
              ? 'bg-green-50 border border-green-200 text-green-800' 
              : toast.type === 'error'
              ? 'bg-red-50 border border-red-200 text-red-800'
              : 'bg-blue-50 border border-blue-200 text-blue-800'
          }`}
        >
          <div className="flex-shrink-0 mr-3">
            {toast.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-500" />
            ) : toast.type === 'error' ? (
              <AlertCircle className="w-5 h-5 text-red-500" />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-500" />
            )}
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className="flex-shrink-0 ml-3 hover:opacity-70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white mt-16">
      {/* Toast Container */}
      <ToastContainer />
      
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Review Blogs</h1>
              <p className="mt-2 text-lg text-gray-600">
                Publish or Reject Blogs
              </p>
            </div>
            <div className="mt-6 sm:mt-0">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search Blogs"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 w-full sm:w-64 text-sm"
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar - Categories */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-8">
              <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                Categories
              </h2>
              <nav className="space-y-1">
                {categories.map((tags) => (
                  <button
                    key={tags}
                    onClick={() => setSelectedtags(tags)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
                      selectedtags === tags
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="capitalize">
                      {tags === 'All' ? 'All Posts' : tags}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedtags === tags
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    }`}>
                      {gettagsCount(tags)}
                    </span>
                  </button>
                ))}
              </nav>
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1 max-w-7xl">
            {/* Results Info */}
            <div className="mb-8">
              {searchTerm && (
                <p className="text-sm text-gray-600 mb-2">
                  Search results for {searchTerm}
                </p>
              )}
              <p className="text-sm text-gray-500">
                {filteredPosts.length} {filteredPosts.length === 1 ? 'post' : 'posts'} found
                {selectedtags !== 'All' && (
                  <span> in {selectedtags}</span>
                )}
              </p>
            </div>

            {/* Posts List */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-8">
                {paginatedPosts.map((post) => (
                  <article key={post.id} className="group border-b border-gray-500 pb-5">
                    <div className="flex flex-col space-y-3">
                      {/* Meta information */}
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <time dateTime={post.createdAt.toString()}>
                            {formatDate(post.createdAt)}
                          </time>
                        </div>
                        {post.author && (
                          <div className="flex items-center space-x-1">
                            <User className="w-4 h-4" />
                            <span>{post.author.name}</span>
                          </div>
                        )}
                        <span>{getReadTime(post.content)}</span>
                        
                        {/* Engagement metrics */}
                        <div className="flex items-center space-x-3">
                          {post.likes && (
                            <div className="flex items-center space-x-1">
                              <Heart className="w-4 h-4" />
                              <span>{getLikeCount(post.likes)}</span>
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
                                onClick={() => setSelectedtags(tags)}
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
                        
                        {/* Action buttons */}
                        <div className='flex gap-4 mx-6'>
                          <Button 
                            onClick={() => handleReviewAction(post.id, 'publish')}
                            disabled={isLoading === post.id || post.published === 'true'}
                            className='bg-green-300 text-green-700 hover:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            {isLoading === post.id ? 'Processing...' : 'Publish'}
                          </Button>
                          <Button 
                            onClick={() => handleReviewAction(post.id, 'reject')}
                            disabled={isLoading === post.id || post.published === 'reject'}
                            className='bg-red-300 text-red-700 hover:bg-red-400 disabled:opacity-50 disabled:cursor-not-allowed'
                          >
                            {isLoading === post.id ? 'Processing...' : 'Reject'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
                
                {/* Pagination */}
                <div className="flex justify-center mt-10 space-x-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 rounded-md text-sm font-medium border ${
                        page === currentPage
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found to review</h3>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default ReviewPage;