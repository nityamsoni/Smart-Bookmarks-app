"use client";

import { useEffect, useMemo, useState } from "react";
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
  const [statusFilter, setStatusFilter] =
    useState<"all" | "pinned" | "favorite">("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [loading, setLoading] = useState(true);

  // 🔥 INITIAL FETCH + REALTIME
  useEffect(() => {
    async function load() {
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
    }

    load();

    const channel = supabase
      .channel(`bookmarks-realtime-${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "bookmarks",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log("Realtime:", payload);

          if (payload.eventType === "INSERT") {
            setBookmarks((prev) => {
              if (prev.some((b) => b.id === payload.new.id)) return prev;
              return [payload.new as Bookmark, ...prev];
            });
          }

          if (payload.eventType === "UPDATE") {
            setBookmarks((prev) =>
              prev.map((b) =>
                b.id === payload.new.id
                  ? ({ ...b, ...payload.new } as Bookmark)
                  : b
              )
            );
          }

          if (payload.eventType === "DELETE") {
            setBookmarks((prev) =>
              prev.filter((b) => b.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // 🔥 ACTIONS
  const deleteBookmark = async (id: string) => {
    await supabase
      .from("bookmarks")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);
  };

  const togglePinned = async (id: string, next: boolean) => {
    await supabase
      .from("bookmarks")
      .update({ is_pinned: next })
      .eq("id", id)
      .eq("user_id", userId);
  };

  const toggleFavorite = async (id: string, next: boolean) => {
    await supabase
      .from("bookmarks")
      .update({ is_favorite: next })
      .eq("id", id)
      .eq("user_id", userId);
  };

  // 🔥 FILTERS
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

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const safePage = Math.min(page, totalPages);
  const startIndex = (safePage - 1) * pageSize;
  const paged = filtered.slice(startIndex, startIndex + pageSize);
  const pinned = paged.filter((b) => b.is_pinned);
  const others = paged.filter((b) => !b.is_pinned);

  useEffect(() => {
    setPage(1);
  }, [search, category, statusFilter, pageSize]);

  if (loading) {
    return <div className="text-white/30">Loading...</div>;
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <input
        placeholder="Search bookmarks…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full px-4 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-sm text-white/70"
      />

      {/* Status Filter */}
      <div className="flex gap-2">
        {(["all", "pinned", "favorite"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setStatusFilter(f)}
            className={`px-3 py-1 rounded-lg text-xs ${
              statusFilter === f
                ? "bg-indigo-500/20 text-indigo-300"
                : "bg-white/[0.03] text-white/30"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bookmark List */}
      {filtered.length === 0 && (
        <div className="text-white/30 text-center py-10">
          No bookmarks found
        </div>
      )}

      {filtered.length > 0 && statusFilter === "all" && (
        <>
          {pinned.length > 0 && (
            <>
              <p className="text-xs uppercase text-white/30">📌 Pinned</p>
              {pinned.map((b) => (
                <BookmarkItem
                  key={b.id}
                  bookmark={b}
                  onTogglePinned={togglePinned}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deleteBookmark}
                />
              ))}
            </>
          )}

          {others.length > 0 && (
            <>
              <p className="text-xs uppercase text-white/30">
                Other Bookmarks
              </p>
              {others.map((b) => (
                <BookmarkItem
                  key={b.id}
                  bookmark={b}
                  onTogglePinned={togglePinned}
                  onToggleFavorite={toggleFavorite}
                  onDelete={deleteBookmark}
                />
              ))}
            </>
          )}
        </>
      )}

      {filtered.length > 0 && statusFilter !== "all" && (
        <>
          {filtered.map((b) => (
            <BookmarkItem
              key={b.id}
              bookmark={b}
              onTogglePinned={togglePinned}
              onToggleFavorite={toggleFavorite}
              onDelete={deleteBookmark}
            />
          ))}
        </>
      )}
    </div>
  );
}
