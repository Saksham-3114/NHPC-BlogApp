/* eslint-disable @next/next/no-img-element */
'use client'

import React, { useState, useMemo, useEffect } from 'react';
import { Search, Calendar, User, ArrowRight, Hash, Heart, Tag } from 'lucide-react';

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

interface Post {
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

const BlogPage: React.FC<BlogPageProps> = ({ posts: initialPosts = [] }) => {
  const [posts] = useState(initialPosts);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

   useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const search = urlParams.get('search');
      if (search) {
        setSearchTerm(search);
      }
      const category = urlParams.get('category');
      if(category){
        setSelectedCategory(category);
      }
    }
  }, []);

  // Reset to page 1 when search term or category changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedCategory]);

  // Get unique categories from posts instead of tags
  const categories = useMemo(() => {
    const allCategories = posts
      .map(post => post.category?.name)
      .filter(Boolean) as string[];
    const uniqueCategories = [...new Set(allCategories)].sort();
    return ['All', ...uniqueCategories];
  }, [posts]);

  const filteredPosts = useMemo(() => { 
    return posts.filter(post => {
      // Filter by category
      const matchesCategory = selectedCategory === 'All' || 
                             post.category?.name === selectedCategory;
      
      // Filter by search term
      const matchesSearch = searchTerm === '' || 
                           post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.summary?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           post.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (post.tags && post.tags.some(tag => 
                             tag.toLowerCase().includes(searchTerm.toLowerCase())
                           )) ||
                           post.author?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchTerm]);

  const postsPerPage = 6;
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  const paginatedPosts = useMemo(() => {
    const start = (currentPage - 1) * postsPerPage;
    const end = start + postsPerPage;
    return filteredPosts.slice(start, end);
  }, [filteredPosts, currentPage]);

  const getCategoryCount = (category: string): number => {
    if (category === 'All') return posts.length;
    return posts.filter(post => post.category?.name === category).length;
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
    return likes.filter(like => like.liked === true).length;
  };

  return (
    <div className="min-h-screen bg-white mt-16">
      {/* Header */}
      <header className="border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-8">
            <div>
              <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">All Blogs</h1>
              <p className="mt-2 text-lg text-gray-600">
                Find and Search blogs here
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
                        ? 'bg-blue-100 text-blue-900 font-medium'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }`}
                  >
                    <span className="capitalize">
                      {category === 'All' ? 'All Posts' : category}
                    </span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      selectedCategory === category
                        ? 'bg-blue-200 text-blue-800'
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
                {paginatedPosts.map((post) => (
                  <article key={post.id} className="group border-b border-gray-500 pb-8 transition-all duration-300">
                    <div className="flex flex-col lg:flex-row gap-6">
                      {/* Image Section */}
                      {post.image && (
                        <div className="lg:w-80 lg:flex-shrink-0">
                          <div className="relative h-48 lg:h-40 w-full rounded-lg overflow-hidden bg-gray-100">
                            <img 
                              src={post.image} 
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              // onError={(e) => {
                              //   const target = e.target as HTMLImageElement;
                              //   target.style.display = 'none';
                              //   target.parentNode?.classList.add('bg-gray-200');
                              // }}
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

                        {/* Category */} 
                        {post.category && (
                          <div className="flex items-center space-x-2">
                            <Tag className="w-4 h-4 text-blue-500" />
                            <button
                              onClick={() => setSelectedCategory(post.category!.name)}
                              className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-full hover:bg-blue-100 transition-colors"
                            >
                              {post.category.name}
                            </button>
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
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                              post.published === 'true'
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {post.published === 'true' ? 'Published' : 'Draft'}
                            </span>
                          </div>

                          {/* Tags */}
                        {post.tags && post.tags.length > 0 && (
                          <div className="flex items-center space-x-2">
                            <Hash className="w-4 h-4 text-gray-400" />
                            <div className="flex flex-wrap gap-2">
                              {post.tags.map((tag, index) => (
                                <span
                                  key={index}
                                  className="text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded-md capitalize"
                                >
                                  {tag}
                                </span>
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
                ))}
                
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

export default BlogPage;