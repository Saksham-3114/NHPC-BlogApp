import LoginForm from "@/components/form/loginForm";
import {auth} from "@/auth";
import { redirect } from "next/navigation";

export default async function LoginPage(){
    const session = await auth();
    if (session?.user) { redirect("/"); }
    return (
        <div className="w-full">
            <LoginForm/>
        </div>
    );
}