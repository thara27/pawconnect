import SignupNudge from "@/app/components/ui/SignupNudge";
import AuthPromptButton from "@/app/components/ui/AuthPromptButton";
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
    <main className="min-h-screen bg-[#FDF8F3] px-4 py-10">
      <div className="mx-auto w-full max-w-4xl">
        <SignupNudge
          message="Join the PawConnect community to ask questions, share stories, and support emergency blood requests."
          ctaText="Join Free"
        />

        <div className="mt-6 flex items-center justify-between">
          <h1 className="text-3xl text-slate-900">Community Feed</h1>
          <AuthPromptButton
            triggerText="Post"
            promptText="Login or sign up to publish your post"
          />
        </div>

        <div className="mt-6 space-y-4">
          {posts.map((post) => (
            <article key={post.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-xl text-slate-900">{post.title}</h2>
                <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">
                  {post.post_type ?? "post"}
                </span>
              </div>

              <p className="mt-2 text-sm text-slate-700">{post.content.slice(0, 180)}</p>

              {post.tags && post.tags.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-[#E8602C]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
                <p>
                  by {authorFirstName(post.author_id)} · {new Date(post.created_at).toLocaleDateString("en-IN")}
                </p>
                <AuthPromptButton
                  triggerText="Reply"
                  promptText="Login or sign up to reply to this post"
                  variant="ghost"
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
