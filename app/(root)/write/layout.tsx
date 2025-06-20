import type { Metadata } from 'next'
// import { Inter } from 'next/font/google'

import { Toaster } from '@/components/ui/sonner'

import '@/app/prosemirror.css'
import '@/app/globals.css'

// const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'NHPC Ltd. | Blog',
  description: 'Generated by create next app'
}

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
          <>
            <main className='grow'>{children}</main>
          <Toaster position='top-center' />
          </>
  )
}
