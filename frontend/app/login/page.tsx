'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import ProjectMateLogo from '@/components/ProjectMateLogo';

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true); // NEW

  async function handleLogin(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        },
      );

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

  // NEW: placeholder until social login is added to your backend
  function handleSocialClick(provider: string) {
    setMessage(
      `${provider} sign-in is not available yet. Please use email and password.`,
    );
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <ProjectMateLogo size={44} />

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
            <span className="block text-indigo-600">
              under control.
            </span>
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
                <span className="font-medium text-slate-700">
                  {item}
                </span>
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

            {/* NEW: social login buttons (screenshot style) */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialClick('Facebook')}
                className="flex h-14 w-full items-center rounded-md bg-[#3b5998] pl-2 pr-4 text-left transition hover:brightness-110"
              >
                <span className="flex h-10 w-10 items-center justify-center bg-white">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="#3b5998" aria-hidden="true">
                    <path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z" />
                  </svg>
                </span>
                <span className="ml-4 text-xs font-bold uppercase tracking-[0.12em] text-white">
                  Log in with Facebook
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick('Google')}
                className="flex h-14 w-full items-center rounded-md bg-[#4285f4] pl-2 pr-4 text-left transition hover:brightness-110"
              >
                <span className="flex h-10 w-10 items-center justify-center bg-white">
                  <svg width="22" height="22" viewBox="0 0 48 48" aria-hidden="true">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                    <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.87.92 7.52 2.56 10.78l7.97-6.19z" />
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  </svg>
                </span>
                <span className="ml-4 text-xs font-bold uppercase tracking-[0.12em] text-white">
                  Log in with Google
                </span>
              </button>

              <button
                type="button"
                onClick={() => handleSocialClick('Apple')}
                className="flex h-14 w-full items-center justify-center gap-2 rounded-md border border-black bg-white text-lg font-medium text-black transition hover:bg-slate-50"
              >
                <svg width="18" height="22" viewBox="0 0 384 512" aria-hidden="true">
                  <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                </svg>
                <span>Sign in with Apple</span>
              </button>
            </div>

            {/* NEW: "or" divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-slate-200" />
              <span className="text-sm text-slate-400">or</span>
              <div className="h-px flex-1 bg-slate-200" />
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

                  <Link
                    href="/forgot-password"
                    className="text-sm font-semibold text-indigo-600 transition hover:text-indigo-800"
                    prefetch={false}
                  >
                    Forgot Password?
                  </Link>
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

              {/* NEW: Remember me checkbox */}
              <label className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded accent-indigo-600"
                />
                Remember me on this computer
              </label>

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
            © 2026 ProjectMate. Built for your success and your academic milestone
          </p>
        </div>
      </section>
    </main>
  );
}