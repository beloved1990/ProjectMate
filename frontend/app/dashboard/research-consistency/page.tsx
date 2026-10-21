
'use client';

import { useState } from 'react';
import Link from 'next/link';

type ConsistencyForm = {
  topic: string;
  objectives: string;
  researchQuestions: string;
  methodology: string;
  results: string;
  conclusions: string;
};

export default function ResearchConsistencyPage() {
  const [form, setForm] = useState<ConsistencyForm>({
    topic: '',
    objectives: '',
    researchQuestions: '',
    methodology: '',
    results: '',
    conclusions: '',
  });

  const [report, setReport] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  function updateField(field: keyof ConsistencyForm, value: string) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function checkConsistency(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setReport('');

    const token = localStorage.getItem('projectmate_token');

    if (!token) {
      setError('Please log in before using the Research Consistency Checker.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/ai/research-consistency`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topic: form.topic.trim(),
            objectives: form.objectives.trim(),
            researchQuestions: form.researchQuestions.trim(),
            methodology: form.methodology.trim(),
            results: form.results.trim(),
            conclusions: form.conclusions.trim(),
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;

        throw new Error(
          typeof message === 'string'
            ? message
            : 'The consistency check failed. Please try again.',
        );
      }

      if (typeof data.report !== 'string' || !data.report.trim()) {
        throw new Error('The AI returned an empty consistency report.');
      }

      setReport(data.report);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Could not connect to the Research Consistency Checker.',
      );
    } finally {
      setLoading(false);
    }
  }

  const fields: {
    name: keyof ConsistencyForm;
    label: string;
    description: string;
    placeholder: string;
    required: boolean;
    rows: number;
  }[] = [
    {
      name: 'topic',
      label: 'Research topic',
      description: 'Enter the title or topic of your research.',
      placeholder: 'e.g. AI-Controlled Smart Street Lighting System Integrating PIR Motion Sensors and Predictive Load Adjustment',
      required: true,
      rows: 2,
    },
    {
      name: 'objectives',
      label: 'Research objectives',
      description: 'List the main and specific objectives of your study.',
      placeholder: '1. To design...\n2. To develop...\n3. To evaluate...',
      required: true,
      rows: 4,
    },
    {
      name: 'researchQuestions',
      label: 'Research questions',
      description: 'List the questions your research aims to answer.',
      placeholder: '1. How can...\n2. What effect does...\n3. How effective is...',
      required: true,
      rows: 4,
    },
    {
      name: 'methodology',
      label: 'Research methodology',
      description: 'Describe your research design, methods, data collection and analysis.',
      placeholder: 'Describe the research design, participants or data, instruments, procedures and analysis methods.',
      required: true,
      rows: 5,
    },
    {
      name: 'results',
      label: 'Results or findings (optional)',
      description: 'For completed research, summarize the findings. Leave blank if you are still preparing a proposal.',
      placeholder: 'Summarize your actual findings. Do not invent results.',
      required: false,
      rows: 4,
    },
    {
      name: 'conclusions',
      label: 'Conclusions (optional)',
      description: 'Enter your conclusion if you have written it.',
      placeholder: 'Summarize what you concluded from your findings.',
      required: false,
      rows: 4,
    },
  ];

  return (
    <main className="min-h-screen bg-[#f5f7fc] px-4 py-7 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          ← Back to Dashboard
        </Link>

        <header className="mt-6 rounded-3xl bg-gradient-to-br from-indigo-800 via-indigo-700 to-blue-600 p-7 text-white shadow-lg sm:p-10">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 text-2xl">
            ⇄
          </div>
          <p className="mt-5 text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
            ProjectMate Research Tools · Step 2
          </p>
          <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
            Research Consistency Checker
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-indigo-100 sm:text-base">
            Check whether your research objectives, questions, methodology,
            findings and conclusions work together as a coherent study.
          </p>
        </header>

        <section className="mt-7 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-xl font-extrabold">Your research details</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Complete the required sections. Include results and conclusions
              if your research has progressed that far.
            </p>
          </div>

          <form onSubmit={checkConsistency} className="space-y-6">
            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-bold text-slate-800"
                >
                  {field.label}
                  {field.required && (
                    <span className="ml-1 text-red-600">*</span>
                  )}
                </label>

                <p className="mb-2 text-xs leading-5 text-slate-500">
                  {field.description}
                </p>

                <textarea
                  id={field.name}
                  value={form[field.name]}
                  onChange={(e) =>
                    updateField(field.name, e.target.value)
                  }
                  placeholder={field.placeholder}
                  rows={field.rows}
                  required={field.required}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-7 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            ))}

            <p className="text-xs leading-6 text-slate-500">
              * Required fields. Your results and conclusions are optional.
              Only submit research material you are permitted to share.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-4 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading ? 'Checking consistency...' : 'Analyze My Research'}
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
                <Link href="/login" className="ml-2 font-bold underline">
                  Go to login
                </Link>
              )}
            </div>
          )}
        </section>

        {report && (
          <section className="mt-7 rounded-3xl border border-indigo-100 bg-white p-5 shadow-sm sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <h2 className="text-xl font-extrabold">
                  Research consistency report
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Review each observation against your actual research.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(report);
                }}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
              >
                Copy report
              </button>
            </div>

            <div className="whitespace-pre-wrap break-words pt-5 text-sm leading-8 text-slate-700">
              {report}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <strong>Academic review reminder:</strong> This AI report
              identifies possible issues, not unquestionable facts. Verify
              suggestions against your research, data, and supervisor&apos;s
              requirements before making changes.
            </div>
          </section>
        )}

        <p className="mt-8 text-center text-xs leading-6 text-slate-400">
          ProjectMate supports research improvement. It does not replace
          academic supervision or verification of research evidence.
        </p>
      </div>
    </main>
  );
}
