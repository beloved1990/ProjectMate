
'use client';

import {
  Suspense,
  useCallback,
  useEffect,
  useState,
  type FormEvent,
} from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

type Project = {
  id: number;
  name: string;
  description: string | null;
};

type Assignee = {
  id: number;
  name: string | null;
  username: string | null;
  email: string;
};

type Task = {
  id: number;
  title: string;
  description?: string | null;
  status: 'TODO' | 'IN_PROGRESS' | 'COMPLETED';
  deadline?: string | null;
  assignees?: Assignee[];
};

type User = {
  id: number;
  name: string | null;
  username: string | null;
  email: string;
};

type Correction = {
  id: number;
  taskId: number;
  userId: number;
  comment: string;
  status: string;
  author?: {
    id: number;
    name: string | null;
    username: string | null;
    email: string;
  } | null;
};

const API = process.env.NEXT_PUBLIC_API_URL;

async function readResponse(response: Response): Promise<any> {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return { message: text };
  }
}

function statusLabel(status: Task['status']) {
  if (status === 'COMPLETED') return 'Completed';
  if (status === 'IN_PROGRESS') return 'In progress';
  return 'To do';
}

function ProjectWorkspaceContent() {
  const params = useParams<{ id: string }>();
  const projectId = params.id;

  const [project, setProject] = useState<Project | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);

  const [corrections, setCorrections] = useState<
    Record<number, Correction[]>
  >({});
  const [correctionInputs, setCorrectionInputs] = useState<
    Record<number, string>
  >({});
  const [savingCorrectionTaskId, setSavingCorrectionTaskId] =
    useState<number | null>(null);
  const [updatingCorrectionId, setUpdatingCorrectionId] =
    useState<number | null>(null);

  const [selectedUsers, setSelectedUsers] = useState<
    Record<number, string>
  >({});
  const [assigningTaskId, setAssigningTaskId] = useState<number | null>(
    null,
  );

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [message, setMessage] = useState('');

  const getToken = () => {
    const token = localStorage.getItem('projectmate_token');

    if (!token) {
      window.location.href = '/login';
      return null;
    }

    return token;
  };

  const loadWorkspace = useCallback(async () => {
    const token = localStorage.getItem('projectmate_token');

    if (!token) {
      window.location.href = '/login';
      return;
    }

    try {
      setLoading(true);

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      // Load the user's projects.
      const projectResponse = await fetch(`${API}/projects`, { headers });
      const projectData = await readResponse(projectResponse);

      if (!projectResponse.ok) {
        throw new Error(
          projectData.message || 'Could not load your projects.',
        );
      }

      const projects: Project[] = Array.isArray(projectData)
        ? projectData
        : Array.isArray(projectData.projects)
          ? projectData.projects
          : [];

      const foundProject = projects.find(
        (item) => String(item.id) === String(projectId),
      );

      if (!foundProject) {
        setProject(null);
        throw new Error('Project not found in your account.');
      }

      setProject(foundProject);

      // Load the project's tasks.
      const taskResponse = await fetch(
        `${API}/projects/${projectId}/tasks`,
        { headers },
      );
      const taskData = await readResponse(taskResponse);

      if (!taskResponse.ok) {
        throw new Error(
          taskData.message || 'Could not load project tasks.',
        );
      }

      const taskList: Task[] = Array.isArray(taskData)
        ? taskData
        : Array.isArray(taskData.tasks)
          ? taskData.tasks
          : [];

      setTasks(taskList);

      // Load registered users for task assignment.
      const usersResponse = await fetch(`${API}/users`, { headers });
      const usersData = await readResponse(usersResponse);

      if (!usersResponse.ok) {
        throw new Error(
          usersData.message || 'Could not load registered users.',
        );
      }

      const userList: User[] = Array.isArray(usersData)
        ? usersData
        : Array.isArray(usersData.users)
          ? usersData.users
          : [];

      setUsers(userList);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to connect to the server.',
      );
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    void loadWorkspace();
  }, [loadWorkspace]);

  async function createTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const token = getToken();
    if (!token) return;

    if (!title.trim()) {
      setMessage('Please enter a task title.');
      return;
    }

    setCreating(true);
    setMessage('');

    try {
      const body: {
        title: string;
        description: string;
        deadline?: string;
      } = {
        title: title.trim(),
        description: description.trim(),
      };

      if (deadline) {
        const deadlineDate = new Date(`${deadline}T23:59:00`);

        if (Number.isNaN(deadlineDate.getTime())) {
          throw new Error('Please enter a valid deadline.');
        }

        body.deadline = deadlineDate.toISOString();
      }

      const response = await fetch(
        `${API}/projects/${projectId}/tasks`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        },
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || 'Could not create task.');
      }

      setTitle('');
      setDescription('');
      setDeadline('');

      await loadWorkspace();
      setMessage('Task created successfully.');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to create task.',
      );
    } finally {
      setCreating(false);
    }
  }

  async function updateTaskStatus(task: Task) {
    const token = getToken();
    if (!token) return;

    const nextStatus: Task['status'] =
      task.status === 'TODO'
        ? 'IN_PROGRESS'
        : task.status === 'IN_PROGRESS'
          ? 'COMPLETED'
          : 'TODO';

    try {
      setMessage('');

      const response = await fetch(
        `${API}/projects/${projectId}/tasks/${task.id}/status`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: nextStatus }),
        },
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || 'Could not update task status.');
      }

      setTasks((current) =>
        current.map((item) =>
          item.id === task.id ? { ...item, status: nextStatus } : item,
        ),
      );

      setMessage('Task status updated successfully.');
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to update task.',
      );
    }
  }

  async function assignTask(task: Task) {
    const token = getToken();
    if (!token) return;

    const selectedUserId = selectedUsers[task.id];

    if (!selectedUserId) {
      setMessage('Please select a user before assigning this task.');
      return;
    }

    setAssigningTaskId(task.id);
    setMessage('');

    try {
      const response = await fetch(
        `${API}/projects/${projectId}/tasks/${task.id}/assign`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            assignedUserId: Number(selectedUserId),
          }),
        },
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(data.message || 'Could not assign task.');
      }

      await loadWorkspace();
      setMessage(`Task "${task.title}" assigned successfully.`);
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : 'Unable to assign task.',
      );
    } finally {
      setAssigningTaskId(null);
    }
  }

  async function loadCorrections(task: Task) {
    const token = getToken();
    if (!token) return;

    try {
      const response = await fetch(
        `${API}/projects/${projectId}/tasks/${task.id}/corrections`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message || 'Could not load task corrections.',
        );
      }

      setCorrections((current) => ({
        ...current,
        [task.id]: Array.isArray(data.corrections)
          ? data.corrections
          : [],
      }));
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to load task corrections.',
      );
    }
  }

  async function submitCorrection(task: Task) {
    const token = getToken();
    if (!token) return;

    const comment = (correctionInputs[task.id] ?? '').trim();

    if (!comment) {
      setMessage('Please enter a correction or feedback comment.');
      return;
    }

    setSavingCorrectionTaskId(task.id);
    setMessage('');

    try {
      const response = await fetch(
        `${API}/projects/${projectId}/tasks/${task.id}/corrections`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ comment }),
        },
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message || 'Could not submit correction.',
        );
      }

      setCorrectionInputs((current) => ({
        ...current,
        [task.id]: '',
      }));

      await loadCorrections(task);
      setMessage('Correction submitted successfully.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to submit correction.',
      );
    } finally {
      setSavingCorrectionTaskId(null);
    }
  }

  async function updateCorrectionStatus(
    task: Task,
    correctionId: number,
    status: 'PENDING' | 'COMPLETED',
  ) {
    const token = getToken();
    if (!token) return;

    setUpdatingCorrectionId(correctionId);
    setMessage('');

    try {
      const response = await fetch(
        `${API}/projects/${projectId}/tasks/${task.id}/corrections/${correctionId}/status`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status }),
        },
      );

      const data = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          data.message || 'Could not update correction status.',
        );
      }

      await loadCorrections(task);
      setMessage('Correction status updated successfully.');
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : 'Unable to update correction status.',
      );
    } finally {
      setUpdatingCorrectionId(null);
    }
  }

  const completedCount = tasks.filter(
    (task) => task.status === 'COMPLETED',
  ).length;

  const progress = tasks.length
    ? Math.round((completedCount / tasks.length) * 100)
    : 0;

  return (
    <main className="min-h-screen bg-[#f5f7fb] px-5 py-8 text-slate-900 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-800"
        >
          ← Back to dashboard
        </Link>

        {loading && !project ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8 text-slate-500">
            Loading project workspace...
          </div>
        ) : !project ? (
          <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-8">
            <h1 className="text-xl font-bold">Workspace unavailable</h1>
            <p className="mt-3 text-sm text-slate-600">
              {message || 'This project could not be found.'}
            </p>
          </div>
        ) : (
          <>
            <header className="mt-7 rounded-3xl bg-gradient-to-br from-indigo-700 to-blue-600 p-6 text-white shadow-lg sm:p-9">
              <p className="text-sm font-semibold text-indigo-100">
                PROJECT WORKSPACE
              </p>

              <h1 className="mt-3 break-words text-3xl font-extrabold sm:text-4xl">
                {project.name}
              </h1>

              <p className="mt-3 max-w-2xl leading-7 text-indigo-100">
                {project.description ||
                  'Your dedicated space for managing this project.'}
              </p>

              <div className="mt-7 flex flex-wrap gap-6">
                <div>
                  <p className="text-sm text-indigo-100">Total tasks</p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {tasks.length}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-indigo-100">Completed</p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {completedCount}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-indigo-100">Progress</p>
                  <p className="mt-1 text-2xl font-extrabold">
                    {progress}%
                  </p>
                </div>
              </div>

              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/20">
                <div
                  className="h-full rounded-full bg-white transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </header>

            {message && (
              <div
                role="status"
                aria-live="polite"
                className="mt-5 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
              >
                {message}
              </div>
            )}

            <section className="mt-9">
              <h2 className="text-2xl font-extrabold">Add a task</h2>
              <p className="mt-2 text-sm text-slate-500">
                Break your project into smaller, manageable activities.
              </p>

              <form
                onSubmit={createTask}
                className="mt-5 space-y-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"
              >
                <div>
                  <label
                    htmlFor="task-title"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Task title
                  </label>
                  <input
                    id="task-title"
                    value={title}
                    onChange={(event) => setTitle(event.target.value)}
                    placeholder="e.g. Complete Chapter One"
                    required
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-description"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="task-description"
                    value={description}
                    onChange={(event) =>
                      setDescription(event.target.value)
                    }
                    placeholder="Describe what needs to be done"
                    rows={3}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                  />
                </div>

                <div>
                  <label
                    htmlFor="task-deadline"
                    className="mb-2 block text-sm font-bold text-slate-700"
                  >
                    Deadline (optional)
                  </label>
                  <input
                    id="task-deadline"
                    type="date"
                    value={deadline}
                    onChange={(event) => setDeadline(event.target.value)}
                    className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 sm:max-w-sm"
                  />
                </div>

                <button
                  type="submit"
                  disabled={creating}
                  className="rounded-xl bg-indigo-600 px-6 py-3 font-bold text-white transition hover:bg-indigo-700 disabled:opacity-60"
                >
                  {creating ? 'Adding task...' : '+ Add task'}
                </button>
              </form>
            </section>

            <section className="mt-10">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <h2 className="text-2xl font-extrabold">Project tasks</h2>
                  <p className="mt-2 text-sm text-slate-500">
                    Track progress, assign tasks, and manage feedback.
                  </p>
                </div>

                <span className="rounded-full bg-white px-3 py-2 text-sm font-semibold text-slate-600 ring-1 ring-slate-200">
                  {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                </span>
              </div>

              {loading ? (
                <p className="mt-6 rounded-2xl bg-white p-6 text-sm text-slate-500">
                  Refreshing tasks...
                </p>
              ) : tasks.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center">
                  <h3 className="font-bold text-slate-900">No tasks yet</h3>
                  <p className="mt-2 text-sm text-slate-500">
                    Add your first task above to start tracking progress.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-5">
                  {tasks.map((task) => (
                    <article
                      key={task.id}
                      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <h3 className="break-words text-lg font-bold">
                            {task.title}
                          </h3>

                          <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500">
                            {task.description || 'No description provided.'}
                          </p>

                          <p className="mt-3 text-xs text-slate-400">
                            Deadline:{' '}
                            {task.deadline
                              ? new Date(task.deadline).toLocaleDateString()
                              : 'Not set'}
                          </p>
                        </div>

                        <div className="flex shrink-0 flex-col items-start gap-3 sm:items-end">
                          <span
                            className={`rounded-full px-3 py-1.5 text-xs font-bold ${
                              task.status === 'COMPLETED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : task.status === 'IN_PROGRESS'
                                  ? 'bg-blue-50 text-blue-700'
                                  : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {statusLabel(task.status)}
                          </span>

                          <button
                            type="button"
                            onClick={() => void updateTaskStatus(task)}
                            className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-indigo-600 transition hover:border-indigo-200 hover:bg-indigo-50"
                          >
                            {task.status === 'TODO'
                              ? 'Start task →'
                              : task.status === 'IN_PROGRESS'
                                ? 'Mark completed ✓'
                                : 'Reopen task ↻'}
                          </button>
                        </div>
                      </div>

                      <div className="mt-5 rounded-xl bg-slate-50 p-4">
                        <p className="text-sm font-semibold text-slate-700">
                          {task.assignees?.length
                            ? 'Assigned to'
                            : 'Not assigned yet'}
                        </p>

                        {task.assignees?.length ? (
                          <ul className="mt-2 space-y-1">
                            {task.assignees.map((assignee) => (
                              <li
                                key={assignee.id}
                                className="text-sm text-slate-600"
                              >
                                {assignee.name ||
                                  assignee.username ||
                                  assignee.email}{' '}
                                ({assignee.email})
                              </li>
                            ))}
                          </ul>
                        ) : null}
                      </div>

                      <div className="mt-5 border-t border-slate-200 pt-4">
                        <h4 className="mb-3 text-sm font-semibold text-slate-800">
                          Assign this task to
                        </h4>

                        <div className="flex flex-col gap-2 sm:flex-row">
                          <select
                            aria-label={`Assign ${task.title} to a user`}
                            value={selectedUsers[task.id] ?? ''}
                            onChange={(event) =>
                              setSelectedUsers((current) => ({
                                ...current,
                                [task.id]: event.target.value,
                              }))
                            }
                            className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:border-indigo-500"
                          >
                            <option value="">
                              Select a registered user
                            </option>

                            {users
                              .filter(
                                (user) =>
                                  !(task.assignees ?? []).some(
                                    (assignee) =>
                                      assignee.id === user.id,
                                  ),
                              )
                              .map((user) => (
                                <option key={user.id} value={user.id}>
                                  {user.name ||
                                    user.username ||
                                    user.email}{' '}
                                  ({user.email})
                                </option>
                              ))}
                          </select>

                          <button
                            type="button"
                            onClick={() => void assignTask(task)}
                            disabled={
                              assigningTaskId === task.id ||
                              users.length === 0
                            }
                            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-bold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {assigningTaskId === task.id
                              ? 'Assigning...'
                              : 'Assign task'}
                          </button>
                        </div>

                        {users.length === 0 && (
                          <p className="mt-2 text-xs text-slate-500">
                            No registered users were found.
                          </p>
                        )}
                      </div>

                      <div className="mt-5 border-t border-slate-200 pt-4">
                        <h4 className="mb-3 text-sm font-semibold text-slate-800">
                          Corrections &amp; Feedback
                        </h4>

                        <form
                          onSubmit={(event) => {
                            event.preventDefault();
                            void submitCorrection(task);
                          }}
                          className="space-y-3"
                        >
                          <textarea
                            aria-label={`Correction or feedback for ${task.title}`}
                            value={correctionInputs[task.id] ?? ''}
                            onChange={(event) =>
                              setCorrectionInputs((current) => ({
                                ...current,
                                [task.id]: event.target.value,
                              }))
                            }
                            placeholder="Enter correction or feedback for this task..."
                            rows={3}
                            className="w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-blue-500"
                          />

                          <button
                            type="submit"
                            disabled={savingCorrectionTaskId === task.id}
                            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
                          >
                            {savingCorrectionTaskId === task.id
                              ? 'Submitting...'
                              : 'Submit Correction'}
                          </button>
                        </form>

                        <button
                          type="button"
                          onClick={() => void loadCorrections(task)}
                          className="mt-3 text-sm font-medium text-blue-600 hover:underline"
                        >
                          Load Previous Feedback
                        </button>

                        {corrections[task.id] !== undefined && (
                          <div className="mt-4 space-y-3">
                            <div className="flex items-center justify-between gap-3">
                              <h5 className="text-sm font-semibold text-slate-800">
                                Feedback History
                              </h5>

                              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                                {corrections[task.id].length}{' '}
                                {corrections[task.id].length === 1
                                  ? 'comment'
                                  : 'comments'}
                              </span>
                            </div>

                            {corrections[task.id].length === 0 ? (
                              <div className="rounded-xl border border-dashed border-slate-300 p-5 text-center">
                                <p className="text-sm text-slate-500">
                                  No feedback has been submitted for this
                                  task yet.
                                </p>
                              </div>
                            ) : (
                              corrections[task.id].map((correction) => (
                                <div
                                  key={correction.id}
                                  className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
                                >
                                  <div className="flex flex-wrap items-center justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-2">
                                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                                        {(
                                          correction.author?.name ||
                                          correction.author?.username ||
                                          correction.author?.email ||
                                          'U'
                                        )
                                          .charAt(0)
                                          .toUpperCase()}
                                      </div>

                                      <div className="min-w-0">
                                        <p className="break-words text-sm font-semibold text-slate-800">
                                          {correction.author?.name ||
                                            correction.author?.username ||
                                            correction.author?.email ||
                                            'User'}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                          Task feedback
                                        </p>
                                      </div>
                                    </div>

                                    <div className="flex flex-wrap items-center gap-2">
                                      <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                                          correction.status === 'PENDING'
                                            ? 'bg-amber-100 text-amber-800'
                                            : correction.status ===
                                                    'COMPLETED' ||
                                                correction.status ===
                                                    'RESOLVED'
                                              ? 'bg-emerald-100 text-emerald-800'
                                              : 'bg-slate-100 text-slate-700'
                                        }`}
                                      >
                                        {correction.status.replace(
                                          /_/g,
                                          ' ',
                                        )}
                                      </span>

                                      {correction.status === 'PENDING' && (
                                        <button
                                          type="button"
                                          disabled={
                                            updatingCorrectionId ===
                                            correction.id
                                          }
                                          onClick={() =>
                                            void updateCorrectionStatus(
                                              task,
                                              correction.id,
                                              'COMPLETED',
                                            )
                                          }
                                          className="rounded-lg bg-emerald-600 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                          {updatingCorrectionId ===
                                          correction.id
                                            ? 'Updating...'
                                            : 'Mark as Completed'}
                                        </button>
                                      )}
                                    </div>
                                  </div>

                                  <div className="mt-4 border-t border-slate-100 pt-3">
                                    <p className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-700">
                                      {correction.comment}
                                    </p>
                                  </div>
                                </div>
                              ))
                            )}
                          </div>
                        )}
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </main>
  );
}

export default function ProjectWorkspacePage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#f5f7fb] p-8 text-slate-600">
          Loading project workspace...
        </main>
      }
    >
      <ProjectWorkspaceContent />
    </Suspense>
  );
}
