"use client";

import { Bookmark } from "@/types/bookmark";
import { useState } from "react";

type Props = {
  bookmark: Bookmark;
  onToggleFavorite: (id: string, next: boolean) => void;
  onTogglePinned: (id: string, next: boolean) => void;
  onDelete: (id: string) => void;
};

function getFavicon(url: string) {
  try {
    const domain = new URL(url).hostname;
    return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
  } catch {
    return null;
  }
}

function getDomain(url: string) {
  try {
    return new URL(url).hostname.replace("www.", "");
  } catch {
    return url;
  }
}

export default function BookmarkItem({
  bookmark,
  onToggleFavorite,
  onTogglePinned,
  onDelete,
}: Props) {
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const favicon = getFavicon(bookmark.url);
  const domain = getDomain(bookmark.url);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setDeleting(true);
    await onDelete(bookmark.id);
  };

  return (
    <div
      className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden
        ${deleting ? "opacity-0 scale-95 pointer-events-none" : "opacity-100 scale-100"}
        ${bookmark.is_pinned
          ? "border-amber-300/60 dark:border-amber-500/30 bg-gradient-to-br from-amber-50/80 via-white to-white dark:from-amber-950/20 dark:via-gray-900 dark:to-gray-900"
          : "border-gray-100 dark:border-gray-800/80 bg-white dark:bg-gray-900"
        }
        hover:shadow-[0_8px_30px_rgba(0,0,0,0.08)] dark:hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)]
        hover:-translate-y-0.5
      `}
    >
      {/* Pinned accent bar */}
      {bookmark.is_pinned && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-amber-400 via-orange-400 to-amber-400" />
      )}

      <div className="p-4 flex items-start gap-3">
        {/* Favicon */}
        <div className="flex-shrink-0 mt-0.5">
          <div className="w-9 h-9 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center overflow-hidden border border-gray-200/60 dark:border-gray-700/60">
            {favicon ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={favicon}
                alt=""
                width={20}
                height={20}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = "none";
                }}
              />
            ) : (
              <span className="text-base">🔗</span>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 truncate text-sm leading-tight mb-0.5">
                {bookmark.title}
              </h4>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-500 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors truncate block"
              >
                {domain}
              </a>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {bookmark.is_favorite && (
                <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-100 text-rose-600 dark:bg-rose-900/40 dark:text-rose-300 border border-rose-200/60 dark:border-rose-700/40">
                  ♥ fav
                </span>
              )}
              {bookmark.category && (
                <span className="inline-flex text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-300 border border-indigo-100 dark:border-indigo-800/60">
                  {bookmark.category}
                </span>
              )}
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex items-center gap-1.5 mt-3">
            {/* Pin */}
            <button
              type="button"
              onClick={() => onTogglePinned(bookmark.id, !bookmark.is_pinned)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 border
                ${bookmark.is_pinned
                  ? "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-700/50 hover:bg-amber-200 dark:hover:bg-amber-900/60"
                  : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-amber-50 hover:text-amber-600 hover:border-amber-200 dark:hover:bg-amber-900/20 dark:hover:text-amber-400"
                }`}
            >
              <svg className="w-3 h-3" fill={bookmark.is_pinned ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
              {bookmark.is_pinned ? "Pinned" : "Pin"}
            </button>

            {/* Favorite */}
            <button
              type="button"
              onClick={() => onToggleFavorite(bookmark.id, !bookmark.is_favorite)}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 border
                ${bookmark.is_favorite
                  ? "bg-rose-100 text-rose-600 border-rose-200 dark:bg-rose-900/40 dark:text-rose-300 dark:border-rose-700/50 hover:bg-rose-200 dark:hover:bg-rose-900/60"
                  : "bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-rose-50 hover:text-rose-500 hover:border-rose-200 dark:hover:bg-rose-900/20 dark:hover:text-rose-400"
                }`}
            >
              <svg className="w-3 h-3" fill={bookmark.is_favorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              {bookmark.is_favorite ? "Loved" : "Like"}
            </button>

            {/* Open */}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 border bg-gray-100 text-gray-500 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 dark:hover:bg-indigo-900/20 dark:hover:text-indigo-400 ml-auto"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit
            </a>

            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium transition-all duration-200 border
                ${confirmDelete
                  ? "bg-red-500 text-white border-red-500 animate-pulse"
                  : "bg-gray-100 text-gray-400 border-gray-200 dark:bg-gray-800 dark:text-gray-500 dark:border-gray-700 hover:bg-red-50 hover:text-red-500 hover:border-red-200 dark:hover:bg-red-900/20 dark:hover:text-red-400"
                }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {confirmDelete ? "Confirm?" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}