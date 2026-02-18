"use server";

import { createSupabaseRouteHandlerClient } from "@/lib/supabase-server";

export async function signUpUser(email: string, password: string) {
  const supabase = await createSupabaseRouteHandlerClient();
  
  return await supabase.auth.signUp({
    email,
    password,
  });
}

export async function signInUser(email: string, password: string) {
  const supabase = await createSupabaseRouteHandlerClient();
  
  return await supabase.auth.signInWithPassword({
    email,
    password,
  });
}