"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase-client";
import { Bookmark } from "@/types/bookmark";
import BookmarkItem from "./BookmarkItem";

interface BookmarkListProps {
  userId: string;
}

export default function BookmarkList({ userId }: BookmarkListProps) {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "pinned" | "favorite"
  >("all");

  const fetchBookmarks = useCallback(async () => {
    const { data, error } = await supabase
      .from("bookmarks")
      .select("*")
      .eq("user_id", userId)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Failed to fetch bookmarks", error);
      return;
    }

    if (data) setBookmarks(data as Bookmark[]);
  }, [userId]);

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to delete bookmark", error);
      return;
    }

    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const togglePinned = async (id: string, next: boolean) => {
    const { error } = await supabase
      .from("bookmarks")
      .update({ is_pinned: next })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to toggle pinned", error);
      return;
    }

    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_pinned: next } : b))
    );
  };

  const toggleFavorite = async (id: string, next: boolean) => {
    const { error } = await supabase
      .from("bookmarks")
      .update({ is_favorite: next })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("Failed to toggle favorite", error);
      return;
    }

    setBookmarks((prev) =>
      prev.map((b) => (b.id === id ? { ...b, is_favorite: next } : b))
    );
  };

  useEffect(() => {
    fetchBookmarks();
    const handler = () => fetchBookmarks();
    window.addEventListener("bookmarks:changed", handler);
    return () => window.removeEventListener("bookmarks:changed", handler);
  }, [fetchBookmarks]);

  const categories = useMemo(() => {
    const set = new Set<string>();
    bookmarks.forEach((b) => b.category && set.add(b.category));
    return ["all", ...Array.from(set)];
  }, [bookmarks]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return bookmarks.filter((b) => {
      const matchesTerm =
        !term ||
        b.title.toLowerCase().includes(term) ||
        b.url.toLowerCase().includes(term) ||
        (b.category || "").toLowerCase().includes(term);

      const matchesCategory =
        category === "all" || (b.category || "") === category;

      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pinned" && b.is_pinned) ||
        (statusFilter === "favorite" && b.is_favorite);

      return matchesTerm && matchesCategory && matchesStatus;
    });
  }, [bookmarks, search, category, statusFilter]);

  const pinned = filtered.filter((b) => b.is_pinned);
  const others = filtered.filter((b) => !b.is_pinned);

  return (
    <div className="space-y-6">
      {/* Search + Filter */}
      <div className="flex flex-col md:flex-row gap-3">
        <input
          placeholder="Search title, url, or category..."
          className="flex-1 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 px-4 py-2 text-sm"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          {categories.map((c) => (
            <option key={c} value={c}>
              {c === "all" ? "All categories" : c}
            </option>
          ))}
        </select>
      </div>

      {/* Status Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setStatusFilter("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            statusFilter === "all"
              ? "bg-indigo-600 text-white"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("pinned")}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            statusFilter === "pinned"
              ? "bg-yellow-500 text-white"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          Pinned
        </button>
        <button
          type="button"
          onClick={() => setStatusFilter("favorite")}
          className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-colors ${
            statusFilter === "favorite"
              ? "bg-pink-600 text-white"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }`}
        >
          Favorites
        </button>
      </div>

      {/* Pinned */}
      {pinned.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
            📌 Pinned
          </h3>
          <div className="space-y-3">
            {pinned.map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                onTogglePinned={togglePinned}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteBookmark}
              />
            ))}
          </div>
        </div>
      )}

      {/* Others */}
      <div>
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-3">
          All Bookmarks
        </h3>
        {others.length === 0 ? (
          <div className="text-sm text-gray-500 dark:text-gray-400">
            No bookmarks found.
          </div>
        ) : (
          <div className="space-y-3">
            {others.map((bookmark) => (
              <BookmarkItem
                key={bookmark.id}
                bookmark={bookmark}
                onTogglePinned={togglePinned}
                onToggleFavorite={toggleFavorite}
                onDelete={deleteBookmark}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
