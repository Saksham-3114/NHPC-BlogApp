import { Logout } from "@/app/actions";
import {auth} from "@/auth";
import { redirect } from "next/navigation";

export default async function ProfilePage() {
    const session = await auth();
    if (!session?.user) { redirect("/"); }
    return (
        <div className="relative flex h-screen w-full items-center justify-center top-10">
            <h1>{session?.user?.name}</h1>
            <form action={Logout}><button type="submit" className="bg-blue-400 my-1 text-white p-1 rounded">Logout</button></form>
        </div>
    );
}