import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPostById, getPostReplies } from "@/lib/actions/community";
import ReplyForm from "./reply-form";

const POST_TYPE_EMOJI: Record<string, string> = {
  question: "❓",
  tip: "💡",
  story: "📖",
  blood_request: "🩸",
  lost_found: "🔍",
};

export default async function CommunityPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [post, replies] = await Promise.all([getPostById(id), getPostReplies(id)]);

  if (!post) notFound();

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="page-wrapper px-4 py-10">
      <div className="mx-auto w-full max-w-3xl space-y-6">

        {/* Back */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-brand transition-colors"
        >
          ← Back to community
        </Link>

        {/* Post */}
        <article className="card space-y-4">
          <div className="flex flex-wrap items-start justify-between gap-2">
            <span className="badge badge-neutral">
              {POST_TYPE_EMOJI[post.post_type ?? ""] ?? "📝"} {post.post_type ?? "post"}
            </span>
            <span className="text-xs text-muted">
              {new Date(post.created_at).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>

          <h1 className="font-fraunces text-2xl font-black text-ink leading-snug">
            {post.title}
          </h1>

          <p className="text-sm leading-relaxed text-ink whitespace-pre-wrap">{post.content}</p>

          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="badge badge-brand">#{tag}</span>
              ))}
            </div>
          )}

          <p className="text-xs text-muted border-t border-border pt-3">
            Posted by{" "}
            <span className="font-medium text-ink">
              {post.author_display_name ?? "Community member"}
            </span>
          </p>
        </article>

        {/* Replies */}
        <section>
          <h2 className="heading-sm mb-4">
            {replies.length === 0 ? "No replies yet" : `${replies.length} repl${replies.length === 1 ? "y" : "ies"}`}
          </h2>

          {replies.length > 0 && (
            <div className="space-y-3 mb-6">
              {replies.map((reply) => (
                <div key={reply.id} className="rounded-xl border border-border bg-white px-4 py-3">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-sm font-semibold text-ink">
                      {reply.author_display_name ?? "Community member"}
                    </span>
                    <span className="text-xs text-muted">
                      {new Date(reply.created_at).toLocaleDateString("en-IN")}
                    </span>
                  </div>
                  <p className="text-sm text-ink whitespace-pre-wrap">{reply.content}</p>
                </div>
              ))}
            </div>
          )}

          {/* Reply form — only for logged-in users */}
          {user ? (
            <div className="rounded-xl border border-border bg-white p-4">
              <p className="text-sm font-semibold text-ink mb-3">Leave a reply</p>
              <ReplyForm postId={post.id} />
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-border bg-bg px-5 py-6 text-center">
              <p className="text-sm text-muted">
                <Link href="/login" className="font-semibold text-brand hover:underline">
                  Log in
                </Link>{" "}
                to leave a reply.
              </p>
            </div>
          )}
        </section>

      </div>
    </main>
  );
}
