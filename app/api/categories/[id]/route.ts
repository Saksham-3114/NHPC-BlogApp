import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request){
    const url = new URL(req.url);
    const id = url.pathname.split('/').at(-1) as string
    try{
        const body=await req.json();
        const {name}= body;
        const updateCat = await db.categories.update({
            where:{ id : id},
            data: {
                name:name
            }
        })
        // console.log(updateCat);
        if(!updateCat){
            return NextResponse.json({message: "cannot update"},{status:409})
        } 
        return NextResponse.json({category:updateCat,message:"category updated"},{status:201})
        
    }catch{
        console.log("Error")
    }
}

export  async function DELETE(req: Request){
    const url = new URL(req.url);
    const id = url.pathname.split('/').at(-1) as string
    try{
        const updateCat = await db.categories.delete({
            where:{ id : id}
        })
        if(!updateCat){
            return NextResponse.json({message: "cannot delete"},{status:409})
        } 
        return NextResponse.json({category:updateCat,message:"category deleted"},{status:201})
        
    }catch{
        console.log("Error")
    }
}