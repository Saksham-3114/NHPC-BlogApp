'use server'
import {db} from "@/lib/db"

export async function DeleteBlogAction(formData: FormData){
    const postId=formData.get("postId") as string;
    const res=await db.post.delete({
        where:{ id: postId}
    })
    if(!res){
        throw new Error("Deletion of Blog Failed")
    }
} 