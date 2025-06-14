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
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Textarea } from "../ui/textarea";

const allowedDesg = [
    "Chief Managing Director",
    "Director",
    "Executive Director",
    "Medical Officer",
    "Vigilance Officer",
    "General Manager",
    "Group Senior Manager",
    "Senior Manager",
    "Manager",
    "Deputy General Manager",
    "Deputy Manager",
    "Assistant Manager",
    "Engineer",
    "Trainee",
] as const;

const FormSchema = z.object({
  pp: z.string().url("Please Enter a valid image url"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  desg: z.string().refine(val=>allowedDesg.includes(val as any),{message:"Invalid Designation"}),
  bio: z.string().max(100, "Bio must be at most 100 characters long"),
})

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

export default function EditForm({user}:{user:User}){



  const router=useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      pp: user.image,
      desg: user.designation,
      bio: user.bio
    }
  });

    const onSubmit=async (values: z.infer<typeof FormSchema>)=>{
        const response = await fetch("/api/user/edit",{
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            username: user.name,
            image: values.pp,
            designation: values.desg,
            bio: values.bio, 
          })
        })
        if(response.ok){
          router.push(`/profile/${user.name}`);
          toast.success("Profile Updated Successfully");
        }else{
          console.error("Profile Update Failed");
          toast.error("Profile Update Failed");
        }
    }
    return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-4">
        <FormField
          control={form.control}
          name="pp"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Image</FormLabel>
              <FormControl>
                <Input placeholder="Place Image Link" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="desg"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Designation</FormLabel>
              <FormControl>
                <select className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer" {...field}>
                    <option value="" defaultChecked>Select Designation</option>
                    {allowedDesg.map((d) => (
                        <option key={d} value={d}>{d}</option>
                    ))}
                    
                </select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bio</FormLabel>
              <FormControl>
                {/* <Input placeholder="Enter your Password" type="password" {...field} /> */}
                <Textarea placeholder="Tell us a little more about yourself" className="w-full bg-transparent placeholder:text-slate-400 text-slate-700 text-sm border border-slate-200 rounded pl-3 pr-8 py-2 transition duration-300 ease focus:outline-none focus:border-slate-400 hover:border-slate-400 shadow-sm focus:shadow-md appearance-none cursor-pointer"  {...field}/>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <Button className="w-full mt-6" type="submit">Edit</Button>
      </form>
    </Form>
    );
}