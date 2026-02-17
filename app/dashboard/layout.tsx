import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import DashboardNavbar from "@/components/DashboardNavbar";
import ReduxProvider from "@/components/ReduxProvider";

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

  const initial = user?.email ? user.email.charAt(0).toUpperCase() : "?";

  return (
    <ReduxProvider>
      <div className="min-h-screen bg-[#080b12] relative overflow-x-hidden">

        {/* ── Ambient background atmosphere ── */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-200px] left-[-150px] w-[600px] h-[600px] rounded-full bg-indigo-900/20 blur-[140px]" />
          <div className="absolute top-[30%] right-[-100px] w-[400px] h-[400px] rounded-full bg-cyan-900/15 blur-[120px]" />
          <div className="absolute bottom-[-100px] left-[30%] w-[500px] h-[500px] rounded-full bg-violet-900/15 blur-[160px]" />
        </div>

        {/* ── Subtle dot-grid texture ── */}
        <div
          className="fixed inset-0 pointer-events-none z-0 opacity-[0.018]"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.9) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
          }}
        />

        <div className="relative z-10">
          <DashboardNavbar userEmail={user.email || ""} initial={initial} />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-24">
            {children}
          </main>
        </div>
      </div>
    </ReduxProvider>
  );
}