// import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { BentoGrid, BentoGridItem } from "@/components/ui/bento-grid";
import Image from "next/image";
import { useSession } from "next-auth/react";

type Post={
    id: string;
    title: string;
    createdAt: string;
    published: boolean;
    content: string;
    authorId: string;
    Category: string[];
    likes: number;
}

type PostwithLike=Post&{
  likeCount: number;
}

const Skeleton = () => (
  <Image src="/nhpclogo.png" alt="" height={200} width={200} className=" mx -auto flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 to-neutral-100"/>
);

export function BentoGridDemo() {
  const {data: session}=useSession();
    const username=session?.user?.name;

    const [loading, setLoading] = useState(true);
    const [posts,setPosts] = useState<PostwithLike[]>([]);
    useEffect(()=>{
        const fetchPosts=async ()=>{
            setLoading(true);
            const res=await fetch(`/api/posts/all`);
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

    if(loading) { return <div className="flex items-center justify-center h-full">Loading...</div>; }

  return (
    <BentoGrid className="max-w-fit mx-5">
      {posts.map((item, i) => (
          <BentoGridItem
          key={i}
          id={item.id}
          title={item.title}
          description={item.Category.join(", ")}
          likes={item.likeCount}
          header={<Skeleton/>}
          className={i === 4 || i === 5 ? "md:col-span-2" : i=== 3 ? "md:row-span-2" : ""}
        />
      ))}
    </BentoGrid>
  );
}
// const items = [
//   {
//     title: "The Dawn of Innovation",
//     description: "Explore the birth of groundbreaking ideas and inventions.",
//     likes: 120,
//     header: <Skeleton />,
//   },
//   {
//     title: "The Digital Revolution",
//     description: "Dive into the transformative power of technology.",
//     likes: 120,
//     header: <Skeleton />,
//   },
//   {
//     title: "The Art of Design",
//     description: "Discover the beauty of thoughtful and functional design.",
//     likes: 120,
//     header: <Skeleton />,
//   },
//   {
//     title: "The Power of Communication",
//     description:
//     "Understand the impact of effective communication in our lives.",
//     likes: 120,
//     header: <Skeleton />,
//   },
//   {
//     title: "The Pursuit of Knowledge",
//     description: "Join the quest for understanding and enlightenment.",
//     likes: 120,
//     header: <Skeleton />,
//   },
//   {
//     title: "The Pursuit of Knowledge",
//     description: "Join the quest for understanding and enlightenment.",
//     likes: 120,
//     header: <Skeleton />,
//   },
//   {
//     title: "The Pursuit of Knowledge",
//     description: "Join the quest for understanding and enlightenment.",
//     likes: 120,
//     header: <Skeleton />,
//   },
//   {
//     title: "The Pursuit of Knowledge",
//     description: "Join the quest for understanding and enlightenment.",
//     likes: 120,
//     header: <Skeleton />,
//   },
//   {
//     title: "The Pursuit of Knowledge",
//     description: "Join the quest for understanding and enlightenment.",
//     likes: 120,
//     header: <Skeleton />,
//   },
// ];
