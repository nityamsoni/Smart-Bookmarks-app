"use client";

import { addBookmark } from "@/app/dashboard/action";
import { signInUser, signUpUser } from "@/app/actions/auth";
import { useRef, useState } from "react";

export default function BookmarkForm({ userId }: { userId: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setSuccess(false);
    try {
      await addBookmark(formData);
      formRef.current?.reset();
      window.dispatchEvent(new Event("bookmarks:changed"));
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2500);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-3">

      {/* Title input */}
      <DarkInput
        name="title"
        placeholder="Bookmark title"
        required
        icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
        }
      />

      {/* URL input */}
      <DarkInput
        name="url"
        type="url"
        placeholder="https://example.com"
        required
        icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
        }
      />

      {/* Category input */}
      <DarkInput
        name="category"
        placeholder="Category (optional)"
        icon={
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
            d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        }
      />

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={`
          relative w-full py-2.5 px-4 rounded-xl text-sm font-semibold
          transition-all duration-200 overflow-hidden
          disabled:opacity-60 disabled:cursor-not-allowed
          ${success
            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
            : "bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/25 hover:border-indigo-400/40 active:scale-[0.98]"
          }
        `}
      >
        {/* Hover shimmer */}
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full hover:translate-x-full transform transition-transform duration-700" />

        <span className={`flex items-center justify-center gap-2 transition-opacity ${loading ? "opacity-0" : "opacity-100"}`}>
          {success ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              Saved!
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add Bookmark
            </>
          )}
        </span>

        {loading && (
          <span className="absolute inset-0 flex items-center justify-center">
            <svg className="w-4 h-4 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          </span>
        )}
      </button>
    </form>
  );
}

/* Dark-styled input atom */
function DarkInput({
  name, placeholder, required, type = "text", icon
}: {
  name: string;
  placeholder: string;
  required?: boolean;
  type?: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="relative group">
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <svg
          className="w-4 h-4 text-white/20 group-focus-within:text-indigo-400 transition-colors duration-200"
          fill="none" stroke="currentColor" viewBox="0 0 24 24"
        >
          {icon}
        </svg>
      </div>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        className="
          w-full pl-9 pr-4 py-2.5 rounded-xl
          bg-white/[0.04] border border-white/[0.07]
          text-sm text-white/80 placeholder-white/20
          focus:outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/40
          focus:bg-white/[0.06] transition-all duration-200
        "
      />
    </div>
  );
}