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
  const favorites = bookmarks?.filter((b) => b.is_favorite).length || 0;
  const pinned = bookmarks?.filter((b) => b.is_pinned).length || 0;
  const firstName = user?.user_metadata?.full_name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-500 to-violet-600 p-8 md:p-10 text-white shadow-xl shadow-indigo-500/20">
        {/* Decorative circles */}
        <div className="absolute -top-10 -right-10 w-52 h-52 rounded-full bg-white/5 blur-xl pointer-events-none" />
        <div className="absolute -bottom-14 -left-8 w-64 h-64 rounded-full bg-violet-400/10 blur-2xl pointer-events-none" />
        <div className="absolute top-4 right-20 w-8 h-8 rounded-full bg-white/10 pointer-events-none" />
        <div className="absolute bottom-6 right-10 w-4 h-4 rounded-full bg-white/15 pointer-events-none" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-indigo-200 text-sm font-medium mb-1 tracking-wide uppercase">Dashboard</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Hey, {firstName} 👋
            </h2>
            <p className="mt-2 text-indigo-100/80 text-sm max-w-sm">
              You have <span className="font-semibold text-white">{total} bookmark{total !== 1 ? "s" : ""}</span> saved.
              {favorites > 0 && <> {favorites} marked as favorite.</>}
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            <StatPill label="Total" value={total} icon="🔗" color="bg-white/10 border-white/20" />
            <StatPill label="Favorites" value={favorites} icon="♥" color="bg-rose-400/20 border-rose-300/30" />
            <StatPill label="Pinned" value={pinned} icon="📌" color="bg-amber-400/20 border-amber-300/30" />
          </div>
        </div>
      </div>

      {/* Stat cards (detailed) */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total Bookmarks"
          value={total}
          icon={
            <svg className="w-5 h-5 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          }
          accent="indigo"
        />
        <StatCard
          title="Favorites"
          value={favorites}
          icon={
            <svg className="w-5 h-5 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          }
          accent="rose"
        />
        <StatCard
          title="Pinned"
          value={pinned}
          icon={
            <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
          }
          accent="amber"
        />
      </div>

      {/* Main content grid */}
      <div className="grid md:grid-cols-[380px_1fr] gap-6 items-start">
        {/* Add Bookmark Panel */}
        <div className="sticky top-6">
          <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 dark:bg-indigo-900/50 flex items-center justify-center">
                <svg className="w-4 h-4 text-indigo-600 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Add New Bookmark</h3>
            </div>
            <div className="p-6">
              <BookmarkForm userId={user!.id} />
            </div>
          </div>

          {/* Quick tip */}
          <div className="mt-4 rounded-2xl border border-indigo-100 dark:border-indigo-900/40 bg-indigo-50/60 dark:bg-indigo-950/30 p-4">
            <p className="text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed">
              <span className="font-semibold">💡 Tip:</span> Use categories to group your bookmarks by topic — like <em>Design</em>, <em>Dev</em>, or <em>Reading</em>.
            </p>
          </div>
        </div>

        {/* Bookmark List Panel */}
        <div className="rounded-2xl border border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-violet-100 dark:bg-violet-900/50 flex items-center justify-center">
              <svg className="w-4 h-4 text-violet-600 dark:text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Your Bookmarks</h3>
            <span className="ml-auto inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 dark:bg-indigo-900/60 dark:text-indigo-300">
              {total}
            </span>
          </div>
          <div className="p-6">
            <BookmarkList userId={user!.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatPill({ label, value, icon, color }: { label: string; value: number; icon: string; color: string }) {
  return (
    <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-white text-xs font-medium ${color}`}>
      <span>{icon}</span>
      <span>{value} {label}</span>
    </div>
  );
}

function StatCard({ title, value, icon, accent }: { title: string; value: number; icon: React.ReactNode; accent: "indigo" | "rose" | "amber" }) {
  const accentMap = {
    indigo: "from-indigo-50 dark:from-indigo-950/30 border-indigo-100 dark:border-indigo-900/40",
    rose: "from-rose-50 dark:from-rose-950/30 border-rose-100 dark:border-rose-900/40",
    amber: "from-amber-50 dark:from-amber-950/30 border-amber-100 dark:border-amber-900/40",
  };

  return (
    <div className={`rounded-2xl border bg-gradient-to-br ${accentMap[accent]} to-white dark:to-gray-900 p-5 shadow-sm`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">{title}</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white tabular-nums">{value}</p>
        </div>
        <div className="p-2 rounded-xl bg-white dark:bg-gray-800 shadow-sm border border-gray-100 dark:border-gray-700">
          {icon}
        </div>
      </div>
    </div>
  );
}