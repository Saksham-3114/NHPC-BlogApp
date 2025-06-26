/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import React, { useState } from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { Search } from 'lucide-react';
import { redirect } from "next/navigation";



type Categories={
  id: string;
  name: string;
  createdAt: Date;
}[]


export function BackgroundBeamsWithCollisionDemo({categories}:{categories: Categories}) {
    const [searchTerm, setSearchTerm] = useState('');
     const handleSearch = (e: any) => {
    e.preventDefault();
    
    // Don't navigate if search term is empty
    if (!searchTerm.trim()) {
      return;
    }
    if (typeof window !== 'undefined') {
      // Navigate to /blog page with search query parameter
      const searchQuery = encodeURIComponent(searchTerm.trim());
      window.location.href = `/blog?search=${searchQuery}`;
    }
  };

  const handleCategoryClick = (category: any) => {
     if (typeof window !== 'undefined') {
      // Navigate to blog with category filter
      const categoryQuery = encodeURIComponent(category);
      window.location.href = `/blog?category=${categoryQuery}`;
    }
  };
  return (
    <BackgroundBeamsWithCollision>
       <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-16">
        {/* Main Heading */}
        <h2 className="text-3xl relative z-20 md:text-5xl lg:text-7xl font-bold text-center text-black dark:text-white font-sans tracking-tight mb-8">
          <div className="relative mx-auto inline-block w-max [filter:drop-shadow(0px_2px_4px_rgba(0,_100,_150,_0.15))]">
            {/* Shadow text for depth effect */}
            <div className="absolute left-0 top-[2px] bg-clip-text bg-no-repeat text-transparent bg-gradient-to-r py-4 from-blue-900 via-blue-800 to-blue-700 [text-shadow:0_0_rgba(0,0,0,0.1)]">
              <span>NHPC Ltd. Blog</span>
            </div>
            {/* Main gradient text */}
            <div className="relative bg-clip-text text-transparent bg-no-repeat bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 py-4">
              <span>NHPC Ltd. Blog</span>
            </div>
          </div>
        </h2>

        {/* Subtitle */}
        <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed text-center">
          Welcome to the official blog of NHPC Ltd., where we share stories of innovation, sustainability, and national development.
        </p>

        {/* Search Bar */}
        <div className="max-w-md mx-auto w-full mb-8">
          <div className="relative group">
            <div className="absolute inset-0 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 z-10" />
              <input
                type="text"
                placeholder="Search articles, topics, or keywords..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch(e)}
                className="w-full pl-12 pr-28 py-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 shadow-lg"
              />
              <button
                onClick={handleSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 hover:blue-600 text-white px-6 py-2 rounded-xl transition-all duration-300 font-medium shadow-lg hover:shadow-xl cursor-pointer"
              >
                Search
              </button>
            </div>
          </div>
        </div>

        {/* Quick Category Filters */}
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto">
          {categories.map((category) => (
            <button
            onClick={() => handleCategoryClick(category.name)}
              key={category.id}
              className="px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              {category.name}
            </button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-3 max-w-4xl mx-auto my-2">
            <button
            onClick={() => redirect('/blog')}
              className="px-4 py-2 bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-green-500 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
            >
              More...
            </button>
        </div>
      </div>
    </BackgroundBeamsWithCollision>
  );
}
