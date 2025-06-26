import React from 'react';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import ManagePageClient from '../../../components/ManagePageClient';

export default async function ManagePage() {
    const session = await auth();
    if(!session?.user){
        redirect("/login")
    }

    return <ManagePageClient />;
}