"use client";

import { supabase } from "@/lib/supabase-client";

export default function LoginPage() {
  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 relative overflow-hidden">

      {/* Decorative Blobs */}
      <div className="absolute w-[500px] h-[500px] bg-white/20 blur-3xl rounded-full -top-32 -left-32"></div>
      <div className="absolute w-[400px] h-[400px] bg-pink-300/20 blur-3xl rounded-full bottom-0 right-0"></div>

      {/* Glass Card */}
      <div className="relative backdrop-blur-xl bg-white/10 border border-white/20 shadow-2xl rounded-3xl p-12 w-[400px] text-white">

        <h1 className="text-4xl font-bold text-center mb-3 tracking-tight">
          Smart Bookmark
        </h1>

        <p className="text-center text-white/80 mb-10">
          Save. Organize. Access Anywhere.
        </p>

        <button
          onClick={handleGoogleLogin}
          className="w-full flex items-center justify-center gap-3 bg-white text-black font-semibold py-3 rounded-xl shadow-lg hover:shadow-2xl hover:scale-[1.02] transition-all duration-200"
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Continue with Google
        </button>

        <p className="text-xs text-white/60 text-center mt-8">
          Secure login powered by Google OAuth
        </p>
      </div>
    </div>
  );
}
