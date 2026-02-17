"use server";

import { createSupabaseServerClient } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";

export async function addBookmark(formData: FormData) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  const title = formData.get("title") as string;
  const url = formData.get("url") as string;
  const category = formData.get("category") as string;

  if (!title || !url) {
    throw new Error("Missing required fields");
  }

  await supabase.from("bookmarks").insert({
    title,
    url,
    category,
    user_id: user.id,
    is_favorite: false,
    is_pinned: false,
  });

  revalidatePath("/dashboard");
}
