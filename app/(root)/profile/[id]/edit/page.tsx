import {auth} from "@/auth";
import { redirect } from "next/navigation";
import EditForm from "@/components/form/editForm";
import { db } from "@/lib/db";

type User={
    name: string;
    id: string;
    image: string;
    email: string;
    password: string;
    role: "user" | "admin";
    bio: string;
    designation: string;
    createdAt: Date;
}

export default async function EditPage({params}:{params:Promise<{id:string}>}){
  const username=(await params).id;
    const session = await auth();
    if (!session?.user) { redirect("/"); }

    const user : User =await db.user.findUnique({
      where: {name: username}
    }) as User


    return (
        <main className="h-screen flex flex-col justify-center items-center">
        <div className="bg-slate-100 p-10 rounded-md">
          <div className="w-full">
            <EditForm user={user}/>
        </div>
        </div>
        </main>
    );
}