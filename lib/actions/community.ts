"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

import { createClient } from "@/lib/supabase/server";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PostFormState = {
  error: string | null;
};

export type ReplyFormState = {
  error: string | null;
};

const POST_TYPES = [
  "question",
  "tip",
  "story",
  "blood_request",
  "lost_found",
] as const;

type PostType = (typeof POST_TYPES)[number];

export type CommunityPost = {
  id: string;
  title: string;
  content: string;
  tags: string[] | null;
  post_type: string | null;
  created_at: string;
  author_id: string;
  author_display_name: string | null;
};

export type PostReply = {
  id: string;
  post_id: string;
  author_id: string;
  author_display_name: string | null;
  content: string;
  created_at: string;
};

const TITLE_MAX = 120;
const CONTENT_MAX = 2000;
const REPLY_MAX = 1000;
const TAGS_MAX = 5;

// ── Helpers ───────────────────────────────────────────────────────────────────

function asString(value: FormDataEntryValue | null): string {
  return typeof value === "string" ? value.trim() : "";
}

function parseTags(raw: string): string[] {
  return raw
    .split(",")
    .map((t) => t.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""))
    .filter((t) => t.length > 0)
    .slice(0, TAGS_MAX);
}

async function resolveDisplayNames(
  supabase: Awaited<ReturnType<typeof createClient>>,
  userIds: string[],
): Promise<Map<string, string | null>> {
  if (userIds.length === 0) return new Map();

  const { data } = await supabase
    .from("pet_owner_profiles")
    .select("user_id, display_name")
    .in("user_id", userIds);

  const map = new Map<string, string | null>();
  for (const row of data ?? []) {
    map.set(row.user_id as string, (row.display_name as string | null) ?? null);
  }
  return map;
}

// ── Read ──────────────────────────────────────────────────────────────────────

export async function getPosts(): Promise<CommunityPost[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("community_posts")
    .select("id, title, content, tags, post_type, created_at, author_id")
    .order("created_at", { ascending: false })
    .limit(20);

  if (error || !data) return [];

  const authorIds = [...new Set((data as CommunityPost[]).map((p) => p.author_id))];
  const names = await resolveDisplayNames(supabase, authorIds);

  return (data as CommunityPost[]).map((p) => ({
    ...p,
    author_display_name: names.get(p.author_id) ?? null,
  }));
}

export async function getPostById(id: string): Promise<CommunityPost | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("community_posts")
    .select("id, title, content, tags, post_type, created_at, author_id")
    .eq("id", id)
    .maybeSingle();

  if (error || !data) return null;

  const post = data as CommunityPost;
  const names = await resolveDisplayNames(supabase, [post.author_id]);

  return { ...post, author_display_name: names.get(post.author_id) ?? null };
}

export async function getPostReplies(postId: string): Promise<PostReply[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("community_post_replies")
    .select("id, post_id, author_id, content, created_at")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error || !data) return [];

  const replies = data as Omit<PostReply, "author_display_name">[];
  const authorIds = [...new Set(replies.map((r) => r.author_id))];
  const names = await resolveDisplayNames(supabase, authorIds);

  return replies.map((r) => ({
    ...r,
    author_display_name: names.get(r.author_id) ?? null,
  }));
}

// ── Create post ───────────────────────────────────────────────────────────────

export async function createPostAction(
  _prevState: PostFormState,
  formData: FormData,
): Promise<PostFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const title = asString(formData.get("title"));
  const content = asString(formData.get("content"));
  const tagsRaw = asString(formData.get("tags"));
  const postTypeRaw = asString(formData.get("post_type"));

  if (!title) return { error: "Title is required." };
  if (title.length > TITLE_MAX) return { error: `Title must be ${TITLE_MAX} characters or fewer.` };
  if (!content) return { error: "Content is required." };
  if (content.length > CONTENT_MAX) return { error: `Content must be ${CONTENT_MAX} characters or fewer.` };

  const postType: PostType = POST_TYPES.includes(postTypeRaw as PostType)
    ? (postTypeRaw as PostType)
    : "question";

  const tags = tagsRaw.length > 0 ? parseTags(tagsRaw) : null;

  const { error } = await supabase.from("community_posts").insert({
    author_id: user.id,
    title,
    content,
    tags,
    post_type: postType,
  });

  if (error) {
    console.error("community_posts insert error:", error.message);
    return { error: "Could not create your post. Please try again." };
  }

  redirect("/community");
}

// ── Create reply ──────────────────────────────────────────────────────────────

export async function createReplyAction(
  _prevState: ReplyFormState,
  formData: FormData,
): Promise<ReplyFormState> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const postId = asString(formData.get("post_id"));
  const content = asString(formData.get("content"));

  if (!postId) return { error: "Invalid post." };
  if (!content) return { error: "Reply cannot be empty." };
  if (content.length > REPLY_MAX) return { error: `Reply must be ${REPLY_MAX} characters or fewer.` };

  const { error } = await supabase.from("community_post_replies").insert({
    post_id: postId,
    author_id: user.id,
    content,
  });

  if (error) {
    console.error("community_post_replies insert error:", error.message);
    return { error: "Could not post your reply. Please try again." };
  }

  revalidatePath(`/community/${postId}`);
  return { error: null };
}
