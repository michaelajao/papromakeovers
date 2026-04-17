"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function UpdatePasswordPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [ready, setReady] = useState(false);

  // Supabase populates a recovery session from the URL hash on this page.
  // We wait for that before letting the user submit.
  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY" || event === "SIGNED_IN") {
        setReady(true);
      }
    });
    // If already in a session (e.g., page refreshed after link click), let them proceed
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) setReady(true);
    });
    return () => subscription.unsubscribe();
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase.auth.updateUser({ password });
      if (updateError) throw updateError;
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/admin";
      }, 1500);
    } catch (e) {
      setError((e as Error).message ?? "Couldn't update password.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#f5f2ed]">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[#3a322b] mb-2">Set New Password</h1>
            <div className="w-16 h-1 bg-gradient-to-r from-[#d4b896] to-[#b49b82] mx-auto mt-3 rounded-full" aria-hidden="true" />
          </div>

          {success ? (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm text-center">
              Password updated. Redirecting to admin…
            </div>
          ) : !ready ? (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm text-center">
              <p className="font-medium mb-1">Waiting for reset link…</p>
              <p className="text-xs">If you didn&apos;t arrive here from a password reset email, <Link href="/admin/login" className="underline">go back to sign in</Link>.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#4a4037] mb-2">New Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-[#d4b896]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b49b82] bg-[#faf8f5] text-[#4a4037]"
                    minLength={8}
                    autoComplete="new-password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6b5d4f] hover:text-[#4a4037]"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirm" className="block text-sm font-medium text-[#4a4037] mb-2">Confirm Password</label>
                <input
                  id="confirm"
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full px-4 py-3 border border-[#d4b896]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b49b82] bg-[#faf8f5] text-[#4a4037]"
                  minLength={8}
                  autoComplete="new-password"
                  required
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                disabled={loading || !password || !confirm}
                className="w-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 shadow-lg"
              >
                {loading ? "Updating…" : "Set Password"}
              </button>
            </form>
          )}
        </div>

        <div className="text-center mt-4">
          <Link href="/" className="text-sm text-[#b49b82] hover:text-[#4a4037] transition-colors">
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}
