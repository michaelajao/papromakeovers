'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function ResetPassword() {
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenValid, setTokenValid] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [expiresIn, setExpiresIn] = useState(0);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const urlToken = searchParams.get('token');
    if (urlToken) {
      setToken(urlToken);
      validateToken(urlToken);
    } else {
      setError('Invalid reset link - no token provided');
      setValidating(false);
    }
  }, [searchParams]);

  const validateToken = async (tokenValue: string) => {
    try {
      const response = await fetch(`/api/auth/verify-reset?token=${tokenValue}`);
      const data = await response.json();

      if (response.ok && data.valid) {
        setTokenValid(true);
        setAdminEmail(data.email);
        setExpiresIn(data.expiresIn);
      } else {
        setError(data.message || 'Invalid or expired reset link');
        setTokenValid(false);
      }
    } catch (error) {
      console.error('Token validation error:', error);
      setError('Failed to validate reset link');
      setTokenValid(false);
    } finally {
      setValidating(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();

      if (response.ok) {
        router.push('/admin');
      } else {
        setError(data.message || data.error || 'Password reset failed');
      }
    } catch (error) {
      console.error('Password reset error:', error);
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#f5f2ed] max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <svg className="animate-spin h-8 w-8 text-[#b49b82]" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
          <h2 className="text-lg text-[#4a4037]">Validating reset link...</h2>
        </div>
      </div>
    );
  }

  if (!tokenValid) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#f5f2ed] max-w-md w-full">
          <div className="text-center mb-6">
            <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-[#4a4037] mb-2">Invalid Reset Link</h1>
            <p className="text-[#6b5d4f]">{error}</p>
          </div>

          <div className="space-y-4">
            <a
              href="/admin/login"
              className="block w-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white py-3 px-4 rounded-lg font-medium text-center hover:from-[#b49b82] hover:to-[#a08770] transition-all duration-200"
            >
              Back to Login
            </a>
            <a
              href="/"
              className="block w-full text-center text-[#b49b82] hover:text-[#4a4037] transition-colors"
            >
              Back to Website
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#faf8f5] to-[#f5f2ed] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-[#f5f2ed]">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-[#4a4037] mb-2">Reset Password</h1>
            <p className="text-[#6b5d4f]">Create a new password for your admin account</p>
            <div className="w-16 h-1 bg-gradient-to-r from-[#d4b896] to-[#b49b82] mx-auto mt-3 rounded-full"></div>
          </div>

          {/* Token Info */}
          <div className="bg-[#faf8f5] p-4 rounded-lg mb-6 text-sm">
            <p className="text-[#4a4037]">
              <strong>Email:</strong> {adminEmail}
            </p>
            <p className="text-[#6b5d4f] mt-1">
              <strong>Expires in:</strong> {expiresIn} minute{expiresIn !== 1 ? 's' : ''}
            </p>
          </div>

          <form onSubmit={handlePasswordReset} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-[#4a4037] mb-2">
                New Password
              </label>
              <input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#d4b896]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b49b82] focus:border-transparent bg-[#faf8f5] text-[#4a4037]"
                placeholder="Enter new password"
                required
                disabled={loading}
                minLength={8}
              />
              <p className="text-xs text-[#6b5d4f] mt-1">
                Password must be at least 8 characters long
              </p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#4a4037] mb-2">
                Confirm New Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-[#d4b896]/30 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#b49b82] focus:border-transparent bg-[#faf8f5] text-[#4a4037]"
                placeholder="Confirm new password"
                required
                disabled={loading}
                minLength={8}
              />
            </div>

            <button
              type="submit"
              disabled={loading || !newPassword || !confirmPassword || newPassword !== confirmPassword}
              className="w-full bg-gradient-to-r from-[#d4b896] to-[#b49b82] text-white py-3 px-4 rounded-lg font-medium hover:from-[#b49b82] hover:to-[#a08770] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Updating Password...
                </span>
              ) : (
                'Update Password & Sign In'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#f5f2ed] text-center">
            <p className="text-xs text-[#6b5d4f]/70 mb-2">
              After updating your password, you'll be automatically signed in
            </p>
            <a
              href="/admin/login"
              className="text-sm text-[#b49b82] hover:text-[#4a4037] transition-colors"
            >
              Back to Login
            </a>
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