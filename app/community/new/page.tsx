import Link from "next/link";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { PostForm } from "@/app/community/post-form";

export const metadata = {
  title: "New Post · PawConnect Community",
};

export default async function NewCommunityPostPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <main className="bg-bg px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-2xl space-y-6">

        {/* Page header */}
        <div className="flex items-center gap-3">
          <Link
            href="/community"
            className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#EBEBEB] bg-white text-stone-500 transition hover:border-[#FF5722] hover:text-[#FF5722]"
            aria-label="Back to community"
          >
            ←
          </Link>
          <div>
            <p className="badge badge-brand">Community</p>
            <h1 className="heading-md mt-1">Create a post</h1>
          </div>
        </div>

        {/* Hint card */}
        <div className="card-flat flex items-start gap-3">
          <span className="mt-0.5 text-lg">💡</span>
          <p className="text-sm text-stone-500 leading-relaxed">
            Ask a question, share a tip, or tell your story. Be respectful and help
            build a great community for pet parents across India.
          </p>
        </div>

        {/* Form card */}
        <div className="card-flat">
          <PostForm />
        </div>

      </div>
    </main>
  );
}
