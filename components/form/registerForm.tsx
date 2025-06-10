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
import GoogleSignInButton from "../ui/googleSignInButton";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "../ui/radio-group";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

const FormSchema = z.object({
  username: z.string().min(1, "Username is required").max(20, "Username must be at most 20 characters long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  type: z.enum(["user", "admin"], {
    required_error: "You need to select a role.",
  }),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters long"),
  confirmPassword: z.string().min(1, "Password Confirmation is required")
}).refine((data) => data.password === data.confirmPassword, { path: ["confirmPassword"], message: "Passwords do not match"});


export default function RegisterForm(){
  const router=useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      username: "",
      email: "",
      type: "user",
      password: "",
      confirmPassword: ""
    }
  });

    const onSubmit=async (values: z.infer<typeof FormSchema>)=>{
        const response = await fetch("/api/user",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: values.username,
            email: values.email,
            type: values.type,
            password: values.password
          })
        })
        if(response.ok){
          router.push("/login");
          toast.success("Registration Successful! Please login to continue.");
        }else{
          console.error("Registration Failed");
          toast.error("Registration Failed. Please try again.");
        }
    }
    return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="Username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-row gap-6"
                >
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <RadioGroupItem value="user" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      User
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <RadioGroupItem value="admin" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Admin
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter your Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Re-Enter your Password</FormLabel>
              <FormControl>
                <Input placeholder="Re-Enter your Password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <Button className="w-full mt-6" type="submit">Register</Button>
      </form>
      <div className="mx-auto my-4 flex w-full items-center justify-evenly before:mr-4 before:block before:h-px before:flex-grow before:bg-stone-400 after:ml-4 after:block after:h-px after:flex-grow after:bg-stone-400">
        or
      </div>
      <GoogleSignInButton>Register with Google</GoogleSignInButton>
      <p className="text-center text-sm text-gray-600 mt-2">
        If you already have an account, please&nbsp;
        <Link href="/login" className="text-blue-500 hover:underline">Login</Link> 
      </p>
    </Form>
    );
}