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

const FormSchema = z.object({
  email: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  password: z.string()
});


export default function LoginForm(){
    const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema)
  });

    const onSubmit=()=>{
        console.log('form submitted!')
    }
    return(
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full">
        <div className="space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="Email" {...field} />
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
                <Input placeholder="Enter your Password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        </div>
        <Button className="w-full mt-6" type="submit">Log In</Button>
      </form>
    </Form>
    );
}