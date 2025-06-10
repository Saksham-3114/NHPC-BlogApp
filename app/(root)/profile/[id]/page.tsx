import { Logout } from "@/app/actions";
import {auth} from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { TabsDemo } from "../../component/tab";
import { NavbarButton } from "@/components/ui/resizable-navbar";



export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user) { redirect("/"); }

    const user = await db.user.findUnique({
        where: { email: session.user.email as string },
        select: {
            name: true,
            email: true,
            role: true,
            bio: true,
        },
    })

    const profile = {
        name: user?.name || session?.user.name || "Anonymous",
        avatar: "/profile.jpeg",
        bio: user?.bio || "No bio available",
        role: user?.role || "user",
    };

    const isAdmin = profile.role === "admin";


    return (
        <main className="min-h-screen bg-white flex flex-col items-center pt-14 px-4">
      <div className="flex flex-col items-center mb-6">
        <div className="w-24 h-24 rounded-full overflow-hidden border shadow  relative top-2">
          <Image
            src={profile.avatar}
            alt={profile.name as string || "User Avatar"}
            width={96}
            height={96}
            className="object-cover rounded-full"
            priority
          />
        </div>
        <h1 className="mt-4 text-xl font-semibold text-gray-900">{profile.name}</h1>
      </div>

      <div className="w-full max-w-2xl">
    
          <div className="mb-4 flex justify-end gap-4">
            {isAdmin ? (<NavbarButton href="/review" className="px-4 py-2 rounded-md bg-zinc-800 text-white hover:bg-zinc-700 transition focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2">
              To Review
            </NavbarButton>): null}
            <form action={Logout}><button type="submit" className="px-4 py-2 rounded-md bg-red-500 text-white hover:bg-red-400 transition focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2">Logout</button></form>
          </div>
        
        <h2 className="text-4xl font-semibold text-gray-900">Posts</h2>
        <TabsDemo/>
      </div>
    </main>
    );
}

