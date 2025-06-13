import { Logout } from "@/app/actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import { TabsDemo } from "../../component/tab";
import { NavbarButton } from "@/components/ui/resizable-navbar";
import { Button } from "@/components/ui/button";

export default async function ProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user) { redirect("/"); }
  
  const id = (await params).id;
  if (session.user.name != id) redirect("/");
  
  const user = await db.user.findUnique({
    where: { email: session.user.email as string },
    select: {
      image: true,
      name: true,
      email: true,
      role: true,
      bio: true,
      designation: true, // Added designation field
    },
  });

  const profile = {
    name: user?.name || session?.user.name || "Anonymous",
    avatar: user?.image || "/profile.jpeg",
    bio: user?.bio || "Empowering India through sustainable hydroelectric power generation",
    role: user?.role || "user",
    designation: user?.designation || "Team Member",
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isAdmin = profile.role === "admin";

  return (
    <main className="min-h-screen relative overflow-hidden mt-14">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row items-start gap-8 mb-12">
          {/* Profile Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 min-w-[320px]">
            <div className="flex flex-col items-center text-center">
              {/* Avatar with Power Ring Effect */}
              <div className="relative mb-6">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse opacity-20 scale-110"></div>
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                  <Image
                    src={profile.avatar}
                    alt={profile.name as string || "User Avatar"}
                    width={112}
                    height={112}
                    className="object-cover w-full h-full"
                    priority
                  />
                </div>
                {/* Status Indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white shadow-lg"></div>
              </div>

              {/* User Info */}
              <h1 className="text-2xl font-bold text-gray-900 mb-2">{profile.name}</h1>
              <div className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-semibold rounded-full mb-4">
                <span className="w-2 h-2 bg-white rounded-full mr-2"></span>
                {profile.designation}
              </div>
              
              {/* Bio Section */}
              </div>
              </div>

          {/* NHPC Branding & Stats */}
          <div className="flex-1 flex-col space-y-6 ">
            {/* NHPC Header */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50 min-w-[320px] min-h-[225px] ">
              <div className="w-full">
                <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wider mb-3 flex items-center justify-center">
                  <span className="w-8 h-px bg-gray-300 mr-2"></span>
                  About
                  <span className="w-8 h-px bg-gray-300 ml-2"></span>
                </h3>
                <p className="text-gray-700 text-sm leading-relaxed">{profile.bio}</p>
              </div>
            </div>
            

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <NavbarButton 
                href={`/profile/${id}/edit`} 
                className="flex-1 min-w-[140px] bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                 Edit Profile
              </NavbarButton>
              <form action={Logout} className="flex-1 min-w-[140px]">
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-semibold py-3 px-6 rounded-xl hover:shadow-xl transition-all duration-300 transform hover:scale-105
                  shadow-[0_0_24px_rgba(34,_42,_53,_0.06),_0_1px_1px_rgba(0,_0,_0,_0.05),_0_0_0_1px_rgba(34,_42,_53,_0.04),_0_0_4px_rgba(34,_42,_53,_0.08),_0_16px_68px_rgba(47,_48,_55,_0.05),_0_1px_0_rgba(255,_255,_255,_0.1)_inset]
                    button  relative cursor-pointer hover:-translate-y-0.5 h-[47px]
                  "
                >
                   Logout
                </Button>
              </form>
            </div>
          </div>
          </div>

        {/* Posts Section */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/50">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-cyan-500 rounded-full"></div>
            <h2 className="text-3xl font-bold text-gray-900">Post Updates</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-gray-200 via-blue-200 to-transparent"></div>
          </div>
          
          <TabsDemo />
        </div>
      </div>
    </main>
  );
}