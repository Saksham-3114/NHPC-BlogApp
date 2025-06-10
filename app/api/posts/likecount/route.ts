import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request){
    const url=new URL(req.url);
    const postid = url.searchParams.get("postid");
    const likeCount = await db.like.count({
        where: {post: {id: postid as string}}
    })
    // console.log(likeCount);
    return NextResponse.json(likeCount);
}