import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hash } from "bcrypt";
import * as z from "zod";


// Define schema for user registration
const userSchema = z.object({
  username: z.string().min(1, "Username is required").max(20, "Username must be at most 20 characters long"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  type: z.enum(["user", "admin"], {
    required_error: "You need to select a role.",
  }),
  password: z.string().min(1, "Password is required").min(8, "Password must be at least 8 characters long")
})

export async function OPTIONS() {
  const res = new NextResponse(null, { status: 204 });
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  return res;
}   

export async function POST(req:Request){
    try{
        const body=await req.json();
        const {username,email,type,password}=userSchema.parse(body);

        //check existing user by email
        const existingUserByEmail = await db.user.findUnique({
            where: { email: email }
        });
        if(existingUserByEmail){
            return NextResponse.json({user:null, message: "User with this email already exists"}, {status: 409});
        }

        //check existing user by username
        const existingUserByUsername = await db.user.findUnique({
            where: { name: username }
        });
        if(existingUserByUsername){
            return NextResponse.json({user:null, message: "User with this username already exists"}, {status: 409});
        }

        const hashedPassword = await hash(password,10);

        //create user
        const newUser=await db.user.create({
            data:{
                name: username,
                email: email,
                role: type,
                password: hashedPassword 
            }
        })

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password: newUserPassword, ...rest } = newUser;

        const res= NextResponse.json({user:rest, message: "User created successfully"}, {status: 201});
        res.headers.set('Access-Control-Allow-Origin', '*');
        return res;
    }
    catch (error) {
        console.error("Error in POST /api/user:", error);
        return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
    }
}