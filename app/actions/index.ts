'use server'

import { signIn,signOut } from "@/auth"

export async function GoogleLogin(){
    await signIn("google",{redirectTo: "/"})
}

export async function Logout(){
    try{
        const res=await signOut({redirect: false});
        if(res?.error) throw new Error(res.error);
        return res;
    }
    catch(e){
        throw new Error("Error",{cause:e})
    }
}

export async function CredentialsLogin(formData: FormData){
    try{
        const response = await signIn("credentials",{
            email: formData.get("email") as string,
            password: formData.get("password") as string,
            redirect: false
        });
        if(response?.error){
            throw new Error(response.error);
        }
        return response;
    }catch(e){
        throw new Error("Error", { cause: e });
    }
}