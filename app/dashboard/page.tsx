import { createSupabaseServerClient } from "@/lib/supabase-server";
import BookmarkForm from "@/components/bookmarks/BookmarkForm";
import BookmarkList from "@/components/bookmarks/BookmarkList";

export default async function Dashboard() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();

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
    <div className="space-y-6">

      {/* ── Hero banner ── */}
      <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-br from-indigo-950/60 via-[#0d1120] to-[#0a0d18] p-8 md:p-10">
        {/* Glow orbs inside card */}
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-indigo-600/20 blur-[80px] pointer-events-none" />
        <div className="absolute -bottom-12 left-10 w-40 h-40 rounded-full bg-cyan-500/10 blur-[60px] pointer-events-none" />
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />

        <div className="relative flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <p className="text-indigo-400/70 text-xs font-semibold uppercase tracking-[0.2em] mb-2">
              ✦ Dashboard
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
              Hey, {firstName} 👋
            </h2>
            <p className="mt-2 text-white/35 text-sm max-w-xs">
              {total === 0
                ? "Start saving your favourite links below."
                : `You have ${total} bookmark${total !== 1 ? "s" : ""} saved.`}
            </p>
          </div>

          {/* Stat pills */}
          <div className="flex gap-3 flex-wrap">
            <HeroPill value={total} label="Saved" glow="indigo" />
            <HeroPill value={favorites} label="Favorites" glow="rose" />
            <HeroPill value={pinned} label="Pinned" glow="amber" />
          </div>
        </div>
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-3 gap-4">
        <StatCard
          title="Total"
          value={total}
          accent="#6366f1"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
          }
        />
        <StatCard
          title="Favorites"
          value={favorites}
          accent="#f43f5e"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          }
        />
        <StatCard
          title="Pinned"
          value={pinned}
          accent="#f59e0b"
          icon={
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          }
        />
      </div>

      {/* ── Main grid ── */}
      <div className="grid md:grid-cols-[360px_1fr] gap-5 items-start">

        {/* Add bookmark panel */}
        <div className="sticky top-6 space-y-4">
          <DarkPanel label="Add Bookmark" icon="+" accentColor="indigo">
            { /* @ts-ignore s*/}
            <BookmarkForm userId={user!.id} />
          </DarkPanel>

          {/* Tip card */}
          <div className="rounded-xl border border-cyan-500/15 bg-cyan-950/20 px-4 py-3">
            <p className="text-xs text-cyan-300/50 leading-relaxed">
              <span className="text-cyan-400/80 font-semibold">💡 Tip —</span> Add a category like{" "}
              <em className="text-cyan-300/70">Design</em> or <em className="text-cyan-300/70">Dev</em>{" "}
              to filter your bookmarks instantly.
            </p>
          </div>
        </div>

        {/* Bookmark list panel */}
        <DarkPanel
          label="Your Bookmarks"
          count={total}
          icon="☰"
          accentColor="violet"
        >
          <BookmarkList userId={user!.id} />
        </DarkPanel>
      </div>
    </div>
  );
}

/* ── Sub-components ── */

function HeroPill({ value, label, glow }: { value: number; label: string; glow: "indigo" | "rose" | "amber" }) {
  const colors = {
    indigo: "border-indigo-500/25 bg-indigo-500/10 text-indigo-300",
    rose:   "border-rose-500/25 bg-rose-500/10 text-rose-300",
    amber:  "border-amber-500/25 bg-amber-500/10 text-amber-300",
  };
  return (
    <div className={`flex flex-col items-center justify-center px-5 py-3 rounded-xl border ${colors[glow]} min-w-[80px]`}>
      <span className="text-2xl font-bold tabular-nums">{value}</span>
      <span className="text-[10px] font-medium uppercase tracking-widest opacity-60 mt-0.5">{label}</span>
    </div>
  );
}

function StatCard({ title, value, accent, icon }: { title: string; value: number; accent: string; icon: React.ReactNode }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.05] bg-white/[0.025] px-5 py-5 group hover:border-white/[0.08] transition-all duration-300">
      {/* Glow dot */}
      <div
        className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full opacity-60"
        style={{ backgroundColor: accent, boxShadow: `0 0 6px ${accent}` }}
      />
      <p className="text-[11px] uppercase tracking-widest font-semibold mb-3" style={{ color: `${accent}99` }}>
        {title}
      </p>
      <p className="text-4xl font-bold text-white tabular-nums leading-none">{value}</p>
      <svg
        className="absolute bottom-3 right-3 w-8 h-8 opacity-10"
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
        style={{ color: accent }}
      >
        {icon}
      </svg>
    </div>
  );
}

function DarkPanel({
  label, icon, count, accentColor, children
}: {
  label: string;
  icon: string;
  count?: number;
  accentColor: "indigo" | "violet";
  children: React.ReactNode;
}) {
  const accent = {
    indigo: { border: "border-indigo-500/20", header: "border-indigo-500/15", iconBg: "bg-indigo-500/15 text-indigo-300", badge: "bg-indigo-500/20 text-indigo-300" },
    violet: { border: "border-violet-500/20", header: "border-violet-500/15", iconBg: "bg-violet-500/15 text-violet-300", badge: "bg-violet-500/20 text-violet-300" },
  }[accentColor];

  return (
    <div className={`rounded-2xl border ${accent.border} bg-white/[0.025] overflow-hidden`}>
      {/* Panel header */}
      <div className={`flex items-center gap-2.5 px-5 py-3.5 border-b ${accent.header} bg-white/[0.015]`}>
        <span className={`w-6 h-6 rounded-lg text-xs font-bold flex items-center justify-center ${accent.iconBg}`}>
          {icon}
        </span>
        <span className="text-sm font-semibold text-white/80">{label}</span>
        {count !== undefined && (
          <span className={`ml-auto text-[11px] font-bold px-2 py-0.5 rounded-full ${accent.badge}`}>
            {count}
          </span>
        )}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}