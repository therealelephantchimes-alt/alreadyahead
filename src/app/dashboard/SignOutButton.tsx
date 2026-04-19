"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export function SignOutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true);

      const supabase = createClient();
      await supabase.auth.signOut();

      router.push("/");
      router.refresh();
    } catch (error) {
      console.error("Sign out failed:", error);
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignOut}
      disabled={loading}
      className="w-full text-sm px-4 py-2 border border-rule rounded-md hover:bg-card transition-colors disabled:opacity-60"
    >
      {loading ? "Signing out..." : "Sign out"}
    </button>
  );
}