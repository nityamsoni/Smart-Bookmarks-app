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

  return (
    <ReduxProvider>
      <div className="min-h-screen bg-[#f6f7fb] dark:bg-gray-950 transition-colors">
        <DashboardNavbar userEmail={user.email || ""} />

        {/* Page wrapper with max width + padding */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 py-8 pb-20">
          {children}
        </main>
      </div>
    </ReduxProvider>
  );
}