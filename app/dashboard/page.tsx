import { createSupabaseServerClient } from "@/lib/supabase-server";
import BookmarkForm from "@/components/bookmarks/BookmarkForm";
import BookmarkList from "@/components/bookmarks/BookmarkList";

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: bookmarks } = await supabase
    .from("bookmarks")
    .select("*")
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false });

  return (
    <>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-3xl p-10 shadow-lg mb-12">
        <h2 className="text-3xl font-semibold mb-2">
          Welcome back 👋
        </h2>
        <p className="text-white/90">
          Manage your saved links with simplicity and power.
        </p>
      </div>

      {/* Grid */}
      <div className="grid md:grid-cols-2 gap-10">

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">
            Add Bookmark
          </h3>
          <BookmarkForm userId={user!.id} />
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold mb-6">
            Your Bookmarks
          </h3>
          <BookmarkList userId={user!.id} />
        </div>

      </div>
    </>
  );
}
