"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useState } from "react";

export default function DashboardNavbar({ userEmail, initial }: { userEmail: string; initial: string }) {
  const router = useRouter();
  const [loggingOut, setLoggingOut] = useState(false);

  async function handleLogout() {
    setLoggingOut(true);
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }


  return (
    <header className="sticky top-0 z-50">
      {/* Backdrop blur layer */}
      <div className="absolute inset-0 bg-[#080b12]/80 backdrop-blur-xl border-b border-white/[0.05]" />

      {/* Top accent hairline */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/40 to-transparent" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 h-14 flex items-center justify-between gap-4">

        {/* ── Logo ── */}
        <div className="flex items-center gap-2.5">
          {/* Icon mark */}
          <div className="relative flex-shrink-0">
            <div className="absolute inset-0 rounded-lg bg-indigo-500/30 blur-sm" />
            <div className="relative w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2}
                  d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
              </svg>
            </div>
          </div>

          <span className="text-sm font-bold text-white/80 tracking-tight hidden sm:block">
            Smart<span className="text-indigo-400">Bookmark</span>
          </span>
        </div>

        {/* ── Right side ── */}
        <div className="flex items-center gap-3">

          {/* User pill */}
          <div className="flex items-center gap-2.5 pl-1 pr-3 py-1 rounded-full border border-white/[0.07] bg-white/[0.03]">
            {/* Avatar */}
            <div className="relative flex-shrink-0">
              <div className="absolute inset-0 rounded-full bg-indigo-500/30 blur-sm" />
              <div
                className="relative w-6 h-6 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm"
                suppressHydrationWarning
              >
                {initial}
              </div>
            </div>
            {/* Email — hide on small screens */}
            <span
              className="text-xs text-white/35 hidden md:block max-w-[180px] truncate"
              suppressHydrationWarning
            >
              {userEmail}
            </span>
          </div>

          {/* Logout button */}
          <button
            onClick={handleLogout}
            disabled={loggingOut}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl
              border border-red-500/20 bg-red-500/10 text-red-400 text-xs font-semibold
              hover:bg-red-500/20 hover:border-red-500/30 hover:text-red-300
              active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed
              transition-all duration-150"
          >
            {loggingOut ? (
              <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            )}
            {loggingOut ? "Signing out…" : "Sign out"}
          </button>

        </div>
      </div>
    </header>
  );
}