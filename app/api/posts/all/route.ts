import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(){
    const posts = await db.post.findMany({
        where: {published:'true'},
        orderBy:{createdAt: "desc"},
        take: 10,
    })
    // console.log(posts);
    return NextResponse.json(posts);
}