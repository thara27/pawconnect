"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

// ── Types ─────────────────────────────────────────────────────────────────────

export type PostFormState = {
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

const TITLE_MAX = 120;
const CONTENT_MAX = 2000;
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

// ── Action ────────────────────────────────────────────────────────────────────

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

  // ── Validate ───────────────────────────────────────────────
  if (!title) {
    return { error: "Title is required." };
  }
  if (title.length > TITLE_MAX) {
    return { error: `Title must be ${TITLE_MAX} characters or fewer.` };
  }
  if (!content) {
    return { error: "Content is required." };
  }
  if (content.length > CONTENT_MAX) {
    return { error: `Content must be ${CONTENT_MAX} characters or fewer.` };
  }

  const postType: PostType = POST_TYPES.includes(postTypeRaw as PostType)
    ? (postTypeRaw as PostType)
    : "question";

  const tags = tagsRaw.length > 0 ? parseTags(tagsRaw) : null;

  // ── Insert ─────────────────────────────────────────────────
  const { error } = await supabase.from("community_posts").insert({
    author_id: user.id,
    title,
    content,
    tags,
    post_type: postType,
  });

  if (error) {
    // Do not expose raw DB error messages to the client (information disclosure)
    console.error("community_posts insert error:", error.message);
    return { error: "Could not create your post. Please try again." };
  }

  redirect("/community");
}
