
import { auth } from "@/auth";
import { BackgroundBeamsWithCollisionDemo } from "./component/herobg";
import HomeBlogList from "@/components/HomeBlogList";
import { db } from "@/lib/db";

type Posts=({
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
    Category: string[];
})[]

export default async function Home() {
  const session =await auth();
  console.log("Session:", session);
  const posts : Posts = await db.post.findMany({
    where:{published: 'true'},
    orderBy:{createdAt: "desc"},
    take: 10,
    include:{
      _count:{
        select:{
          likes:true
        }
      }
    }
  })
  return (
    <>
    <BackgroundBeamsWithCollisionDemo/>
    <div className="max-w-7xl relative mx-auto py-10 px-4 w-full  left-0 top-10">
      <h1 className="text-2xl md:text-7xl font-bold text-blue-900">
        Recent Blogs <br />
      </h1>
    </div>
      <div className="relative -z-10 min-h-screen flex items-center justify-center flex-wrap overflow-auto">
          <HomeBlogList posts={posts}/>
      </div>
    </>
  );
}
