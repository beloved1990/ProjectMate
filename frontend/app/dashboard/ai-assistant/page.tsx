
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AiAssistantPage() {
  const [question, setQuestion] = useState('');
  const [projectContext, setProjectContext] = useState('');
  const [answer, setAnswer] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function askAssistant(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setAnswer('');

    if (!question.trim()) {
      setError('Please enter a research question.');
      return;
    }

    const token = localStorage.getItem('projectmate_token');

    if (!token) {
      setError('Please log in to use the AI Research Assistant.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/ai/research-assistant`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            question: question.trim(),
            projectContext: projectContext.trim(),
          }),
        },
      );

      let data: any;

      try {
        data = await response.json();
      } catch {
        throw new Error(
          'We could not process your request right now. Please try again shortly.',
        );
      }

      if (response.status === 401 || response.status === 403) {
        throw new Error(
          'Your session may have expired. Please log in again to continue.',
        );
      }

      if (!response.ok) {
        if (response.status === 429 || response.status === 503) {
          throw new Error(
            'Our AI assistant is temporarily unavailable. Please try again in a few moments. If the problem continues, kindly try again later.',
          );
        }

        if (response.status >= 500) {
          throw new Error(
            'Something went wrong while processing your request. Please try again shortly.',
          );
        }

        throw new Error(
          typeof data?.message === 'string' &&
            response.status === 400
            ? data.message
            : 'We could not complete your request. Please check your information and try again.',
        );
      }

      if (
        typeof data?.answer !== 'string' ||
        !data.answer.trim()
      ) {
        throw new Error(
          'The AI assistant could not generate a response this time. Please try again.',
        );
      }

      setAnswer(data.answer);
    } catch (err) {
      if (
        err instanceof TypeError
      ) {
        setError(
          'We could not connect to ProjectMate. Please check your internet connection and try again.',
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again later.',
        );
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f5f7fc] px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Dashboard
        </Link>

        <header className="mt-7 rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-blue-600 p-7 text-white shadow-lg sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
            ✦
          </div>

          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
            Powered by Gemini
          </p>

          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            AI Research Assistant
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-7 text-indigo-100 sm:text-base">
            Get help understanding research concepts, exploring ideas,
            improving academic writing, and learning research methodology.
          </p>
        </header>

        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <form onSubmit={askAssistant} className="space-y-6">
            <div>
              <label
                htmlFor="research-question"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                What would you like help with?
              </label>

              <textarea
                id="research-question"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                placeholder="e.g. Explain the importance of a literature review in my final-year project."
                rows={5}
                required
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />
            </div>

            <div>
              <label
                htmlFor="project-context"
                className="mb-2 block text-sm font-bold text-slate-800"
              >
                Project context (optional)
              </label>

              <textarea
                id="project-context"
                value={projectContext}
                onChange={(e) => setProjectContext(e.target.value)}
                placeholder="Enter your project topic, academic level, or research area."
                rows={3}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
              />

              <p className="mt-2 text-xs text-slate-500">
                Adding context helps tailor the response to your research.
              </p>
            </div>

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? 'Thinking...' : 'Ask ProjectMate AI'}
              {!loading && <span aria-hidden="true">→</span>}
            </button>
          </form>

          {error && (
            <div
              role="alert"
              className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm leading-6 text-red-700"
            >
              {error}

              {error.toLowerCase().includes('log in') && (
                <Link
                  href="/login"
                  className="ml-2 font-bold underline"
                >
                  Go to login
                </Link>
              )}
            </div>
          )}
        </section>

        {answer && (
          <section className="mt-7 rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex items-center gap-3 border-b border-slate-100 pb-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-xl text-indigo-600">
                ✦
              </div>

              <div>
                <h2 className="font-extrabold text-slate-900">
                  Your AI response
                </h2>

                <p className="mt-1 text-xs text-slate-500">
                  Review and verify important academic information.
                </p>
              </div>
            </div>

            <div className="whitespace-pre-wrap break-words pt-5 text-sm leading-8 text-slate-700">
              {answer}
            </div>

            <button
              type="button"
              onClick={() => {
                void navigator.clipboard.writeText(answer);
              }}
              className="mt-6 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              Copy answer
            </button>
          </section>
        )}

        <p className="mt-8 text-center text-xs leading-6 text-slate-400">
          ProjectMate AI supports your learning. Verify sources and follow
          your institution&apos;s academic integrity guidelines.
        </p>
      </div>
    </main>
  );
}
