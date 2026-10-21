
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

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          typeof data.message === 'string'
            ? data.message
            : 'The AI assistant could not respond.',
        );
      }

      if (typeof data.answer !== 'string' || !data.answer.trim()) {
        throw new Error('The AI returned an empty response.');
      }

      setAnswer(data.answer);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not connect to the AI service.',
      );
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
