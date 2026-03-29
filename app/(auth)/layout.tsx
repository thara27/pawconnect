export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-bg px-6 py-12">
      <section className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        {children}
      </section>
    </main>
  );
}
