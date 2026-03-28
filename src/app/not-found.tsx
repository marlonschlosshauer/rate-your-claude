import Link from "next/link";

export default function NotFoundPage() {
  return (
    <main className="flex-1 flex flex-col items-center px-4 py-12">
      <div className="w-full max-w-2xl flex flex-col gap-8">
        <section className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Page not found</h1>
          <p className="mt-3 text-sand-500 max-w-lg mx-auto">
            Oh no, this page does not exist! Lets be honest, we all know who
            probably screwed this up.
          </p>
        </section>
        <Link href="/" className="underline decoration-terracotta-600 m-auto">
          Go to home
        </Link>
      </div>
    </main>
  );
}
