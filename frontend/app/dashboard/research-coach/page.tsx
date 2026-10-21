'use client';

import { useEffect, useState, type FormEvent } from 'react';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

type ResearchForm = {
  topic: string;
  problemStatement: string;
  objectives: string;
  researchQuestions: string;
  methodology: string;
  literatureReview: string;
  results: string;
  conclusion: string;
  references: string;
};

type ProjectOption = {
  id: number;
  name: string;
};

type SavedResearchReport = {
  id: number;
  projectId: number;
  title: string;
  content: string;
  createdAt?: string;
};

const initialForm: ResearchForm = {
  topic: '',
  problemStatement: '',
  objectives: '',
  researchQuestions: '',
  methodology: '',
  literatureReview: '',
  results: '',
  conclusion: '',
  references: '',
};

const fields: {
  name: keyof ResearchForm;
  label: string;
  placeholder: string;
  required?: boolean;
}[] = [
  {
    name: 'topic',
    label: 'Research topic',
    placeholder: 'Enter your complete project topic',
    required: true,
  },
  {
    name: 'problemStatement',
    label: 'Statement of the problem',
    placeholder: 'What problem is your research addressing?',
  },
  {
    name: 'objectives',
    label: 'Research objectives',
    placeholder: 'Enter your main and specific objectives',
  },
  {
    name: 'researchQuestions',
    label: 'Research questions',
    placeholder: 'What questions will your research answer?',
  },
  {
    name: 'methodology',
    label: 'Research methodology',
    placeholder:
      'Describe your research design, population, sample and methods',
  },
  {
    name: 'literatureReview',
    label: 'Literature review',
    placeholder:
      'Summarise relevant studies or paste your literature review',
  },
  {
    name: 'results',
    label: 'Results or findings',
    placeholder: 'Enter your actual findings, if available',
  },
  {
    name: 'conclusion',
    label: 'Conclusion',
    placeholder: 'Enter your conclusion, if available',
  },
  {
    name: 'references',
    label: 'References',
    placeholder: 'Paste your reference list, if available',
  },
];

export default function ResearchCoachPage() {
  const [form, setForm] = useState<ResearchForm>(initialForm);

  const [report, setReport] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [draft, setDraft] = useState('');
  const [draftLoading, setDraftLoading] = useState(false);
  const [draftError, setDraftError] = useState('');

  const [projects, setProjects] = useState<ProjectOption[]>([]);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [projectsLoading, setProjectsLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [saveError, setSaveError] = useState('');

  const [savedReports, setSavedReports] = useState<
    SavedResearchReport[]
  >([]);
  const [reportsLoading, setReportsLoading] = useState(false);
  const [reportsError, setReportsError] = useState('');

  // Load the user's existing projects.
  useEffect(() => {
    async function loadProjects() {
      const token = localStorage.getItem('projectmate_token');

      if (!token) return;

      setProjectsLoading(true);

      try {
        const response = await fetch(`${API}/projects`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          const message = Array.isArray(data.message)
            ? data.message.join(', ')
            : data.message;

          throw new Error(
            message || 'Could not load your projects.',
          );
        }

        const projectList: ProjectOption[] = Array.isArray(
          data.projects,
        )
          ? data.projects
          : [];

        setProjects(projectList);

        if (projectList.length > 0) {
          setSelectedProjectId(String(projectList[0].id));
        }
      } catch (err) {
        setSaveError(
          err instanceof Error
            ? err.message
            : 'Could not load your projects.',
        );
      } finally {
        setProjectsLoading(false);
      }
    }

    void loadProjects();
  }, []);

  // Save the generated analysis report to the selected project.
  async function saveResearchCoachReport() {
    const token = localStorage.getItem('projectmate_token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (!selectedProjectId) {
      setSaveError('Please select a project first.');
      return;
    }

    if (!report.trim()) {
      setSaveError(
        'Analyse your project first so there is a report to save.',
      );
      return;
    }

    setSaveLoading(true);
    setSaveError('');
    setSaveMessage('');

    try {
      const response = await fetch(
        `${API}/projects/${selectedProjectId}/research-coach-reports`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            title: form.topic.trim() || 'Research Coach Report',
            content: report,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;

        throw new Error(
          message || 'Could not save the report.',
        );
      }

      setSaveMessage(
        'Research Coach report saved to your project.',
      );

      await loadSavedReports(selectedProjectId);
    } catch (err) {
      setSaveError(
        err instanceof Error
          ? err.message
          : 'Could not save the report.',
      );
    } finally {
      setSaveLoading(false);
    }
  }

  // Retrieve previously saved reports for the selected project.
  async function loadSavedReports(
    projectId = selectedProjectId,
  ) {
    const token = localStorage.getItem('projectmate_token');

    if (!token || !projectId) return;

    setReportsLoading(true);
    setReportsError('');

    try {
      const response = await fetch(
        `${API}/projects/${projectId}/research-coach-reports`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;

        throw new Error(
          message || 'Could not load saved reports.',
        );
      }

      setSavedReports(
        Array.isArray(data.reports) ? data.reports : [],
      );
    } catch (err) {
      setReportsError(
        err instanceof Error
          ? err.message
          : 'Could not load saved reports.',
      );
    } finally {
      setReportsLoading(false);
    }
  }

  // Analyse the student's research.
  async function analyseProject(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    const token = localStorage.getItem('projectmate_token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    setLoading(true);
    setError('');
    setReport('');
    setSaveMessage('');
    setSaveError('');
    setSavedReports([]);

    try {
      const response = await fetch(`${API}/ai/project-coach`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;

        throw new Error(
          message || 'Could not analyse your project.',
        );
      }

      if (
        typeof data.report !== 'string' ||
        !data.report.trim()
      ) {
        throw new Error(
          'The AI returned an empty report. Please try again.',
        );
      }

      setReport(data.report);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Unable to connect to ProjectMate. Please try again.',
      );
    } finally {
      setLoading(false);
    }
  }

  // Generate the problem statement and objectives draft.
  async function generateProblemStatement() {
    const token = localStorage.getItem('projectmate_token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    if (!form.topic.trim()) {
      setDraftError(
        'Please enter your research topic first.',
      );
      return;
    }

    setDraftLoading(true);
    setDraftError('');
    setDraft('');

    try {
      const response = await fetch(
        `${API}/ai/generate-problem-statement`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            topic: form.topic,
            problemStatement: form.problemStatement,
            objectives: form.objectives,
          }),
        },
      );

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const message = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;

        throw new Error(
          message || 'Could not generate the problem statement.',
        );
      }

      if (
        typeof data.result !== 'string' ||
        !data.result.trim()
      ) {
        throw new Error(
          'The AI returned an empty draft. Please try again.',
        );
      }

      setDraft(data.result);
    } catch (err) {
      setDraftError(
        err instanceof Error
          ? err.message
          : 'Something went wrong. Please try again.',
      );
    } finally {
      setDraftLoading(false);
    }
  }

  // Copy the generated draft into the form fields.
  function useDraftInForm() {
    if (!draft) return;

    const problemHeading = 'PROPOSED PROBLEM STATEMENT';
    const objectivesHeading = 'GENERAL OBJECTIVE';
    const specificHeading = 'SPECIFIC OBJECTIVES';

    const problemStart = draft.indexOf(problemHeading);
    const generalStart = draft.indexOf(objectivesHeading);
    const specificStart = draft.indexOf(specificHeading);

    if (problemStart === -1) {
      setForm((current) => ({
        ...current,
        problemStatement: draft,
      }));
      return;
    }

    const problemEnd =
      generalStart !== -1 ? generalStart : draft.length;

    const problemStatement = draft
      .slice(problemStart + problemHeading.length, problemEnd)
      .trim()
      .replace(/^[:\s-]+/, '');

    let objectives = '';

    if (generalStart !== -1) {
      const objectivesEnd =
        specificStart !== -1
          ? specificStart
          : draft.length;

      const generalObjective = draft
        .slice(
          generalStart + objectivesHeading.length,
          objectivesEnd,
        )
        .trim()
        .replace(/^[:\s-]+/, '');

      const specificObjectives =
        specificStart !== -1
          ? draft
              .slice(specificStart + specificHeading.length)
              .split('POINTS THE STUDENT MUST VERIFY')[0]
              .trim()
              .replace(/^[:\s-]+/, '')
          : '';

      objectives = [
        generalObjective
          ? `General Objective:\n${generalObjective}`
          : '',
        specificObjectives
          ? `Specific Objectives:\n${specificObjectives}`
          : '',
      ]
        .filter(Boolean)
        .join('\n\n');
    }

    setForm((current) => ({
      ...current,
      problemStatement: problemStatement || draft,
      objectives: objectives || current.objectives,
    }));
  }

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/dashboard"
          className="text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          ← Back to dashboard
        </Link>

        <header className="mt-7 rounded-3xl bg-gradient-to-br from-indigo-700 to-blue-600 p-7 text-white shadow-lg sm:p-10">
          <p className="text-sm font-semibold text-indigo-100">
            PROJECTMATE AI
          </p>

          <h1 className="mt-3 text-3xl font-extrabold sm:text-4xl">
            Project Intelligence &amp; Research Coach
          </h1>

          <p className="mt-4 max-w-2xl leading-7 text-indigo-100">
            Understand what is working in your research, identify
            what needs improvement, and prepare for your project
            defence.
          </p>
        </header>

        <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
          <h2 className="text-xl font-bold">
            Tell us about your research
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Enter the sections you have completed. Only the research
            topic is required. Missing sections will be marked
            “Not assessed”.
          </p>

          <form
            onSubmit={analyseProject}
            className="mt-6 space-y-5"
          >
            {fields.map((field) => (
              <div key={field.name}>
                <label
                  htmlFor={field.name}
                  className="mb-2 block text-sm font-bold text-slate-700"
                >
                  {field.label}

                  {field.required && (
                    <span className="ml-1 text-red-600">*</span>
                  )}

                  {!field.required && (
                    <span className="ml-2 font-normal text-slate-400">
                      Optional
                    </span>
                  )}
                </label>

                <textarea
                  id={field.name}
                  required={field.required}
                  value={form[field.name]}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      [field.name]: event.target.value,
                    }))
                  }
                  placeholder={field.placeholder}
                  rows={field.name === 'topic' ? 2 : 4}
                  className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                />
              </div>
            ))}

            <p className="rounded-xl bg-amber-50 p-4 text-sm leading-6 text-amber-900">
              <strong>Academic integrity:</strong> Use your actual
              research information. The AI provides guidance, not an
              official university grade, and it cannot verify your
              results or guarantee a successful defence.
            </p>

            {error && (
              <div
                role="alert"
                className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-indigo-600 px-6 py-4 font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {loading
                ? 'Analysing your project...'
                : 'Analyse My Project'}
            </button>
          </form>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-xl font-bold">
              Generate Problem Statement &amp; Objectives
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              Use your research topic to create a draft problem
              statement, one general objective and 3–4 specific
              objectives. Review the result carefully and adapt it
              to your actual research.
            </p>

            {draftError && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
              >
                {draftError}
              </div>
            )}

            <button
              type="button"
              onClick={generateProblemStatement}
              disabled={draftLoading}
              className="mt-5 w-full rounded-xl bg-emerald-600 px-6 py-4 font-bold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {draftLoading
                ? 'Generating your draft...'
                : 'Generate Problem Statement'}
            </button>
          </div>
        </section>

        {draftLoading && (
          <div
            role="status"
            className="mt-7 rounded-2xl border border-emerald-100 bg-white p-6 text-sm text-slate-600"
          >
            ProjectMate is preparing your problem statement and
            objectives. This may take a little while.
          </div>
        )}

        {draft && (
          <section className="mt-7 rounded-2xl border border-emerald-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-2xl font-extrabold">
              Your Generated Draft
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-500">
              This is a starting draft, not verified research
              evidence. Check the details, add credible sources where
              needed, and consult your supervisor before submitting it.
            </p>

            <div className="mt-6 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
              {draft}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={useDraftInForm}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white hover:bg-emerald-700"
              >
                Use Draft in My Form
              </button>

              <button
                type="button"
                onClick={() => {
                  void navigator.clipboard.writeText(draft);
                }}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Copy Draft
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
              >
                Print Draft
              </button>
            </div>
          </section>
        )}

        {loading && (
          <div
            role="status"
            className="mt-7 rounded-2xl border border-indigo-100 bg-white p-6 text-sm text-slate-600"
          >
            ProjectMate is reviewing your research and preparing
            your feedback. This may take a little while.
          </div>
        )}

        {report && (
          <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-8">
            <h2 className="text-2xl font-extrabold">
              Your Research Coach Report
            </h2>

            <p className="mt-2 text-sm text-slate-500">
              Use these findings as guidance and verify them against
              your supervisor’s requirements.
            </p>

            <div className="mt-6 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
              {report}
            </div>

            <div className="mt-7 rounded-2xl border border-indigo-100 bg-indigo-50 p-5">
              <h3 className="text-lg font-bold text-slate-900">
                Save Report to My Project
              </h3>

              <p className="mt-2 text-sm leading-6 text-slate-600">
                Choose one of your existing projects to save this
                analysis report.
              </p>

              <label
                htmlFor="research-report-project"
                className="mt-4 block text-sm font-semibold text-slate-700"
              >
                Select project
              </label>

              <select
                id="research-report-project"
                value={selectedProjectId}
                onChange={(event) => {
                  setSelectedProjectId(event.target.value);
                  setSavedReports([]);
                  setSaveMessage('');
                  setSaveError('');
                  setReportsError('');
                }}
                disabled={
                  projectsLoading || projects.length === 0
                }
                className="mt-2 w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
              >
                <option value="">
                  {projectsLoading
                    ? 'Loading your projects...'
                    : projects.length === 0
                      ? 'No projects found — create a project first'
                      : 'Choose a project'}
                </option>

                {projects.map((project) => (
                  <option
                    key={project.id}
                    value={String(project.id)}
                  >
                    {project.name}
                  </option>
                ))}
              </select>

              {saveError && (
                <p
                  role="alert"
                  className="mt-3 text-sm text-red-700"
                >
                  {saveError}
                </p>
              )}

              {saveMessage && (
                <p
                  role="status"
                  className="mt-3 text-sm font-semibold text-emerald-700"
                >
                  {saveMessage}
                </p>
              )}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={saveResearchCoachReport}
                  disabled={
                    saveLoading ||
                    !report.trim() ||
                    !selectedProjectId
                  }
                  className="rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {saveLoading
                    ? 'Saving report...'
                    : 'Save Report to Project'}
                </button>

                <button
                  type="button"
                  onClick={() => void loadSavedReports()}
                  disabled={
                    reportsLoading || !selectedProjectId
                  }
                  className="rounded-xl border border-slate-300 bg-white px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reportsLoading
                    ? 'Loading saved reports...'
                    : 'View Saved Reports'}
                </button>
              </div>

              {reportsError && (
                <p
                  role="alert"
                  className="mt-3 text-sm text-red-700"
                >
                  {reportsError}
                </p>
              )}

              {savedReports.length > 0 && (
                <div className="mt-5 space-y-3">
                  <h4 className="font-bold text-slate-800">
                    Saved reports
                  </h4>

                  {savedReports.map((savedReport) => (
                    <article
                      key={savedReport.id}
                      className="rounded-xl border border-slate-200 bg-white p-4"
                    >
                      <p className="font-semibold text-slate-900">
                        {savedReport.title}
                      </p>

                      {savedReport.createdAt && (
                        <p className="mt-1 text-xs text-slate-500">
                          Saved{' '}
                          {new Date(
                            savedReport.createdAt,
                          ).toLocaleString()}
                        </p>
                      )}

                      <details className="mt-3">
                        <summary className="cursor-pointer text-sm font-semibold text-indigo-700">
                          Read saved report
                        </summary>

                        <div className="mt-3 whitespace-pre-wrap break-words text-sm leading-7 text-slate-700">
                          {savedReport.content}
                        </div>
                      </details>
                    </article>
                  ))}
                </div>
              )}

              {!reportsLoading &&
                savedReports.length === 0 &&
                saveMessage && (
                  <p className="mt-3 text-sm text-slate-500">
                    No saved reports are currently displayed.
                    Select “View Saved Reports” to refresh the list.
                  </p>
                )}
            </div>

            <button
              type="button"
              onClick={() => window.print()}
              className="mt-6 rounded-xl border border-slate-300 px-5 py-3 text-sm font-bold text-slate-700 hover:bg-slate-50"
            >
              Print Report
            </button>
          </section>
        )}
      </div>
    </main>
  );
}