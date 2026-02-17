"use client";

import { addBookmark } from "@/app/dashboard/action";
import { useRef } from "react";

export default function BookmarkForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await addBookmark(formData);
    formRef.current?.reset();
    window.dispatchEvent(new Event("bookmarks:changed"));
  }

  return (
    <form ref={formRef} action={handleSubmit} className="space-y-4">
      <input
        name="title"
        placeholder="Title"
        required
        className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 w-full rounded-xl"
      />

      <input
        name="url"
        placeholder="https://example.com"
        required
        className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 w-full rounded-xl"
      />

      <input
        name="category"
        placeholder="Category (Optional)"
        className="border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3 w-full rounded-xl"
      />

      <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl transition-colors">
        Add Bookmark
      </button>
    </form>
  );
}
