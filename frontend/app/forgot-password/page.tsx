
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setMessage('');
    setSuccess(false);
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/forgot-password`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.message === 'string'
            ? data.message
            : 'Unable to process your request. Please try again.',
        );
      }

      setSuccess(true);
      setMessage(
        data.message ||
          'If an account exists with this email, password reset instructions will be sent.',
      );
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the server. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-5 py-12">
      <div className="w-full max-w-md">

        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
              P
            </span>

            <span className="text-2xl font-bold text-slate-900">
              ProjectMate
            </span>
          </Link>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10">

          <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
            🔐
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Forgot Password?
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-500">
            Don't worry! Enter the email address associated with your
            ProjectMate account. We'll send you instructions to reset
            your password.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">

            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-slate-700"
              >
                Email address
              </label>

              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`rounded-xl px-4 py-3 text-sm ${
                  success
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}
              >
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center rounded-xl bg-indigo-600 px-5 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Sending request...' : 'Send Reset Link'}
            </button>

          </form>

          <div className="mt-8 border-t border-slate-100 pt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
            >
              ← Back to Login
            </Link>
          </div>

        </div>

        <p className="mt-6 text-center text-xs text-slate-400">
          © 2026 ProjectMate. Built for your success.
        </p>

      </div>
    </main>
  );
}
