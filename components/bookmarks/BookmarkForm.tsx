"use client";

import { addBookmark } from "@/app/dashboard/action";
import { useRef } from "react";

export default function BookmarkForm() {
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(formData: FormData) {
    await addBookmark(formData);
    formRef.current?.reset();
  }

  return (
    <form
      ref={formRef}
      action={handleSubmit}
      className="space-y-4"
    >
      <input
        name="title"
        placeholder="Title"
        required
        className="border p-2 w-full rounded"
      />

      <input
        name="url"
        placeholder="https://example.com"
        required
        className="border p-2 w-full rounded"
      />

      <input
        name="category"
        placeholder="Category (Optional)"
        className="border p-2 w-full rounded"
      />

      <button className="bg-indigo-600 text-white px-4 py-2 rounded">
        Add Bookmark
      </button>
    </form>
  );
}
