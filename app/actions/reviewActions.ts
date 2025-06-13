'use server'

import { db } from "@/lib/db";


export async function ReviewBlog(formData: FormData){
    const raw=await formData.get("action") as string
    console.log(raw)
    const action=JSON.parse(raw);
    if(action.act==='publish'){
        const pub=await db.post.update({
            where:{id:action.postId},
            data:{
                published: 'true'
            }
        })
        if(!pub) throw new Error("Unable to Publish")
    }else if(action.act==='reject'){
const pub=await db.post.update({
            where:{id:action.postId},
            data:{
                published: "reject"
            }
        })
        if(!pub) throw new Error("Unable to Reject")
    }else{
        throw new Error("Cannot Review")
    }
}