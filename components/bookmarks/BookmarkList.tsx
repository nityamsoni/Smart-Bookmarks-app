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
  const [statusFilter, setStatusFilter] = useState<"all" | "pinned" | "favorite">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(true);

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
    setLoading(false);
  }, [userId]);

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) { console.error("Failed to delete bookmark", error); return; }
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const togglePinned = async (id: string, next: boolean) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .update({ is_pinned: next })
      .eq("id", id)
      .eq("user_id", userId)
      .select("id, is_pinned")
      .single();

    if (error) { console.error("Failed to toggle pinned", error); return; }
    if (data) {
      setBookmarks((prev) => prev.map((b) => b.id === id ? { ...b, is_pinned: data.is_pinned } : b));
    } else { fetchBookmarks(); }
  };

  const toggleFavorite = async (id: string, next: boolean) => {
    const { data, error } = await supabase
      .from("bookmarks")
      .update({ is_favorite: next })
      .eq("id", id)
      .eq("user_id", userId)
      .select("id, is_favorite")
      .single();

    if (error) { console.error("Failed to toggle favorite", error); return; }
    if (data) {
      setBookmarks((prev) => prev.map((b) => b.id === id ? { ...b, is_favorite: data.is_favorite } : b));
    } else { fetchBookmarks(); }
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
      const matchesCategory = category === "all" || (b.category || "") === category;
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "pinned" && b.is_pinned) ||
        (statusFilter === "favorite" && b.is_favorite);
      return matchesTerm && matchesCategory && matchesStatus;
    });
  }, [bookmarks, search, category, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paged = filtered.slice(startIndex, startIndex + pageSize);
  const pinned = paged.filter((b) => b.is_pinned);
  const others = paged.filter((b) => !b.is_pinned);

  useEffect(() => { setPage(1); }, [search, category, statusFilter, pageSize]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Search + Category */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            placeholder="Search title, URL, category…"
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 focus:bg-white dark:focus:bg-gray-800 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {categories.length > 1 && (
          <select
            className="rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/60 text-sm text-gray-700 dark:text-gray-300 px-3 py-2.5
              focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-400 transition-all"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((c) => (
              <option key={c} value={c}>{c === "all" ? "All categories" : c}</option>
            ))}
          </select>
        )}
      </div>

      {/* Status filter pills */}
      <div className="flex items-center gap-2">
        {(["all", "pinned", "favorite"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 border
              ${statusFilter === f
                ? f === "all"
                  ? "bg-indigo-600 text-white border-indigo-600 shadow-sm"
                  : f === "pinned"
                    ? "bg-amber-500 text-white border-amber-500 shadow-sm"
                    : "bg-rose-500 text-white border-rose-500 shadow-sm"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
              }`}
          >
            {f === "all" ? "All" : f === "pinned" ? "📌 Pinned" : "♥ Favorites"}
          </button>
        ))}

        {/* Count badge */}
        <span className="ml-auto text-xs text-gray-400 dark:text-gray-500">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="py-14 flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4">
            <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">No bookmarks found</p>
          <p className="text-xs text-gray-400 dark:text-gray-600 mt-1">
            {search ? `No results for "${search}"` : "Add your first bookmark above"}
          </p>
        </div>
      )}

      {/* Bookmark groups */}
      {filtered.length > 0 && statusFilter === "all" && (
        <>
          {pinned.length > 0 && (
            <section>
              <p className="text-[11px] font-semibold uppercase tracking-widest text-amber-500 dark:text-amber-400 mb-2 flex items-center gap-1.5">
                <span>📌</span> Pinned
              </p>
              <div className="space-y-2">
                {pinned.map((b) => (
                  <BookmarkItem key={b.id} bookmark={b} onTogglePinned={togglePinned} onToggleFavorite={toggleFavorite} onDelete={deleteBookmark} />
                ))}
              </div>
            </section>
          )}

          {others.length > 0 && (
            <section>
              {pinned.length > 0 && (
                <p className="text-[11px] font-semibold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
                  Other Bookmarks
                </p>
              )}
              <div className="space-y-2">
                {others.map((b) => (
                  <BookmarkItem key={b.id} bookmark={b} onTogglePinned={togglePinned} onToggleFavorite={toggleFavorite} onDelete={deleteBookmark} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

      {filtered.length > 0 && statusFilter !== "all" && (
        <div className="space-y-2">
          {filtered.map((b) => (
            <BookmarkItem key={b.id} bookmark={b} onTogglePinned={togglePinned} onToggleFavorite={toggleFavorite} onDelete={deleteBookmark} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            {startIndex + 1}–{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}
          </p>

          <div className="flex items-center gap-1.5">
            <select
              className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-xs px-2 py-1.5 text-gray-600 dark:text-gray-300"
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
            >
              {[6, 8, 12, 16].map((s) => <option key={s} value={s}>{s}/page</option>)}
            </select>

            <button
              type="button"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>

            <span className="text-xs text-gray-500 dark:text-gray-400 px-1">
              {safePage} / {totalPages}
            </span>

            <button
              type="button"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}