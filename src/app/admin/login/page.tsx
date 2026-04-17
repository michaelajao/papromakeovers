"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

type Mode = "password" | "magic" | "forgot";

function AdminLoginForm() {
  const [mode, setMode] = useState<Mode>("password");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [magicSent, setMagicSent] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchParams = useSearchParams();

  useEffect(() => {
    const err = searchParams.get("error");
    if (err === "auth-failed") setError("That sign-in link has expired or was already used. Try again below.");
    else if (err === "not-admin") setError("This account doesn't have admin access.");
  }, [searchParams]);

  async function handlePasswordSignIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      window.location.href = "/admin";
    } catch (e) {
      setError((e as Error).message ?? "Sign-in failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
          shouldCreateUser: false,
        },
      });
      if (otpError) throw otpError;
      setMagicSent(true);
    } catch (e) {
      const msg = (e as Error).message ?? "Something went wrong.";
      setError(msg.includes("Signups not allowed") ? "This email isn't registered as an admin." : msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/admin/update-password`,
      });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch (e) {
      setError((e as Error).message ?? "Couldn't send reset email.");
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

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm" role="alert">
              {error}
            </div>
          )}

          {magicSent && mode === "magic" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm mb-4">
              <p className="font-semibold mb-1">Check your email</p>
              <p>Sign-in link sent to <span className="font-medium">{email}</span>. Open it in the same browser you&apos;re using now.</p>
            </div>
          )}

          {resetSent && mode === "forgot" && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-800 text-sm mb-4">
              <p className="font-semibold mb-1">Check your email</p>
              <p>Password reset link sent to <span className="font-medium">{email}</span>.</p>
            </div>
          )}

          {mode === "password" && !magicSent && !resetSent && (
            <form onSubmit={handlePasswordSignIn} className="space-y-5">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-[#4a4037] mb-2">Email</label>
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
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#4a4037] mb-2">Password</label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-[#d4b896]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b49b82] focus:border-transparent bg-[#faf8f5] text-[#4a4037]"
                    placeholder="Your password"
                    autoComplete="current-password"
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#6b5d4f] hover:text-[#4a4037] rounded"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    disabled={loading}
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white py-3 px-4 rounded-lg font-medium hover:from-[#b49b82] hover:to-[#a08770] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>

              <div className="flex justify-between text-sm">
                <button type="button" onClick={() => { setMode("forgot"); setError(""); }} className="text-[#b49b82] hover:text-[#4a4037]">
                  Forgot password?
                </button>
                <button type="button" onClick={() => { setMode("magic"); setError(""); }} className="text-[#b49b82] hover:text-[#4a4037]">
                  Use email link instead
                </button>
              </div>
            </form>
          )}

          {mode === "magic" && !magicSent && (
            <form onSubmit={handleMagicLink} className="space-y-5">
              <div>
                <label htmlFor="magic-email" className="block text-sm font-medium text-[#4a4037] mb-2">Admin Email</label>
                <input
                  id="magic-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#d4b896]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b49b82] focus:border-transparent bg-[#faf8f5] text-[#4a4037]"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-[#6b5d4f]">
                  We&apos;ll email you a one-time sign-in link. Click it from the same browser you&apos;re using now (not from an in-app inbox preview).
                </p>
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 shadow-lg"
              >
                {loading ? "Sending..." : "Send sign-in link"}
              </button>
              <button type="button" onClick={() => { setMode("password"); setError(""); }} className="w-full text-sm text-[#b49b82] hover:text-[#4a4037]">
                ← Use password instead
              </button>
            </form>
          )}

          {mode === "forgot" && !resetSent && (
            <form onSubmit={handleForgotPassword} className="space-y-5">
              <div>
                <label htmlFor="forgot-email" className="block text-sm font-medium text-[#4a4037] mb-2">Admin Email</label>
                <input
                  id="forgot-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#d4b896]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b49b82] focus:border-transparent bg-[#faf8f5] text-[#4a4037]"
                  placeholder="you@example.com"
                  autoComplete="email"
                  required
                  disabled={loading}
                />
                <p className="mt-2 text-xs text-[#6b5d4f]">We&apos;ll send a link to set a new password.</p>
              </div>
              <button
                type="submit"
                disabled={loading || !email}
                className="w-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white py-3 px-4 rounded-lg font-medium disabled:opacity-50 shadow-lg"
              >
                {loading ? "Sending..." : "Send reset link"}
              </button>
              <button type="button" onClick={() => { setMode("password"); setError(""); }} className="w-full text-sm text-[#b49b82] hover:text-[#4a4037]">
                ← Back to sign in
              </button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#f5f2ed] text-center">
            <p className="text-xs text-[#6b5d4f]/70">Admin access for Papromakeovers booking management</p>
          </div>
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
