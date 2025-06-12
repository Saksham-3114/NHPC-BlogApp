import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const url=new URL(req.url);
    const username = url.searchParams.get("username");
    const posts = await db.post.findMany({
        where: {
            likes: {
                some: {
                    author: {
                        name: username as string
                    }
                }
            }
        },
        orderBy: {createdAt: "desc"}
    })
    // console.log(posts);
    return NextResponse.json(posts);
}