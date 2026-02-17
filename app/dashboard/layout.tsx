import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Sticky Navbar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-10 py-4 flex justify-between items-center">

        <h1 className="text-xl font-bold text-gray-800 tracking-tight">
          Smart Bookmark
        </h1>

        <div className="flex items-center gap-6">

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold">
              {user.email?.charAt(0).toUpperCase()}
            </div>
            <span className="text-sm text-gray-600">
              {user.email}
            </span>
          </div>

          <form
            action={async () => {
              "use server";
              const supabase = await createSupabaseServerClient();
              await supabase.auth.signOut();
              redirect("/login");
            }}
          >
            <button className="text-sm bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors">
              Logout
            </button>
          </form>

        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-6xl mx-auto px-10 mt-10">
        {children}
      </div>
    </div>
  );
}
