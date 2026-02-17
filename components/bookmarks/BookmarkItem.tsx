"use client";

import { Bookmark } from "@/types/bookmark";

type Props = {
  bookmark: Bookmark;
  onToggleFavorite: (id: string, next: boolean) => void;
  onTogglePinned: (id: string, next: boolean) => void;
  onDelete: (id: string) => void;
};

export default function BookmarkItem({
  bookmark,
  onToggleFavorite,
  onTogglePinned,
  onDelete,
}: Props) {
  return (
    <div className="group rounded-2xl border border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 p-4 shadow-sm hover:shadow-md transition-all">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h4 className="font-semibold text-gray-900 dark:text-white truncate">
            {bookmark.title}
          </h4>
          <a
            href={bookmark.url}
            target="_blank"
            className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline break-all"
          >
            {bookmark.url}
          </a>
          {bookmark.category && (
            <span className="inline-flex mt-2 text-xs px-2 py-1 rounded-full bg-indigo-50 text-indigo-700 dark:bg-indigo-950/50 dark:text-indigo-300">
              {bookmark.category}
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            aria-pressed={bookmark.is_pinned}
            onClick={() => onTogglePinned(bookmark.id, !bookmark.is_pinned)}
            type="button"
            className={`px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
              bookmark.is_pinned
                ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-200"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            📌 {bookmark.is_pinned ? "Pinned" : "Pin"}
          </button>

          <button
            aria-pressed={bookmark.is_favorite}
            onClick={() => onToggleFavorite(bookmark.id, !bookmark.is_favorite)}
            type="button"
            className={`px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
              bookmark.is_favorite
                ? "bg-pink-100 text-pink-700 dark:bg-pink-900/40 dark:text-pink-200"
                : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
            }`}
          >
            ⭐ {bookmark.is_favorite ? "Fav" : "Star"}
          </button>

          <button
            onClick={() => onDelete(bookmark.id)}
            type="button"
            className="px-2.5 py-2 rounded-xl text-xs font-medium bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}