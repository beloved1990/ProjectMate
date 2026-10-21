
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.message === 'string'
            ? data.message
            : 'Login failed. Please check your details.',
        );
      }

      localStorage.setItem('projectmate_token', data.accessToken);
      localStorage.setItem('projectmate_user', JSON.stringify(data.user));

      setMessage('Login successful! Opening your dashboard...');

      router.push('/dashboard');
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
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-bold text-white">
              P
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              ProjectMate
            </span>
          </Link>

          <Link
            href="/"
            className="text-sm font-semibold text-slate-600 transition hover:text-indigo-600"
          >
            Back to home
          </Link>
        </div>
      </header>

      <section className="mx-auto grid min-h-[calc(100vh-81px)] max-w-7xl items-center gap-12 px-6 py-12 lg:grid-cols-2 lg:gap-20">
        <div className="hidden lg:block">
          <span className="inline-flex rounded-full bg-indigo-100 px-4 py-2 text-sm font-semibold text-indigo-700">
            YOUR ACADEMIC JOURNEY STARTS HERE
          </span>

          <h1 className="mt-6 max-w-xl text-5xl font-extrabold leading-tight tracking-tight text-slate-900 xl:text-6xl">
            Your final-year project,
            <span className="block text-indigo-600">under control.</span>
          </h1>

          <p className="mt-6 max-w-lg text-lg leading-8 text-slate-600">
            Organise your research, manage project tasks, track deadlines,
            and move confidently towards your academic goals.
          </p>

          <div className="mt-10 space-y-5">
            {[
              'Keep your project work organised',
              'Track tasks and important deadlines',
              'Manage your progress in one workspace',
            ].map((item) => (
              <div key={item} className="flex items-center gap-3">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-green-100 text-sm font-bold text-green-700">
                  ✓
                </span>
                <span className="font-medium text-slate-700">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-12 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-medium text-slate-500">
              YOUR PROJECT. YOUR RESEARCH. YOUR SUCCESS.
            </p>
            <p className="mt-2 text-lg font-bold text-slate-900">
              One workspace. A clearer path to completion.
            </p>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-xl shadow-slate-200/60 sm:p-10">
            <div className="mb-8">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-100 text-2xl">
                👋
              </div>

              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
                Welcome back
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-500">
                Sign in to continue working on your academic projects.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-5">
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

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 pr-24 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    {showPassword ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>

              {message && (
                <div
                  role="status"
                  aria-live="polite"
                  className={`rounded-xl px-4 py-3 text-sm ${
                    message.startsWith('Login successful')
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
                {loading ? 'Signing you in...' : 'Log In to ProjectMate'}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Your academic journey deserves better organisation.
              </p>
              <Link
                href="/"
                className="mt-3 inline-block text-sm font-semibold text-indigo-600 hover:text-indigo-800"
              >
                ← Return to homepage
              </Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-slate-400">
            © 2026 ProjectMate. Built for your success.
          </p>
        </div>
      </section>
    </main>
  );
}