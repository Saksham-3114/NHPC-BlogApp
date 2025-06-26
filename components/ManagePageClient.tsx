'use client';

import React from 'react';
import { MessageSquare, Folder, ArrowRight } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ManagePageClient() {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const managementCards = [
    {
      id: 'review',
      title: 'Post Management',
      description: 'Publish or Reject under review blogs',
      icon: MessageSquare,
      path: '/manage/review',
      color: 'from-blue-500 to-blue-600',
      hoverColor: 'from-blue-600 to-blue-700',
      bgGradient: 'from-blue-50 to-blue-100',
      darkBgGradient: 'from-blue-900/20 to-blue-800/20',
    },
    {
      id: 'categories',
      title: 'Category Management',
      description: 'Create and edit content categories',
      icon: Folder,
      path: '/manage/categories',
      color: 'from-green-500 to-green-600',
      hoverColor: 'from-green-600 to-green-700',
      bgGradient: 'from-green-50 to-green-100',
      darkBgGradient: 'from-green-900/20 to-green-800/20',
    }
  ];

  return (
    <div className="min-h-screen my-20">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {managementCards.map((card) => {
            const IconComponent = card.icon;
            
            return (
              <div
                key={card.id}
                onClick={() => handleNavigation(card.path)}
                className="group relative cursor-pointer transform transition-all duration-300 hover:scale-105"
              >
                {/* Card Background with Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl blur-xl -z-10"
                     style={{ background: `linear-gradient(135deg, ${card.color.split(' ')[1]}, ${card.color.split(' ')[3]})` }}>
                </div>
                
                {/* Main Card */}
                <div className={`relative bg-white dark:bg-slate-800 rounded-3xl shadow-xl border border-slate-200 dark:border-slate-700 overflow-hidden group-hover:shadow-2xl transition-all duration-300`}>
                  {/* Gradient Background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.bgGradient} dark:${card.darkBgGradient} opacity-50`}></div>
                  
                  {/* Content */}
                  <div className="relative p-8">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className={`p-4 bg-gradient-to-r ${card.color} rounded-2xl shadow-lg group-hover:${card.hoverColor} transition-all duration-300`}>
                        <IconComponent className="w-8 h-8 text-white" />
                      </div>
                    </div>

                    {/* Title and Description */}
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-green-600 transition-all duration-300">
                      {card.title}
                    </h3>
                    <p className="text-slate-600 dark:text-slate-300 mb-6 leading-relaxed">
                      {card.description}
                    </p>

                    {/* Action Button */}
                    <div className="flex items-center justify-between">
                      <ArrowRight className="w-6 h-6 text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-300 group-hover:translate-x-2 transition-all duration-300" />
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/20 to-transparent rounded-full -mr-16 -mt-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-white/10 to-transparent rounded-full -ml-12 -mb-12"></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}