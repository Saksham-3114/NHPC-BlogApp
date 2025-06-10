"use client";

import { Tabs } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useState } from "react";



// const articles = [
//   {
//     id: 1,
//     title: "Lessons from a Year of Writing Every Day",
//     date: "2024-12-30",
//     excerpt: "My journey and biggest takeaways from a daily writing challenge.",
//     claps: 436,
//     image:
//       "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=600&q=80",
//   },
//   {
//     id: 2,
//     title: "Why We Travel: The Science of Wanderlust",
//     date: "2025-01-15",
//     excerpt:
//       "Exploring what motivates our urge to see new places and cultures.",
//     claps: 287,
//     image:
//       "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
//   },
//   {
//     id: 3,
//     title: "Minimalism Isn’t About Less, It’s About Focus",
//     date: "2025-02-03",
//     excerpt: "How adopting a minimalist mindset changed my creative process.",
//     claps: 329,
//     image:
//       "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
//   },
//   {
//     id: 4,
//     title: "Minimalism Isn’t About Less, It’s About Focus",
//     date: "2025-02-03",
//     excerpt: "How adopting a minimalist mindset changed my creative process.",
//     claps: 329,
//     image:
//       "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
//   },
//   {
//     id: 5,
//     title: "Minimalism Isn’t About Less, It’s About Focus",
//     date: "2025-02-03",
//     excerpt: "How adopting a minimalist mindset changed my creative process.",
//     claps: 329,
//     image:
//       "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
//   },
//   {
//     id: 6,
//     title: "Minimalism Isn’t About Less, It’s About Focus",
//     date: "2025-02-03",
//     excerpt: "How adopting a minimalist mindset changed my creative process.",
//     claps: 329,
//     image:
//       "https://images.unsplash.com/photo-1465101046530-73398c7f28ca?auto=format&fit=crop&w=600&q=80",
//   },
// ];

type Post={
    id: string;
    title: string;
    createdAt: string;
    published: boolean;
    content: string;
    authorId: string;
    Category: string[];
}


export function TabsDemo() {
    const {data: session}=useSession();
    const username=session?.user?.name;

    const [loading, setLoading] = useState(true);
    const [posts,setPosts] = useState<Post[]>([]);
    useEffect(()=>{
        const fetchPosts=async ()=>{
            setLoading(true);
            const res=await fetch(`/api/posts/authored?username=${username}`);
            const data= await res.json();
            setPosts(data);
            setLoading(false);
        };
        fetchPosts();
    },[username]);

    
    const [likeLoading, setlikeLoading] = useState(true);
    const [likedposts,setlikedPosts] = useState<Post[]>([]);
    useEffect(()=>{
        const fetchlikePosts=async ()=>{
            setlikeLoading(true);
            const res=await fetch(`/api/posts/liked?username=${username}`);
            const data= await res.json();
            setlikedPosts(data);
            setlikeLoading(false);
        };
        fetchlikePosts();
    },[username]);
    
    if(loading) { return <div className="flex items-center justify-center h-full">Loading...</div>; }

    if(likeLoading) { return <div className="flex items-center justify-center h-full">Loading...</div>; }

  const tabs = [
    {
      title: "Authored",
      value: "authored",
      content: (
        <div className="w-full overflow-scroll relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-black bg-gradient-to-br bg-slate-100">
          <p>Authored Posts</p>
          <div className="space-y-4 my-10 ">
          {posts.map((it) => (
            <div key={it.id} className="flex gap-4 p-4 rounded-lg border hover:shadow-sm transition bg-white">
              <div className=" md:block w-32 h-20 relative rounded-md overflow-hidden border">
                <Image src="/nhpclogo.png" alt="" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-base mb-1 hover:underline cursor-pointer">
                  {it.title}
                </h3>
                <div className="text-xs text-gray-500 mb-1 flex gap-2 items-center">
                  <span>{(it.createdAt).slice(0,10)}</span>
                  <span>•</span>
                  {/* <span>{it.claps} claps</span> */}
                </div>
                <p className="text-gray-700 text-sm line-clamp-2">Categories: {it.Category}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      ),
    },
    {
      title: "Liked",
      value: "liked",
      content: (
        <div className="w-full overflow-scroll relative h-full rounded-2xl p-10 text-xl md:text-4xl font-bold text-black bg-gradient-to-br bg-slate-100">
          <p>Liked Posts</p>
          <div className="space-y-4 my-10 ">
          {likedposts.map((article) => (
            <div key={article.id} className="flex gap-4 p-4 rounded-lg border hover:shadow-sm transition bg-white">
              <div className="hidden md:block w-32 h-20 relative rounded-md overflow-hidden border">
                <Image src="/nhpclogo.png" alt="" fill className="object-cover" />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-base mb-1 hover:underline cursor-pointer">
                  {article.title}
                </h3>
                <div className="text-xs text-gray-500 mb-1 flex gap-2 items-center">
                  <span>{(article.createdAt).slice(0,10)}</span>
                  <span>•</span>
                  {/* <span>{article.claps} claps</span> */}
                </div>
                <p className="text-gray-700 text-sm line-clamp-2">Categories: {article.Category}</p>
              </div>
            </div>
          ))}
        </div>
        </div>
      ),
    },
  ];

  return (
    <div className="h-[20rem] md:h-[40rem] [perspective:1000px] relative b flex flex-col max-w-5xl mx-auto w-full  items-start justify-start mb-40 mt-10">
      <Tabs tabs={tabs} />
    </div>
  );
}





