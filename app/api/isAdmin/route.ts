import {db} from "@/lib/db"
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const url=new URL(req.url);
    const name=url.searchParams.get("name") as string
    if(!name) return NextResponse.json({error: "name cannot be NULL"})
    const user =await db.user.findUnique({
        where:{name:name}
    });
    
    return NextResponse.json({role: user?.role})
}