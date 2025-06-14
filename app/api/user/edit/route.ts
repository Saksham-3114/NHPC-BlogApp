/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { z } from "zod";

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

const userSchema = z.object({
username: z.string(),
  image: z.string().url("Please Enter a valid image url"),
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  designation: z.string().refine(val=>allowedDesg.includes(val as any),{message:"Invalid Designation"}),
  bio: z.string().max(100, "Bio must be at most 100 characters long"),
})

export async function POST(req:Request){
    try{
        const res=await req.json();
        const {username,image,designation,bio} = userSchema.parse(res);
        const user = await db.user.update({
            where:{name: username},
            data:{
                image: image,
                designation: designation,
                bio: bio
            }
        })
        if(!user){
            return NextResponse.json({user:null, message:"Error Updating in DB"},{status: 400})
        }
        const {password,...upUser}=user
        return NextResponse.json({user:upUser, message:"Profile Updated"},{status: 200})
    }catch(e){
        throw new Error("Error",{cause: e})
    }
}