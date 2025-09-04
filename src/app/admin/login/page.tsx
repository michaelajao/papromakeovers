'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResetForm, setShowResetForm] = useState(false);
  const [resetEmail, setResetEmail] = useState('papromakeoversstudio@gmail.com');
  const [resetMessage, setResetMessage] = useState('');
  const [resetLoading, setResetLoading] = useState(false);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') || '/admin';
  const expired = searchParams.get('expired') === '1';

  useEffect(() => {
    if (expired) {
      setError('Your session has expired. Please log in again.');
    }
  }, [expired]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password, rememberMe }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(redirectTo);
      } else {
        setError(data.message || data.error || 'Login failed');
        if (response.status === 429) {
          // Rate limited
          setTimeout(() => setError(''), 5000);
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setResetLoading(true);
    setResetMessage('');

    try {
      const response = await fetch('/api/auth/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: resetEmail }),
      });

      const data = await response.json();

      if (response.ok) {
        setResetMessage('If this email is associated with an admin account, you will receive password reset instructions.');
        setShowResetForm(false);
      } else {
        setResetMessage(data.message || data.error || 'Reset request failed');
      }
    } catch (error) {
      console.error('Reset error:', error);
      setResetMessage('Network error. Please try again.');
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#f5f2ed]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#4a4037] mb-2">PaproMakeovers</h1>
            <h2 className="text-lg text-[#6b5d4f]">Admin Portal</h2>
            <div className="w-16 h-1 bg-gradient-to-r from-[#d4b896] to-[#b49b82] mx-auto mt-3 rounded-full"></div>
          </div>

          {!showResetForm ? (
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              {resetMessage && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700 text-sm">
                  {resetMessage}
                </div>
              )}

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-[#4a4037] mb-2">
                  Admin Password
                </label>
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border border-[#d4b896]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b49b82] focus:border-transparent bg-[#faf8f5] text-[#4a4037] placeholder-[#6b5d4f]/60"
                  placeholder="Enter your password"
                  required
                  disabled={loading}
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center text-sm text-[#4a4037]">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-[#d4b896] text-[#b49b82] focus:ring-[#b49b82] mr-2"
                    disabled={loading}
                  />
                  Remember me
                </label>

                <button
                  type="button"
                  onClick={() => setShowResetForm(true)}
                  className="text-sm text-[#b49b82] hover:text-[#4a4037] transition-colors"
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>

              <button
                type="submit"
                disabled={loading || !password}
                className="w-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white py-3 px-4 rounded-lg font-medium hover:from-[#b49b82] hover:to-[#a08770] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing in...
                  </span>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handlePasswordReset} className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-[#4a4037] mb-2">Reset Password</h3>
                <p className="text-sm text-[#6b5d4f]">Enter your admin email to receive reset instructions</p>
              </div>

              {resetMessage && (
                <div className={`p-4 border rounded-lg text-sm ${
                  resetMessage.includes('error') || resetMessage.includes('failed') 
                    ? 'bg-red-50 border-red-200 text-red-700' 
                    : 'bg-green-50 border-green-200 text-green-700'
                }`}>
                  {resetMessage}
                </div>
              )}

              <div>
                <label htmlFor="resetEmail" className="block text-sm font-medium text-[#4a4037] mb-2">
                  Admin Email
                </label>
                <input
                  id="resetEmail"
                  type="email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-[#d4b896]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b49b82] focus:border-transparent bg-[#faf8f5] text-[#4a4037]"
                  required
                  disabled={resetLoading}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(false);
                    setResetMessage('');
                  }}
                  className="flex-1 px-4 py-3 border border-[#d4b896] text-[#4a4037] rounded-lg hover:bg-[#faf8f5] transition-colors"
                  disabled={resetLoading}
                >
                  Back to Login
                </button>
                <button
                  type="submit"
                  disabled={resetLoading || !resetEmail}
                  className="flex-1 bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white py-3 px-4 rounded-lg font-medium hover:from-[#b49b82] hover:to-[#a08770] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {resetLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    'Send Reset Link'
                  )}
                </button>
              </div>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-[#f5f2ed] text-center">
            <p className="text-xs text-[#6b5d4f]/70">
              Admin access for PaproMakeovers booking management
            </p>
          </div>
        </div>

        <div className="text-center mt-4">
          <a
            href="/"
            className="text-sm text-[#b49b82] hover:text-[#4a4037] transition-colors"
          >
            ← Back to Website
          </a>
        </div>
      </div>
    </div>
  );
}