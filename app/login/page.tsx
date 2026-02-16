"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase-client";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        router.replace("/dashboard");
      }
    };

    checkSession();
  }, [router]);

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/dashboard`,
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white shadow-lg rounded-xl p-10 w-full max-w-md text-center">
        <h1 className="text-2xl font-bold mb-2">Smart Bookmark</h1>
        <p className="text-gray-500 mb-8">
          Sign in with Google to manage your bookmarks
        </p>

        <button
          onClick={handleLogin}
          className="w-full flex items-center justify-center gap-3 bg-black text-white py-3 rounded-lg hover:bg-gray-800 transition"
        >
          🔐 Continue with Google
        </button>

        <p className="text-xs text-gray-400 mt-6">
          Google OAuth only • No password required
        </p>
      </div>
    </div>
  );
}
