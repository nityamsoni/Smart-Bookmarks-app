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

    if (error) { console.error("Failed to fetch bookmarks", error); return; }
    if (data) setBookmarks(data as Bookmark[]);
    setLoading(false);
  }, [userId]);

  const deleteBookmark = async (id: string) => {
    const { error } = await supabase.from("bookmarks").delete().eq("id", id).eq("user_id", userId);
    if (error) { console.error("Failed to delete bookmark", error); return; }
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const togglePinned = async (id: string, next: boolean) => {
    const { data, error } = await supabase
      .from("bookmarks").update({ is_pinned: next })
      .eq("id", id).eq("user_id", userId)
      .select("id, is_pinned").single();
    if (error) { console.error(error); return; }
    if (data) setBookmarks((prev) => prev.map((b) => b.id === id ? { ...b, is_pinned: data.is_pinned } : b));
    else fetchBookmarks();
  };

  const toggleFavorite = async (id: string, next: boolean) => {
    const { data, error } = await supabase
      .from("bookmarks").update({ is_favorite: next })
      .eq("id", id).eq("user_id", userId)
      .select("id, is_favorite").single();
    if (error) { console.error(error); return; }
    if (data) setBookmarks((prev) => prev.map((b) => b.id === id ? { ...b, is_favorite: data.is_favorite } : b));
    else fetchBookmarks();
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
      const matchesTerm = !term || b.title.toLowerCase().includes(term) || b.url.toLowerCase().includes(term) || (b.category || "").toLowerCase().includes(term);
      const matchesCategory = category === "all" || (b.category || "") === category;
      const matchesStatus = statusFilter === "all" || (statusFilter === "pinned" && b.is_pinned) || (statusFilter === "favorite" && b.is_favorite);
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

  /* ── Loading skeleton ── */
  if (loading) {
    return (
      <div className="space-y-2.5">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="h-[72px] rounded-xl border border-white/[0.05] bg-white/[0.02] animate-pulse"
            style={{ animationDelay: `${i * 80}ms` }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">

      {/* ── Search + category ── */}
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1 group">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <svg className="w-3.5 h-3.5 text-white/20 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            placeholder="Search bookmarks…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-8 pr-8 py-2 rounded-xl bg-white/[0.04] border border-white/[0.07] text-sm text-white/70 placeholder-white/20
              focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/30 focus:bg-white/[0.06] transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute inset-y-0 right-3 flex items-center text-white/20 hover:text-white/50 transition-colors"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        {categories.length > 1 && (
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded-xl bg-white/[0.04] border border-white/[0.07] text-sm text-white/50 px-3 py-2
              focus:outline-none focus:ring-1 focus:ring-indigo-500/40 transition-all"
          >
            {categories.map((c) => (
              <option key={c} value={c} className="bg-[#0d1120] text-white">
                {c === "all" ? "All categories" : c}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* ── Status filter pills ── */}
      <div className="flex items-center gap-2">
        {(["all", "pinned", "favorite"] as const).map((f) => {
          const isActive = statusFilter === f;
          const styles = {
            all:      isActive ? "bg-indigo-500/20 text-indigo-300 border-indigo-500/30" : "",
            pinned:   isActive ? "bg-amber-500/20 text-amber-300 border-amber-500/30" : "",
            favorite: isActive ? "bg-rose-500/20 text-rose-300 border-rose-500/30" : "",
          }[f];

          return (
            <button
              key={f}
              type="button"
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1 rounded-lg text-[11px] font-semibold border transition-all duration-150
                ${isActive ? styles : "bg-white/[0.03] text-white/30 border-white/[0.06] hover:border-white/[0.12] hover:text-white/50"}
              `}
            >
              {f === "all" ? "All" : f === "pinned" ? "📌 Pinned" : "♥ Favorites"}
            </button>
          );
        })}

        <span className="ml-auto text-[11px] text-white/20 tabular-nums">
          {filtered.length} result{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* ── Empty state ── */}
      {filtered.length === 0 && (
        <div className="py-14 flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-2xl border border-white/[0.05] bg-white/[0.03] flex items-center justify-center mb-4">
            <svg className="w-7 h-7 text-white/10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <p className="text-sm font-medium text-white/30">No bookmarks found</p>
          <p className="text-xs text-white/15 mt-1">
            {search ? `No results for "${search}"` : "Add your first bookmark using the form"}
          </p>
        </div>
      )}

      {/* ── Bookmark groups ── */}
      {filtered.length > 0 && statusFilter === "all" && (
        <>
          {pinned.length > 0 && (
            <section className="space-y-2">
              <SectionLabel>📌 Pinned</SectionLabel>
              {pinned.map((b) => <BookmarkItem key={b.id} bookmark={b} onTogglePinned={togglePinned} onToggleFavorite={toggleFavorite} onDelete={deleteBookmark} />)}
            </section>
          )}
          {others.length > 0 && (
            <section className="space-y-2">
              {pinned.length > 0 && <SectionLabel>Other Bookmarks</SectionLabel>}
              {others.map((b) => <BookmarkItem key={b.id} bookmark={b} onTogglePinned={togglePinned} onToggleFavorite={toggleFavorite} onDelete={deleteBookmark} />)}
            </section>
          )}
        </>
      )}

      {filtered.length > 0 && statusFilter !== "all" && (
        <div className="space-y-2">
          {filtered.map((b) => <BookmarkItem key={b.id} bookmark={b} onTogglePinned={togglePinned} onToggleFavorite={toggleFavorite} onDelete={deleteBookmark} />)}
        </div>
      )}

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-3 border-t border-white/[0.05]">
          <span className="text-[11px] text-white/20">
            {startIndex + 1}–{Math.min(startIndex + pageSize, filtered.length)} of {filtered.length}
          </span>
          <div className="flex items-center gap-1.5">
            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="rounded-lg bg-white/[0.04] border border-white/[0.07] text-[11px] text-white/40 px-2 py-1 focus:outline-none"
            >
              {[6, 8, 12, 16].map((s) => <option key={s} value={s} className="bg-[#0d1120]">{s}/page</option>)}
            </select>

            <PageBtn onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage === 1}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </PageBtn>
            <span className="text-[11px] text-white/30 px-1">{safePage}/{totalPages}</span>
            <PageBtn onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage === totalPages}>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </PageBtn>
          </div>
        </div>
      )}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-white/25 pb-1">
      {children}
    </p>
  );
}

function PageBtn({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="w-7 h-7 flex items-center justify-center rounded-lg border border-white/[0.07] bg-white/[0.03] text-white/30 disabled:opacity-30 disabled:cursor-not-allowed hover:border-white/[0.12] hover:text-white/50 transition-all"
    >
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">{children}</svg>
    </button>
  );
}