"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase-client";

export default function BookmarkForm({ userId }: { userId: string }) {
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!title || !url) return;

    setLoading(true);

    const { error } = await supabase.from("bookmarks").insert([
      {
        title,
        url,
        user_id: userId,
      },
    ]);

    setLoading(false);

    if (!error) {
      setTitle("");
      setUrl("");
    }
  };

  return (
    <div className="mb-6 space-y-3">
      <input
        type="text"
        placeholder="Title"
        className="border p-2 w-full"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="text"
        placeholder="URL"
        className="border p-2 w-full"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
      />

      <button
        onClick={handleAdd}
        disabled={loading}
        className="bg-black text-white px-4 py-2 rounded"
      >
        {loading ? "Adding..." : "Add Bookmark"}
      </button>
    </div>
  );
}
