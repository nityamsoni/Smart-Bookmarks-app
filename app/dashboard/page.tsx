import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase-server";
import BookmarkForm from "@/components/bookmarks/BookmarkForm";
import BookmarkList from "@/components/bookmarks/BookmarkList";

export default async function Dashboard() {
  const supabase = createSupabaseServerClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen p-10 max-w-xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">
          Welcome {session.user.email}
        </h1>

        <form
          action={async () => {
            "use server";
            const supabase = createSupabaseServerClient();
            await supabase.auth.signOut();
            redirect("/login");
          }}
        >
          <button className="text-sm bg-red-500 text-white px-3 py-1 rounded">
            Logout
          </button>
        </form>
      </div>

      <BookmarkForm userId={session.user.id} />
      <BookmarkList userId={session.user.id} />
    </div>
  );
}
