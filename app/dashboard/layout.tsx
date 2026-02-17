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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 transition-colors">
        <DashboardNavbar userEmail={user.email || ""} />
        <div className="max-w-6xl mx-auto px-10 mt-10 pb-20">
          {children}
        </div>
      </div>
    </ReduxProvider>
  );
}
