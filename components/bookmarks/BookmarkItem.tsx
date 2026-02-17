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

export default function BookmarkItem({ bookmark, onToggleFavorite, onTogglePinned, onDelete }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [exiting, setExiting] = useState(false);
  const favicon = getFavicon(bookmark.url);
  const domain = getDomain(bookmark.url);

  const handleDelete = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    setExiting(true);
    setTimeout(() => onDelete(bookmark.id), 280);
  };

  return (
    <div
      className={`
        group relative rounded-xl border overflow-hidden transition-all duration-300
        ${exiting ? "opacity-0 scale-95 -translate-y-1" : "opacity-100 scale-100"}
        ${bookmark.is_pinned
          ? "border-amber-500/20 bg-amber-500/[0.04]"
          : "border-white/[0.06] bg-white/[0.025]"
        }
        hover:border-indigo-500/25 hover:bg-white/[0.04]
        hover:shadow-[0_0_20px_rgba(99,102,241,0.06)]
      `}
    >
      {/* Pinned top glow line */}
      {bookmark.is_pinned && (
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
      )}

      <div className="flex items-start gap-3 p-3.5">

        {/* Favicon */}
        <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-lg bg-white/[0.06] border border-white/[0.06] flex items-center justify-center overflow-hidden">
          {favicon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={favicon}
              alt=""
              width={18}
              height={18}
              onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
            />
          ) : (
            <span className="text-sm">🔗</span>
          )}
        </div>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 justify-between">
            <div className="min-w-0 flex-1">
              <h4 className="text-sm font-semibold text-white/80 truncate leading-snug">
                {bookmark.title}
              </h4>
              <a
                href={bookmark.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-indigo-400/60 hover:text-indigo-400 transition-colors truncate block mt-0.5"
              >
                {domain}
              </a>
            </div>

            {/* Status badges */}
            <div className="flex items-center gap-1 flex-shrink-0">
              {bookmark.is_favorite && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/20">
                  ♥
                </span>
              )}
              {bookmark.is_pinned && (
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 border border-amber-500/20">
                  📌
                </span>
              )}
              {bookmark.category && (
                <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/15">
                  {bookmark.category}
                </span>
              )}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-1.5 mt-2.5 flex-wrap">

            {/* Pin */}
            <ActionButton
              onClick={() => onTogglePinned(bookmark.id, !bookmark.is_pinned)}
              active={bookmark.is_pinned}
              activeClass="bg-amber-500/15 text-amber-300 border-amber-500/25"
              inactiveClass="text-white/30 border-white/[0.07] hover:text-amber-400 hover:border-amber-500/20 hover:bg-amber-500/10"
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  fill={bookmark.is_pinned ? "currentColor" : "none"} />
              }
              label={bookmark.is_pinned ? "Pinned" : "Pin"}
            />

            {/* Favorite */}
            <ActionButton
              onClick={() => onToggleFavorite(bookmark.id, !bookmark.is_favorite)}
              active={bookmark.is_favorite}
              activeClass="bg-rose-500/15 text-rose-300 border-rose-500/25"
              inactiveClass="text-white/30 border-white/[0.07] hover:text-rose-400 hover:border-rose-500/20 hover:bg-rose-500/10"
              icon={
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  fill={bookmark.is_favorite ? "currentColor" : "none"} />
              }
              label={bookmark.is_favorite ? "Loved" : "Like"}
            />

            {/* Open link */}
            <a
              href={bookmark.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all duration-150
                text-white/30 border-white/[0.07] hover:text-cyan-400 hover:border-cyan-500/20 hover:bg-cyan-500/10 ml-auto"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Visit
            </a>

            {/* Delete */}
            <button
              type="button"
              onClick={handleDelete}
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all duration-150
                ${confirmDelete
                  ? "bg-red-500/20 text-red-400 border-red-500/30 animate-pulse"
                  : "text-white/20 border-white/[0.06] hover:text-red-400 hover:border-red-500/20 hover:bg-red-500/10"
                }`}
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {confirmDelete ? "Sure?" : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

/* Reusable action button atom */
function ActionButton({
  onClick, active, activeClass, inactiveClass, icon, label
}: {
  onClick: () => void;
  active: boolean;
  activeClass: string;
  inactiveClass: string;
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-medium border transition-all duration-150
        ${active ? activeClass : inactiveClass}`}
    >
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        {icon}
      </svg>
      {label}
    </button>
  );
}