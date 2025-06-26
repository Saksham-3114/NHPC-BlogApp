import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request){
    try{
        const body=await req.json();
        const {name} = body;
        console.log(name)
        const existCat =await db.categories.findUnique({
            where: {name: name}
        })
        if(existCat){
            return NextResponse.json({message: "Category already exists"},{status: 409});
        }
        const newCat = await db.categories.create({
            data:{
                name: name
            }
        })
        return NextResponse.json({category: newCat, message: "Category created successfully"},{status: 201})
    }catch{
        console.log("Error")
    }
}