import Link from "next/link";
import { getPosts } from "@/lib/actions/community";

const POST_TYPE_EMOJI: Record<string, string> = {
  question: "❓",
  tip: "💡",
  story: "📖",
  blood_request: "🩸",
  lost_found: "🔍",
};

export default async function CommunityPage() {
  const posts = await getPosts();

  return (
    <main className="page-wrapper px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <div className="section-header mt-6">
          <h1 className="heading-md">Community Feed</h1>
          <Link href="/community/new" className="btn btn-primary btn-sm">
            Post
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="mt-10 rounded-2xl border-2 border-dashed border-border bg-white px-6 py-12 text-center">
            <p className="text-4xl">🐾</p>
            <h2 className="mt-3 font-fraunces text-xl font-black text-ink">No posts yet</h2>
            <p className="mt-1 text-sm text-muted">Be the first to share something with the community.</p>
            <Link href="/community/new" className="btn btn-primary mt-5">
              Create a post
            </Link>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            {posts.map((post) => (
              <article key={post.id} className="card hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <Link href={`/community/${post.id}`} className="heading-sm hover:text-brand transition-colors">
                    {post.title}
                  </Link>
                  <span className="badge badge-neutral">
                    {POST_TYPE_EMOJI[post.post_type ?? ""] ?? "📝"} {post.post_type ?? "post"}
                  </span>
                </div>

                <p className="mt-2 text-sm text-muted">{post.content.slice(0, 180)}{post.content.length > 180 ? "…" : ""}</p>

                {post.tags && post.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {post.tags.map((tag) => (
                      <span key={tag} className="badge badge-brand">#{tag}</span>
                    ))}
                  </div>
                )}

                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  <p>
                    by{" "}
                    <span className="font-medium text-ink">
                      {post.author_display_name ?? "Community member"}
                    </span>
                    {" · "}
                    {new Date(post.created_at).toLocaleDateString("en-IN")}
                  </p>
                  <Link href={`/community/${post.id}`} className="btn btn-outline btn-sm text-xs">
                    Read & Reply
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
