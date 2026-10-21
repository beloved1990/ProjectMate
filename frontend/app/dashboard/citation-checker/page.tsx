
'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function CitationCheckerPage() {
  const [researchText, setResearchText] = useState('');
  const [references, setReferences] = useState('');
  const [citationStyle, setCitationStyle] = useState('APA 7');
  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCheck() {
    setError('');
    setReport('');

    if (!researchText.trim() || !references.trim()) {
      setError(
        'Please enter your research text and reference list before checking.',
      );
      return;
    }

    const token = localStorage.getItem('projectmate_token');

    if (!token) {
      setError('Your session has expired. Please log in again.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ai/citation-checker`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            researchText,
            references,
            citationStyle,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            'The citation checker could not complete your request.',
        );
      }

      setReport(data.report || 'No report was returned.');
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 text-slate-800 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-blue-700 hover:text-blue-900"
        >
          ← Back to Dashboard
        </Link>

        <div className="mb-8 rounded-2xl bg-slate-900 p-6 text-white sm:p-8">
          <p className="mb-2 text-sm font-semibold uppercase tracking-widest text-blue-300">
            ProjectMate AI Tools
          </p>

          <h1 className="text-3xl font-bold sm:text-4xl">
            Citation and Reference Checker
          </h1>

          <p className="mt-3 max-w-2xl leading-7 text-slate-300">
            Check whether your in-text citations match your reference
            list, identify missing references, and review citation
            formatting before submitting your research project.
          </p>
        </div>

        <div className="space-y-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div>
            <label
              htmlFor="citationStyle"
              className="mb-2 block font-semibold"
            >
              Citation style
            </label>

            <select
              id="citationStyle"
              value={citationStyle}
              onChange={(event) =>
                setCitationStyle(event.target.value)
              }
              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            >
              <option value="APA 7">APA 7th Edition</option>
              <option value="MLA 9">MLA 9th Edition</option>
              <option value="Harvard">Harvard</option>
              <option value="IEEE">IEEE</option>
              <option value="Chicago">Chicago</option>
              <option value="Other or institution-specific">
                Other / Institution-specific
              </option>
            </select>

            <p className="mt-2 text-sm text-slate-500">
              Select the style required by your department or
              institution.
            </p>
          </div>

          <div>
            <label
              htmlFor="researchText"
              className="mb-2 block font-semibold"
            >
              Research text containing in-text citations
            </label>

            <textarea
              id="researchText"
              value={researchText}
              onChange={(event) =>
                setResearchText(event.target.value)
              }
              placeholder="Paste your research paragraphs here, including citations such as (Adebayo, 2023) or (Smith & Jones, 2022)."
              rows={10}
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 leading-7 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-sm text-slate-500">
              Include the sections containing citations that you want
              checked.
            </p>
          </div>

          <div>
            <label
              htmlFor="references"
              className="mb-2 block font-semibold"
            >
              Reference list
            </label>

            <textarea
              id="references"
              value={references}
              onChange={(event) =>
                setReferences(event.target.value)
              }
              placeholder="Paste your complete reference list here, preferably one reference per paragraph."
              rows={8}
              className="w-full resize-y rounded-lg border border-slate-300 px-4 py-3 leading-7 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
            />

            <p className="mt-2 text-sm text-slate-500">
              Include author names, publication years, titles, and
              publication details as available.
            </p>
          </div>

          {error && (
            <div
              role="alert"
              className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          <button
            type="button"
            onClick={handleCheck}
            disabled={loading}
            className="w-full rounded-lg bg-blue-700 px-6 py-4 font-semibold text-white transition hover:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading
              ? 'Checking citations...'
              : 'Check Citations and References'}
          </button>

          {loading && (
            <p className="text-sm text-slate-500">
              ProjectMate AI is comparing your citations with your
              reference list. This may take a little time.
            </p>
          )}
        </div>

        {report && (
          <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-2xl font-bold text-slate-900">
                Citation Check Report
              </h2>

              <button
                type="button"
                onClick={() =>
                  navigator.clipboard.writeText(report)
                }
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50"
              >
                Copy Report
              </button>
            </div>

            <div className="whitespace-pre-wrap break-words leading-8 text-slate-700">
              {report}
            </div>

            <p className="mt-6 border-t border-slate-200 pt-4 text-sm text-slate-500">
              AI-generated feedback may contain mistakes. Verify
              bibliographic details against the original publications
              and follow your institution&apos;s citation requirements.
            </p>
          </section>
        )}
      </div>
    </div>
  );
}