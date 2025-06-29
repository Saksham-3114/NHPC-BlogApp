import { auth } from '@/auth';
import EditContentForm from '@/components/edit-content-form';
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function EditPage({params}: {params:Promise<{username:string}>}){
  const session = await auth();
  if(!session?.user){
    redirect("/login")
  }

  const categories= await db.categories.findMany({
    select:{
      id: true,
      name: true
    }
  });
  
  const postid = (await params).username;
  const post= await db.post.findUnique({
    where:{ id: postid}
  })
  const usrname = session.user.name as string;

  if(!usrname) redirect("/");
    if(session.user.name!=usrname) redirect("/");
    return (
    <section className='py-7'>
        <EditContentForm username={usrname} categories={categories} post={post}/>
    </section>
  )
}