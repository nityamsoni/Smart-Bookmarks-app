"use client";

import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase-client";
import { useAppDispatch, useAppSelector } from "@/lib/store/hooks";
import { toggleTheme } from "@/lib/store/theme-slice";

export default function DashboardNavbar({
  userEmail,
}: {
  userEmail: string;
}) {
  const isDark = useAppSelector((state) => state.theme.isDark);
  const dispatch = useAppDispatch();
  const router = useRouter();

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  return (
    <div className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-10 py-4 flex justify-between items-center transition-colors">

      <h1 className="text-xl font-bold tracking-tight text-gray-800 dark:text-white">
        Smart Bookmark
      </h1>

      <div className="flex items-center gap-6">

       

        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
            {userEmail?.charAt(0).toUpperCase()}
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {userEmail}
          </span>
        </div>

        <button
          onClick={handleLogout}
          className="px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-medium transition-colors"
        >
          Logout
        </button>

      </div>
    </div>
  );
}
