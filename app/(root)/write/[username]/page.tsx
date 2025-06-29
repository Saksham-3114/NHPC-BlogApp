
import { auth } from '@/auth';
import ContentForm from '@/components/content-form'
import { db } from '@/lib/db';
import { redirect } from 'next/navigation';

export default async function WritePage({params}: {params:Promise<{username:string}>}){
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


  const username = (await params).username;
  if(!username) redirect("/");
    if(session.user.name!=username) redirect("/");
    return (
    <section className='py-7'>
      {/* <div className='container  mx-auto p-10 w-fit rounded-xl'> */}
        <ContentForm username={username} categories={categories}/>
      {/* </div> */}
    </section>
  )
}