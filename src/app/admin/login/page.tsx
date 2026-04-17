"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "@/utils/supabase/client";

function AdminLoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "auth-failed") setError("That sign-in link has expired or was already used. Request a new one below.");
    else if (err === "not-admin") setError("This account doesn't have admin access.");
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const origin = window.location.origin;
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${origin}/auth/callback`,
          shouldCreateUser: false,
        },
      });
      if (otpError) throw otpError;
      setSent(true);
    } catch (e) {
      const message = (e as Error).message ?? "Something went wrong. Please try again.";
      setError(message.includes("Signups not allowed") ? "This email isn't registered as an admin." : message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#f5f2ed]">
          <div className="text-center mb-8">
            <h1 className="font-serif text-3xl text-[#3a322b] mb-2">Papromakeovers</h1>
            <h2 className="text-lg text-[#6b5d4f]">Admin Portal</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#d4b896] to-[#b49b82] mx-auto mt-3 rounded-full" aria-hidden="true" />
          </div>

          {sent ? (
            <div className="space-y-4 text-center">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm">
                <p className="font-semibold mb-1">Check your email</p>
                <p>We sent a sign-in link to <span className="font-medium">{email}</span>. Click the link to continue.</p>
              </div>
              <button
                type="button"
                onClick={() => { setSent(false); setEmail(""); }}
                className="text-sm text-[#b49b82] hover:text-[#4a4037] transition-colors"
              >
                Use a different email
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4a4037] mb-2">
                  Admin Email
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#d4b896]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b49b82] focus:border-transparent bg-[#faf8f5] text-[#4a4037]"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-[#6b5d4f]">We&apos;ll email you a one-time sign-in link. No password needed.</p>
              </div>

              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white py-3 px-4 rounded-lg font-medium hover:from-[#b49b82] hover:to-[#a08770] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? "Sending link..." : "Send sign-in link"}
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#f5f2ed] text-center">
            <p className="text-xs text-[#6b5d4f]/70">
              Admin access for Papromakeovers booking management
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <Link
            href="/"
            className="text-sm text-[#b49b82] hover:text-[#4a4037] transition-colors"
          >
            ← Back to website
          </Link>
        </div>
      </div>
    </div>
  );
}

function LoadingFallback() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] flex items-center justify-center p-4">
      <div className="text-[#6b5d4f]">Loading…</div>
    </div>
  );
}

export default function AdminLogin() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}
