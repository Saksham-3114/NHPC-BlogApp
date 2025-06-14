

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <>
        <main className="h-screen flex flex-col justify-center items-center">
        <div className="bg-slate-100 p-10 rounded-md">{children}</div>
        </main>
        </>
  );
}
