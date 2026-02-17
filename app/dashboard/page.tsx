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

  const total = bookmarks?.length || 0;
  const favorites =
    bookmarks?.filter((b) => b.is_favorite).length || 0;
  const pinned =
    bookmarks?.filter((b) => b.is_pinned).length || 0;

  return (
    <>
      {/* Stats Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-10">
        <StatCard title="Total Bookmarks" value={total} />
        <StatCard title="Favorites" value={favorites} />
        <StatCard title="Pinned" value={pinned} />
      </div>

      {/* Hero */}
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

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h3 className="text-lg font-semibold mb-6 dark:text-white">
            Add Bookmark
          </h3>
          <BookmarkForm userId={user!.id} />
        </div>

        <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-800 transition-colors">
          <h3 className="text-lg font-semibold mb-6 dark:text-white">
            Your Bookmarks
          </h3>
          <BookmarkList userId={user!.id} />
        </div>

      </div>
    </>
  );
}

function StatCard({ title, value }: any) {
  return (
    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow border border-gray-100 dark:border-gray-800 transition-colors">
      <p className="text-sm text-gray-500 dark:text-gray-400">
        {title}
      </p>
      <p className="text-2xl font-bold mt-2 dark:text-white">
        {value}
      </p>
    </div>
  );
}
