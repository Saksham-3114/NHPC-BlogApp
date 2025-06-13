'use client'

import React, { useState, useMemo } from 'react';
import { Search, Calendar, User, ArrowRight, Hash, Heart } from 'lucide-react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date | string;
  bio: string | null;
}

interface Like {
  id: string;
  liked: boolean;
  postId: string;
  authorId: string;
  createdAt: Date | string;
  author?: User;
}


interface Post {
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

interface BlogPageProps {
  posts: Post[];
}

const UserBlogList: React.FC<BlogPageProps> = ({ posts: initialPosts = [] }) => {
  const [posts] = useState(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

 
  const categories = useMemo(() => {
    const allCategories = posts.flatMap(post => post.Category || []);
    const uniqueCategories = [...new Set(allCategories)].filter(Boolean);
    return ['All', ...uniqueCategories.sort()];
  }, [posts]);

  const filteredPosts = useMemo(() => { 
    return posts.filter(post => {
      const matchesCategory = selectedCategory === 'All' || 
                             (post.Category && post.Category.includes(selectedCategory));
      
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
                           post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (post.Category && post.Category.some(cat => 
                             cat.toLowerCase().includes(searchTerm.toLowerCase())
                           )) ||
                           post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchTerm]);

  const getCategoryCount = (category: string): number => {
    if (category === 'All') return posts.length;
    return posts.filter(post => post.Category && post.Category.includes(category)).length;
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
    return likes.filter(like => like.liked===false).length;
  };


  return (
    <div className="min-h-screen bg-white mt-16">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Blogs by {posts[0].author?.name}</h1>
              <p className="mt-2 text-lg text-gray-600">
                About Author: {posts[0].author?.bio}
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
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors flex items-center justify-between group ${
                      selectedCategory === category
                        ? 'bg-gray-100 text-gray-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="capitalize">
                      {category === 'All' ? 'All Posts' : category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category
                        ? 'bg-gray-200 text-gray-700'
                        : 'bg-gray-100 text-gray-500 group-hover:bg-gray-200'
                    }`}>
                      {getCategoryCount(category)}
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
                {selectedCategory !== 'All' && (
                  <span> in {selectedCategory}</span>
                )}
              </p>
            </div>

            {/* Posts List */}
            {filteredPosts.length > 0 ? (
              <div className="space-y-8">
                {filteredPosts.map((post) => (
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

                      {/* Content Preview */}
                      

                      {/* Categories */}
                      {post.Category && post.Category.length > 0 && (
                        <div className="flex items-center space-x-2">
                          <Hash className="w-4 h-4 text-gray-400" />
                          <div className="flex flex-wrap gap-1">
                            {post.Category.map((category, index) => (
                              <button
                                key={index}
                                onClick={() => setSelectedCategory(category)}
                                className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded hover:bg-gray-200 transition-colors cursor-pointer capitalize"
                              >
                                {category}
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
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.published ? 'Published' : 'Draft'}
                          </span>
                        </div>
                        
                        {/* Read more link */}
                        <a 
                          href={`/blog/${post.id}`}
                          className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors group-hover:underline"
                        >
                          Read more
                          <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="text-gray-400 mb-4">
                  <Search className="w-16 h-16 mx-auto" />
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">No posts found</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  {searchTerm ? (
                    <>
                      No posts match your search for {searchTerm}. 
                      Try different keywords or browse all posts.
                    </>
                  ) : (
                    <>
                      No posts are available in this category yet. 
                      Check back later for new content.
                    </>
                  )}
                </p>
                {(searchTerm || selectedCategory !== 'All') && (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSelectedCategory('All');
                    }}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                  >
                    View all posts
                  </button>
                )}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default UserBlogList;