import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import ManageCategories from '@/components/ManageCategories';
import { db } from '@/lib/db';


export default async function ManagePage() {
    const session = await auth();
    if(!session?.user){
        redirect("/login")
    }

    const categories= await db.categories.findMany();

    
    return <ManageCategories categories={categories} />
}