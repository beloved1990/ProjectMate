
'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';

type Project = {
  id: number;
  name: string;
  description: string | null;
  submissionDate?: string | null;
  createdAt?: string;
};

type Task = {
  id: number;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
};

type TaskStats = {
  total: number;
  completed: number;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

const navigation = [
  { label: 'Overview', href: '#overview', icon: '◫' },
  { label: 'My Projects', href: '#projects', icon: '▤' },
  { label: 'New Project', href: '#new-project', icon: '+' },
];

const tools = [
  {
    label: 'AI Research Assistant',
    href: '/dashboard/ai-assistant',
    icon: '✦',
    description:
      'Get AI assistance with research questions, concepts and academic writing.',
    steps: [
      'Open the AI Research Assistant using the button below.',
      'Enter the research question or academic issue you need help with.',
      'Provide relevant project details or context where the page allows it.',
      'Submit your question and wait for the AI response.',
      'Read the explanation, review the suggestions and apply what is relevant to your research.',
      'Verify important academic claims and references before using them in your work.',
    ],
  },
  {
    label: 'Research Consistency',
    href: '/dashboard/research-consistency',
    icon: '⇄',
    description:
      'Examine whether the major parts of your research agree with one another.',
    steps: [
      'Open the Research Consistency tool.',
      'Enter your research topic.',
      'Provide your research objectives and research questions.',
      'Enter your research methodology.',
      'Where the form provides the fields, include your results and conclusions for a more complete review.',
      'Submit the information for analysis.',
      'Review the identified inconsistencies and recommendations.',
      'Correct the relevant sections of your research and review them again.',
    ],
  },
  {
    label: 'Research Coach',
    href: '/dashboard/research-coach',
    icon: '🧠',
    description:
      'Get guidance on improving the quality, direction and development of your research.',
    steps: [
      'Open the Research Coach.',
      'Provide the research information requested by the form.',
      'Make your answers as clear and accurate as possible.',
      'Submit your research for coaching and analysis.',
      'Read the feedback and identify the areas that need attention.',
      'Follow the suggested improvement priorities.',
      'Apply the recommendations to your research and review your progress.',
    ],
  },
  {
    label: 'Citation Checker',
    href: '/dashboard/citation-checker',
    icon: '✓',
    description:
      'Review your citations and references for possible formatting and consistency problems.',
    steps: [
      'Open the Citation Checker.',
      'Paste the research text containing your in-text citations.',
      'Enter the reference list you want checked.',
      'Select the citation style required for your work, such as APA 7.',
      'Submit the information for checking.',
      'Review the issues identified by the tool.',
      'Correct the relevant citations and reference entries in your document.',
      'Check the corrected work against your institution’s referencing requirements.',
    ],
  },
];

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function isSuccessMessage(message: string) {
  return /success/i.test(message);
}

export default function DashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [taskStats, setTaskStats] = useState<Record<number, TaskStats>>({});
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [submissionDate, setSubmissionDate] = useState('');
  const [today, setToday] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [userName, setUserName] = useState('Student');
  const [menuOpen, setMenuOpen] = useState(false);

  // Calculate the user's local date after the page mounts.
  // This prevents Next.js from evaluating the current time during prerendering.
  useEffect(() => {
    const now = new Date();

    const localDate = new Date(
      now.getTime() - now.getTimezoneOffset() * 60000,
    )
      .toISOString()
      .split('T')[0];

    setToday(localDate);
  }, []);

  const loadProjects = useCallback(async () => {
    const token = localStorage.getItem('projectmate_token');

    if (!token) {
      setProjects([]);
      setTaskStats({});
      setMessage('Please log in to view your projects.');
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_URL}/projects`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not load projects.');
      }

      const projectList: Project[] = data.projects ?? [];

      setProjects(projectList);
      setMessage('');

      const results = await Promise.all(
        projectList.map(async (project) => {
          try {
            const taskResponse = await fetch(
              `${API_URL}/projects/${project.id}/tasks`,
              {
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              },
            );

            if (!taskResponse.ok) {
              return [
                project.id,
                { total: 0, completed: 0 },
              ] as const;
            }

            const taskData = await taskResponse.json();
            const tasks: Task[] = taskData.tasks ?? [];

            return [
              project.id,
              {
                total: tasks.length,
                completed: tasks.filter(
                  (task) => task.status === 'COMPLETED',
                ).length,
              },
            ] as const;
          } catch {
            return [
              project.id,
              { total: 0, completed: 0 },
            ] as const;
          }
        }),
      );

      setTaskStats(Object.fromEntries(results));
    } catch (error) {
      setMessage(
        getErrorMessage(error, 'Could not connect to the backend.'),
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const savedUser = localStorage.getItem('projectmate_user');

    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        setUserName(user.name || user.username || 'Student');
      } catch {
        setUserName('Student');
      }
    }

    void loadProjects();
  }, [loadProjects]);

  async function createProject(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage('');

    const token = localStorage.getItem('projectmate_token');

    if (!token) {
      setMessage('Please log in first.');
      return;
    }

    if (!name.trim()) {
      setMessage('Please enter a project name.');
      return;
    }

    if (!submissionDate) {
      setMessage('Please select your project submission date.');
      return;
    }

    setCreating(true);

    try {
      const response = await fetch(`${API_URL}/projects`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          submissionDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Could not create project.');
      }

      setName('');
      setDescription('');
      setSubmissionDate('');
      setMessage('Project created successfully.');

      await loadProjects();
    } catch (error) {
      setMessage(
        getErrorMessage(error, 'Could not connect to the backend.'),
      );
    } finally {
      setCreating(false);
    }
  }

  function logout() {
    localStorage.removeItem('projectmate_token');
    localStorage.removeItem('projectmate_user');
    window.location.href = '/login';
  }

  const totalTasks = Object.values(taskStats).reduce(
    (sum, stats) => sum + stats.total,
    0,
  );

  const completedTasks = Object.values(taskStats).reduce(
    (sum, stats) => sum + stats.completed,
    0,
  );

  const overallProgress = totalTasks
    ? Math.round((completedTasks / totalTasks) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-slate-50 pb-20 text-slate-900 lg:pb-0">
      <div className="min-h-screen lg:flex">
        {/* Sidebar */}
        <aside className="relative z-20 flex w-full flex-col bg-[#111b3a] text-white lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:overflow-y-auto">
          <div className="flex items-center justify-between border-b border-white/10 px-5 py-5 sm:px-6">
            <Link href="/dashboard" className="flex items-center gap-3">
              <img
                src="/projectmate-icon-192.png"
                alt="ProjectMate logo"
                className="h-11 w-11 rounded-2xl object-contain"
              />

              <span>
                <span className="block text-xl font-extrabold tracking-tight">
                  Project<span className="text-indigo-300">Mate</span>
                </span>

                <span className="block text-[10px] uppercase tracking-[0.2em] text-slate-400">
                  Academic workspace
                </span>
              </span>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-expanded={menuOpen}
              aria-label={menuOpen ? 'Close navigation' : 'Open navigation'}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-xl hover:bg-white/10 lg:hidden"
            >
              {menuOpen ? '×' : '☰'}
            </button>
          </div>

          <nav
            className={`${menuOpen ? 'block' : 'hidden'} space-y-7 px-4 py-6 lg:block`}
          >
            <div>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Workspace
              </p>

              <div className="space-y-1.5">
                {navigation.map((item, index) => (
                  <a
                    key={item.label}
                    href={item.href}
                    onClick={() => setMenuOpen(false)}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      index === 0
                        ? 'bg-indigo-500/20 text-white ring-1 ring-inset ring-indigo-400/20'
                        : 'text-slate-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="w-5 text-center text-lg">
                      {item.icon}
                    </span>
                    {item.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-3 px-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                Research tools
              </p>

              <div className="space-y-1.5">
                {tools.map((tool) => (
                  <Link
                    key={tool.href}
                    href={tool.href}
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
                  >
                    <span className="w-5 text-center text-lg">
                      {tool.icon}
                    </span>
                    {tool.label}
                  </Link>
                ))}
              </div>
            </div>
          </nav>

          <div className="mt-auto hidden p-4 lg:block">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-400/20 text-lg text-indigo-200">
                ✦
              </div>

              <p className="text-sm font-bold">Your goals matter.</p>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                Organize your work, track your progress, and keep moving
                forward.
              </p>
            </div>
          </div>

          <div
            className={`${menuOpen ? 'block' : 'hidden'} border-t border-white/10 p-4 lg:block`}
          >
            <button
              type="button"
              onClick={logout}
              className="w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              ↗ <span className="ml-2">Log out</span>
            </button>
          </div>
        </aside>

        {/* Main workspace */}
        <section className="min-w-0 flex-1 px-4 py-6 sm:px-6 sm:py-8 lg:px-10 lg:py-10">
          {/* Overview */}
          <header
            id="overview"
            className="mb-8 flex scroll-mt-6 flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Your workspace
              </p>

              <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                Dashboard
              </h1>

              <p className="mt-2 text-sm text-slate-500">
                A clear view of your academic progress.
              </p>
            </div>

            <div className="flex w-fit max-w-full items-center gap-3 rounded-2xl border border-slate-200 bg-white px-3 py-2.5 shadow-sm">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-indigo-100 font-bold text-indigo-700">
                {userName.charAt(0).toUpperCase()}
              </div>

              <div className="min-w-0 pr-2">
                <p className="max-w-48 truncate text-sm font-bold text-slate-800">
                  {userName}
                </p>

                <p className="text-xs text-slate-500">Student account</p>
              </div>
            </div>
          </header>

          {/* Welcome banner */}
          <section className="relative isolate overflow-hidden rounded-3xl bg-gradient-to-br from-[#253a91] via-indigo-700 to-blue-600 p-6 text-white shadow-xl shadow-indigo-200/50 sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-16 -top-20 -z-10 h-64 w-64 rounded-full border-[35px] border-white/10" />

            <div className="pointer-events-none absolute -bottom-28 right-1/3 -z-10 h-52 w-52 rounded-full bg-blue-300/20 blur-3xl" />

            <div className="max-w-2xl">
              <p className="text-sm font-medium text-indigo-100">
                Welcome back, {userName} 👋
              </p>

              <h2 className="mt-3 text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl">
                Let&apos;s make progress on your project.
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-indigo-100 sm:text-base">
                Keep your research organized, manage your academic work, and
                take the next step toward completing your project.
              </p>

              <a
                href="#new-project"
                className="mt-6 inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-indigo-700 shadow-sm transition hover:-translate-y-0.5 hover:bg-indigo-50 focus:outline-none focus:ring-4 focus:ring-white/40"
              >
                <span aria-hidden="true">+</span> Create a project
              </a>
            </div>
          </section>

          {/* Summary cards */}
          <section
            aria-label="Workspace statistics"
            className="mt-7 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3"
          >
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">
                  Total projects
                </p>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-lg text-indigo-600">
                  ▤
                </span>
              </div>

              <p className="mt-4 text-3xl font-extrabold tracking-tight">
                {loading ? '—' : projects.length}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Projects in your workspace
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">
                  Total tasks
                </p>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-sky-50 text-lg text-sky-600">
                  ☷
                </span>
              </div>

              <p className="mt-4 text-3xl font-extrabold tracking-tight">
                {loading ? '—' : totalTasks}
              </p>

              <p className="mt-2 text-xs text-slate-500">
                Tasks across your projects
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition hover:shadow-md sm:col-span-2 xl:col-span-1">
              <div className="flex items-center justify-between gap-3">
                <p className="text-sm font-medium text-slate-500">
                  Task completion
                </p>
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
                  ✓
                </span>
              </div>

              <p className="mt-4 text-3xl font-extrabold tracking-tight">
                {loading ? '—' : `${overallProgress}%`}
              </p>

              <div
                className="mt-4 h-2.5 overflow-hidden rounded-full bg-slate-100"
                role="progressbar"
                aria-label="Overall task completion"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={overallProgress}
              >
                <div
                  className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              <p className="mt-2 text-xs text-slate-500">
                {loading
                  ? 'Loading task statistics...'
                  : `${completedTasks} of ${totalTasks} tasks completed`}
              </p>
            </div>
          </section>

          {/* Overview instructions */}
          <section className="mt-5 rounded-2xl border border-indigo-100 bg-indigo-50/70 p-5">
            <h3 className="text-sm font-bold text-indigo-900">
              Understanding your dashboard
            </h3>

            <div className="mt-3 grid gap-4 text-sm leading-6 text-slate-600 md:grid-cols-3">
              <div>
                <p className="font-bold text-slate-800">Total projects</p>
                <p>
                  Shows the number of research projects you have created and
                  saved in your workspace.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800">Total tasks</p>
                <p>
                  Shows the combined number of tasks created across all your
                  projects.
                </p>
              </div>

              <div>
                <p className="font-bold text-slate-800">Task completion</p>
                <p>
                  Shows the percentage of tasks marked as completed. Update
                  your task statuses to keep this figure accurate.
                </p>
              </div>
            </div>

            <p className="mt-4 border-t border-indigo-100 pt-3 text-xs leading-5 text-indigo-800">
              Tip: Open a project under My Projects to manage its tasks and
              keep your progress up to date.
            </p>
          </section>

          {/* Create project */}
          <section id="new-project" className="mt-10 scroll-mt-6 sm:mt-12">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Get started
              </p>

              <h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
                Create a new project
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Give your research a home. You can update your project later.
              </p>

              <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
                <h3 className="text-sm font-bold text-indigo-900">
                  How to create your project
                </h3>

                <ol className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                  <li>
                    <strong>1. Project name:</strong> Enter the title of your
                    research or academic project.
                  </li>
                  <li>
                    <strong>2. Project description:</strong> Briefly explain
                    what your research is about.
                  </li>
                  <li>
                    <strong>3. Submission date:</strong> Select the date you
                    are expected to submit your project.
                  </li>
                  <li>
                    <strong>4. Create project:</strong> Click the button to
                    save your project to your workspace.
                  </li>
                  <li>
                    <strong>5. Open your project:</strong> Select its card to
                    enter the project workspace.
                  </li>
                </ol>

                <p className="mt-3 text-xs font-medium text-indigo-700">
                  Your project details and submission date will be saved to
                  your account.
                </p>
              </div>
            </div>

            <form
              onSubmit={createProject}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7"
            >
              <div className="grid gap-5 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="project-name"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Project name
                  </label>

                  <input
                    id="project-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Final Year Research"
                    required
                    maxLength={150}
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="project-description"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Project description
                  </label>

                  <input
                    id="project-description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Briefly describe your research"
                    maxLength={500}
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="submission-date"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Project submission date
                  </label>

                  <input
                    id="submission-date"
                    type="date"
                    value={submissionDate}
                    onChange={(e) => setSubmissionDate(e.target.value)}
                    required
                    min={today}
                    className="min-h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-100"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-4 border-t border-slate-100 pt-5 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-xs leading-5 text-slate-500">
                  Your project will be saved to your account.
                </p>

                <button
                  type="submit"
                  disabled={creating}
                  className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:-translate-y-0.5 hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                >
                  {creating ? 'Creating project...' : 'Create project'}
                  {!creating && <span aria-hidden="true">→</span>}
                </button>
              </div>
            </form>

            {message && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-5 rounded-xl border px-4 py-3 text-sm leading-6 ${
                  isSuccessMessage(message)
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                    : 'border-amber-200 bg-amber-50 text-amber-800'
                }`}
              >
                {message}

                {message.toLowerCase().includes('log in') && (
                  <Link
                    href="/login"
                    className="ml-2 font-bold underline underline-offset-4"
                  >
                    Go to login
                  </Link>
                )}
              </div>
            )}
          </section>

          {/* My Projects */}
          <section id="projects" className="mt-10 scroll-mt-6 sm:mt-12">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                  Your academic work
                </p>

                <h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
                  My Projects
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  All your saved projects in one place.
                </p>
              </div>

              <span className="w-fit rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
                {projects.length}{' '}
                {projects.length === 1 ? 'project' : 'projects'}
              </span>
            </div>

            <div className="mt-4 rounded-xl border border-indigo-100 bg-indigo-50/70 p-4">
              <h3 className="text-sm font-bold text-indigo-900">
                How to use My Projects
              </h3>

              <ol className="mt-2 space-y-2 text-sm leading-6 text-slate-600">
                <li>
                  <strong>1. Find your project:</strong> Locate the project
                  card you want to work on.
                </li>
                <li>
                  <strong>2. Open the workspace:</strong> Click the project
                  card or Open workspace link.
                </li>
                <li>
                  <strong>3. Create tasks:</strong> Inside the project
                  workspace, use the task creation area to add the activities
                  you need to complete.
                </li>
                <li>
                  <strong>4. Describe each task:</strong> Give each task a
                  clear title and add a description or deadline where
                  available.
                </li>
                <li>
                  <strong>5. Update task status:</strong> Mark tasks as To do,
                  In progress or Completed as you work on them.
                </li>
                <li>
                  <strong>6. Review your progress:</strong> Return to the
                  dashboard to see the updated task count and completion
                  percentage.
                </li>
              </ol>
            </div>

            {loading ? (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {[1, 2, 3].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-slate-200 bg-white p-6"
                  >
                    <div className="h-11 w-11 rounded-xl bg-slate-100" />
                    <div className="mt-5 h-5 w-2/3 rounded bg-slate-100" />
                    <div className="mt-3 h-4 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-4 w-4/5 rounded bg-slate-100" />
                    <div className="mt-7 h-2 rounded-full bg-slate-100" />
                  </div>
                ))}
              </div>
            ) : projects.length === 0 ? (
              <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-5 py-12 text-center sm:px-8">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-2xl text-indigo-600">
                  ▤
                </div>

                <h3 className="mt-4 text-lg font-bold text-slate-900">
                  Your first project starts here
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Create a project above to begin organizing your academic
                  work.
                </p>

                <a
                  href="#new-project"
                  className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                >
                  Create your first project
                </a>
              </div>
            ) : (
              <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {projects.map((project) => {
                  const stats = taskStats[project.id] ?? {
                    total: 0,
                    completed: 0,
                  };

                  const progress = stats.total
                    ? Math.round((stats.completed / stats.total) * 100)
                    : 0;

                  return (
                    <Link
                      href={`/dashboard/projects/${project.id}`}
                      key={project.id}
                      className="group flex min-w-0 flex-col rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/40 focus:outline-none focus:ring-4 focus:ring-indigo-100 sm:p-6"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600 transition group-hover:bg-indigo-100">
                          ▤
                        </div>

                        <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                          Saved
                        </span>
                      </div>

                      <h3 className="mt-5 break-words text-lg font-bold leading-snug text-slate-900">
                        {project.name}
                      </h3>

                      <p className="mt-2 min-h-12 break-words text-sm leading-6 text-slate-500">
                        {project.description ||
                          'No description provided yet.'}
                      </p>

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <div className="flex items-center justify-between gap-2 text-sm">
                          <span className="text-slate-500">
                            Task progress
                          </span>

                          <span className="font-bold text-indigo-600">
                            {progress}%
                          </span>
                        </div>

                        <div
                          className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100"
                          role="progressbar"
                          aria-label={`${project.name} task completion`}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-valuenow={progress}
                        >
                          <div
                            className="h-full rounded-full bg-indigo-600 transition-all duration-500"
                            style={{ width: `${progress}%` }}
                          />
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500">
                          <span>{stats.total} total tasks</span>
                          <span>{stats.completed} completed</span>
                        </div>
                      </div>

                      <div className="mt-5 flex items-center justify-between gap-3 border-t border-slate-100 pt-4">
                        <span className="text-xs text-slate-400">
                          Project #{project.id}
                        </span>

                        <span className="text-sm font-bold text-indigo-600">
                          Open workspace <span aria-hidden="true">→</span>
                        </span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </section>

          {/* Feature Guides */}
          <section id="feature-guides" className="mt-12 scroll-mt-6 sm:mt-16">
            <div className="mb-6">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-600">
                Learn ProjectMate
              </p>

              <h2 className="mt-2 text-xl font-extrabold tracking-tight sm:text-2xl">
                Step-by-step feature guides
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Follow these instructions to understand how to use each
                research tool and get the most out of your workspace.
              </p>
            </div>

            <div className="grid gap-5 xl:grid-cols-2">
              {tools.map((tool, index) => (
                <article
                  key={tool.href}
                  className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-xl text-indigo-600">
                      {tool.icon}
                    </div>

                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                        Research tool {index + 1}
                      </p>

                      <h3 className="mt-1 text-lg font-extrabold text-slate-900">
                        {tool.label}
                      </h3>

                      <p className="mt-2 text-sm leading-6 text-slate-500">
                        {tool.description}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 border-t border-slate-100 pt-4">
                    <h4 className="text-sm font-bold text-slate-800">
                      How to use this tool
                    </h4>

                    <ol className="mt-3 space-y-3">
                      {tool.steps.map((step, stepIndex) => (
                        <li
                          key={stepIndex}
                          className="flex items-start gap-3 text-sm leading-6 text-slate-600"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-xs font-bold text-indigo-700">
                            {stepIndex + 1}
                          </span>

                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <Link
                    href={tool.href}
                    className="mt-5 inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-200"
                  >
                    Open {tool.label}
                    <span aria-hidden="true">→</span>
                  </Link>
                </article>
              ))}
            </div>

            <div className="mt-6 rounded-2xl border border-amber-100 bg-amber-50 p-5">
              <h3 className="text-sm font-bold text-amber-900">
                Important academic reminder
              </h3>

              <p className="mt-2 text-sm leading-6 text-amber-800">
                ProjectMate AI tools are designed to support your research,
                not replace your academic judgment. Always review generated
                suggestions, verify factual claims and references, and follow
                your institution&apos;s academic guidelines.
              </p>
            </div>
          </section>

          <footer className="mt-12 border-t border-slate-200 py-6 text-center text-xs leading-6 text-slate-400">
            ProjectMate · Your project. Your research. Your success.
          </footer>
        </section>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Mobile navigation"
        className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 px-2 pb-[env(safe-area-inset-bottom)] shadow-[0_-4px_16px_rgba(15,23,42,0.06)] backdrop-blur lg:hidden"
      >
        <div className="mx-auto grid max-w-lg grid-cols-4">
          <a
            href="#overview"
            className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
          >
            <span aria-hidden="true" className="text-xl">
              ⌂
            </span>
            <span>Home</span>
          </a>

          <a
            href="#projects"
            className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
          >
            <span aria-hidden="true" className="text-xl">
              ▤
            </span>
            <span>Projects</span>
          </a>

          <a
            href="#new-project"
            className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
          >
            <span aria-hidden="true" className="text-xl">
              ＋
            </span>
            <span>New project</span>
          </a>

          <Link
            href="/dashboard/ai-assistant"
            className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-xl px-1 text-xs font-semibold text-slate-600 transition hover:bg-indigo-50 hover:text-indigo-700"
          >
            <span aria-hidden="true" className="text-xl">
              ✦
            </span>
            <span>AI Assistant</span>
          </Link>
        </div>
      </nav>
    </main>
  );
}
