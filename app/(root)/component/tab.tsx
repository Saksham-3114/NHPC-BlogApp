"use client";

import ProfileBlogList from "@/components/ProfileBlogList";
import { Tabs } from "@/components/ui/tabs";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";


type Post={
    id: string;
    title: string;
    createdAt: string;
    published: "true" | "false" | "reject";
    content: string;
    authorId: string;
    Category: string[];
    likes: number;
}

type PostwithLike=Post&{
  likeCount: number;
}




export function TabsDemo() {
    const {data: session}=useSession();
    const username=session?.user?.name;

    const [loading, setLoading] = useState(true);
    const [posts,setPosts] = useState<PostwithLike[]>([]);
    useEffect(()=>{
        const fetchPosts=async ()=>{
            setLoading(true);
            const res=await fetch(`/api/posts/authored?username=${username}`);
            const data: Post[]= await res.json();
            // Fetch like counts for all posts
      const postsWithLikes = await Promise.all(
        data.map(async (post) => {
          const likeRes = await fetch(`/api/posts/likecount?postid=${post.id}`);
          const  likeCount  = await likeRes.json();

          return {
            ...post,
            likeCount,
          };
        })
      );

      setPosts(postsWithLikes);
            setLoading(false);
        };
        fetchPosts();
    },[username]);

    
    const [likeLoading, setlikeLoading] = useState(true);
    const [likedposts,setlikedPosts] = useState<PostwithLike[]>([]);
    useEffect(()=>{
        const fetchlikePosts=async ()=>{
            setlikeLoading(true);
            const res=await fetch(`/api/posts/liked?username=${username}`);
            const data: Post[]= await res.json();
            // Fetch like counts for all posts
      const postsWithLikes = await Promise.all(
        data.map(async (post) => {
          const likeRes = await fetch(`/api/posts/likecount?postid=${post.id}`);
          const  likeCount  = await likeRes.json();

          return {
            ...post,
            likeCount,
          };
        })
      );

      setlikedPosts(postsWithLikes);
            setlikeLoading(false);
        };
        fetchlikePosts();
    },[username]);
    
    console.log(posts);
   

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
          <ProfileBlogList posts={posts} deleteButton={true}/>
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
          <ProfileBlogList posts={likedposts} deleteButton={false}/>
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





