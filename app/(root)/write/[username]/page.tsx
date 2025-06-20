
import { auth } from '@/auth';
import ContentForm from '@/components/content-form'
import { redirect } from 'next/navigation';

export default async function WritePage({params}: {params:Promise<{username:string}>}){
  const session = await auth();
  if(!session?.user){
    redirect("/login")
  }
  const username = (await params).username;
  if(!username) redirect("/");
    if(session.user.name!=username) redirect("/");
    return (
    <section className='py-7'>
      <div className='container  mx-auto p-10 w-fit rounded-xl flex flex-col items-center'>
        <h1 className='text-3xl font-bold'>Write a blog</h1>

        <ContentForm username={username}/>
      </div>
    </section>
  )
}