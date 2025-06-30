"use client"

import { useForm } from "react-hook-form";
import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import Link from "next/link";
// import GoogleSignInButton from "../ui/googleSignInButton";
import { NHPCCredentialsLogin } from "@/app/actions";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const FormSchema = z.object({
  employeeId: z.string().min(1, "Employee ID is required"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 8 characters long"),
});


export default function NHPCLoginForm(){
  const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      employeeId: "",
      password: ""
    }
  });

    const onSubmit= async (values: z.infer<typeof FormSchema>)=>{
        // console.log(values)
        try{
          const formData = new FormData();
          formData.append("employeeId", values.employeeId);
          formData.append("password", values.password);
          const response = await NHPCCredentialsLogin(formData);
          if(response?.error){
            console.error("Login failed:", response.error);
            toast.error("Login failed: " + response.error);
          }else{
            router.push("/");
            toast.success("Login successful!");
          }
        }catch(e){
          console.error("Error during login:", e);
          toast.error("Invalid Credentials");
          // Handle error appropriately, e.g., show a notification or message
        }
    }
    return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-6">
        <FormField
          control={form.control}
          name="employeeId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Employee ID</FormLabel>
              <FormControl>
                <Input placeholder="Employee ID" type="text" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ERP Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <Button className="w-full mt-6" type="submit">Log In</Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      {/* <GoogleSignInButton>Login with Google</GoogleSignInButton> */}
      <Button className="w-full" onClick={()=>{router.push('/login')}}>Back to Log In</Button>
      
      <p className="text-center text-sm text-gray-600 mt-2">
        <Link href="/forgot-password" className="text-sm text-blue-500 hover:text-blue-600 text-center">Forgot your password?</Link>
      </p>
      <p className="text-center text-sm text-gray-600 mt-2">
        If you don&apos;t have an account, please&nbsp;
        <Link href="/register" className="text-blue-500 hover:underline">Register</Link> 
      </p>
    </Form>
    );
}