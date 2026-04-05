import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

type CommunityPost = {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  post_type: string | null;
  created_at: string;
  author_id: string;
};

const FALLBACK_POSTS: CommunityPost[] = [
  {
    id: "1",
    title: "Any good dog walkers near Koramangala?",
    content: "Looking for reliable weekday morning support for my Indie.",
    tags: ["bangalore", "dog-walker"],
    post_type: "question",
    created_at: new Date().toISOString(),
    author_id: "sample-user-1",
  },
  {
    id: "2",
    title: "Summer paw care tip",
    content: "Apply paw balm before evening walks. Hot roads can crack paw pads.",
    tags: ["tip", "summer-care"],
    post_type: "tip",
    created_at: new Date().toISOString(),
    author_id: "sample-user-2",
  },
];

function authorFirstName(authorId: string): string {
  return authorId.slice(0, 6);
}

export default async function CommunityPage() {
  const supabase = await createClient();
  let posts: CommunityPost[] = [];

  try {
    const { data, error } = await supabase
      .from("community_posts")
      .select("id, title, content, tags, post_type, created_at, author_id")
      .order("created_at", { ascending: false })
      .limit(20);

    posts = !error && data ? (data as CommunityPost[]) : FALLBACK_POSTS;
  } catch {
    posts = FALLBACK_POSTS;
  }

  return (
    <main className="page-wrapper px-4 py-10">
        <div className="mx-auto w-full max-w-4xl">
        <div className="section-header mt-6">
          <h1 className="heading-md">Community Feed</h1>
          <Link
            href="/community/new"
            className="btn btn-primary btn-sm"
          >
            Post
          </Link>
        </div>

        <div className="mt-6 space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="card">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="heading-sm">{post.title}</h2>
                <span className="badge badge-neutral">
                  {post.post_type ?? "post"}
                </span>
              </div>

              <p className="mt-2 text-sm text-muted">{post.content.slice(0, 180)}</p>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="badge badge-brand">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-muted">
                <p>
                  by {authorFirstName(post.author_id)} · {new Date(post.created_at).toLocaleDateString("en-IN")}
                </p>
                <Link
                  href="/coming-soon"
                  className="btn btn-outline btn-sm text-xs"
                >
                  Reply
                </Link>
              </div>
            </article>
          ))}
        </div>
        </div>
    </main>
  );
}
