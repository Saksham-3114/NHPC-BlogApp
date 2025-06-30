import NHPCLoginForm from "@/components/form/NHPCloginForm";
import {auth} from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage(){
    const session = await auth();
    if (session?.user) { redirect("/"); }
    return (
        <div className="w-full">
            <NHPCLoginForm/>
        </div>
    );
}