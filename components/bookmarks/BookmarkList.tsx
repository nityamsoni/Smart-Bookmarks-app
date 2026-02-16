"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Bookmark } from "@/types/bookmark";

export default function BookmarkList({ userId }: { userId: string }) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  const fetchBookmarks = async () => {
    const { data } = await supabase
      .from("bookmarks")
      .select("*")
      .order("created_at", { ascending: false });

    if (data) setBookmarks(data);
  };

  const deleteBookmark = async (id: string) => {
    await supabase.from("bookmarks").delete().eq("id", id);
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  return (
    <div className="space-y-3">
      {bookmarks.map((bookmark) => (
        <div
          key={bookmark.id}
          className="border p-3 flex justify-between items-center"
        >
          <div>
            <p className="font-semibold">{bookmark.title}</p>
            <a
              href={bookmark.url}
              target="_blank"
              className="text-blue-500 text-sm"
            >
              {bookmark.url}
            </a>
          </div>

          <button
            onClick={() => deleteBookmark(bookmark.id)}
            className="text-red-500"
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}
