
import Link from 'next/link';

const features = [
  {
    number: '01',
    icon: '⌕',
    title: 'Topic Explorer',
    description:
      'Discover relevant project topics, explore research directions, and choose a topic that fits your field of study.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    number: '02',
    icon: '▤',
    title: 'Project Workspace',
    description:
      'Keep your chapters, research materials, project tasks, and important deadlines organized in one place.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    number: '03',
    icon: '✳',
    title: 'AI Research Assistant',
    description:
      'Understand difficult research concepts, improve your thinking, and get guidance throughout your project.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    number: '04',
    icon: '⌘',
    title: 'Project Intelligence',
    description:
      'Review the connections between your objectives, research questions, methodology, and findings.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    number: '05',
    icon: '↗',
    title: 'Progress Tracking',
    description:
      'Break your research into manageable tasks, monitor progress, and stay aware of upcoming deadlines.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    number: '06',
    icon: '◎',
    title: 'Defense Preparation',
    description:
      'Practice explaining your work, review key concepts, and prepare for questions about your research.',
    color: 'bg-rose-50 text-rose-600',
  },
];

const steps = [
  {
    number: '01',
    title: 'Choose your direction',
    description: 'Explore ideas and identify a suitable research topic.',
  },
  {
    number: '02',
    title: 'Build your project',
    description: 'Organize chapters, research materials, and tasks.',
  },
  {
    number: '03',
    title: 'Review your progress',
    description: 'Check your work and identify areas that need attention.',
  },
  {
    number: '04',
    title: 'Prepare to defend',
    description: 'Understand your research and communicate it confidently.',
  },
];

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/90 backdrop-blur-xl">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-200">
              P
            </span>
            <span className="text-xl font-extrabold tracking-tight">
              Project<span className="text-indigo-600">Mate</span>
            </span>
          </Link>

          <div className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-indigo-600">
              Features
            </a>
            <a href="#how-it-works" className="transition hover:text-indigo-600">
              How it works
            </a>
            <a href="#about" className="transition hover:text-indigo-600">
              About
            </a>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:inline-flex"
            >
              Log in
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 sm:px-5"
            >
              Get started <span aria-hidden="true">→</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate bg-[#f7f8ff]">
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#a5b4fc_0.8px,transparent_0.8px)] bg-[size:24px_24px] opacity-30" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-20 sm:px-8 sm:py-24 lg:grid-cols-2 lg:gap-12 lg:py-28">
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white/80 px-4 py-2 text-xs font-bold tracking-wide text-indigo-700 shadow-sm sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              BUILT FOR YOUR ACADEMIC JOURNEY
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Your final-year project,
              <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                under control.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              From choosing a research topic to preparing for your defense,
              ProjectMate helps you organize your work, understand your
              research, and move forward with confidence.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/login"
                className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 font-bold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-1 hover:bg-indigo-700"
              >
                Start your project <span aria-hidden="true">→</span>
              </Link>
              <a
                href="#features"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                Explore features
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="font-bold text-emerald-600">✓</span>
                Organized project work
              </span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-emerald-600">✓</span>
                Progress tracking
              </span>
            </div>
          </div>

          {/* Product preview */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-indigo-200/70 to-blue-100/50 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white bg-white shadow-2xl shadow-indigo-200/50">
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 font-bold text-white">
                    P
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      ProjectMate
                    </p>
                    <p className="text-xs text-slate-500">My workspace</p>
                  </div>
                </div>
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  ● Workspace
                </span>
              </div>

              <div className="bg-slate-50/80 p-5 sm:p-7">
                <div className="mb-6 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-indigo-600">
                      YOUR OVERVIEW
                    </p>
                    <h2 className="mt-2 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
                      Keep making progress.
                    </h2>
                    <p className="mt-1 text-sm text-slate-500">
                      Your academic work, in one place.
                    </p>
                  </div>
                  <div className="rounded-xl bg-indigo-100 p-3 text-xl text-indigo-700">
                    ✦
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Projects
                      </span>
                      <span className="text-indigo-600">▤</span>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900">
                      <span className="text-indigo-600">03</span>
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Your workspace
                    </p>
                  </div>

                  <div className="rounded-xl border border-slate-100 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-slate-500">
                        Tasks
                      </span>
                      <span className="text-blue-600">✓</span>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold text-slate-900">
                      12
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Work items
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-slate-100 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-500">
                        CURRENT PROJECT
                      </p>
                      <h3 className="mt-2 font-bold text-slate-900">
                        My Final Year Project
                      </h3>
                    </div>
                    <span className="rounded-lg bg-amber-50 px-2.5 py-1.5 text-xs font-semibold text-amber-700">
                      In progress
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-600">
                      Project workspace
                    </span>
                    <span className="font-bold text-indigo-600">
                      Stay on track
                    </span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div className="h-full w-[65%] rounded-full bg-gradient-to-r from-indigo-600 to-blue-500" />
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Organize your tasks and keep your research moving forward.
                  </p>
                </div>

                <div className="mt-4 flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50/80 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-lg text-indigo-600 shadow-sm">
                    ✳
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      Research with purpose
                    </p>
                    <p className="mt-0.5 text-xs leading-5 text-slate-600">
                      Understand your work, one step at a time.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xl sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg text-emerald-700">
                ✓
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Every step counts
                </p>
                <p className="text-xs text-slate-500">
                  Make progress at your pace
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audience strip */}
      <section className="border-y border-slate-100 bg-white px-5 py-7 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 text-center md:flex-row md:text-left">
          <p className="text-sm font-semibold text-slate-500">
            Supporting students across different academic paths
          </p>
          <div className="flex flex-wrap justify-center gap-x-7 gap-y-3 text-sm font-bold text-slate-700">
            <span>ND &amp; HND</span>
            <span className="hidden text-slate-300 sm:inline">/</span>
            <span>University</span>
            <span className="hidden text-slate-300 sm:inline">/</span>
            <span>Colleges of Education</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-700">
              Everything in one place
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              More than a place to store your project.
            </h2>
            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              A structured workspace to help you manage your research,
              understand your work, and prepare for what comes next.
            </p>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.number}
                className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-100/60 sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl text-2xl font-bold ${feature.color}`}
                  >
                    {feature.icon}
                  </div>
                  <span className="text-xs font-bold tracking-widest text-slate-300">
                    {feature.number}
                  </span>
                </div>

                <h3 className="mt-6 text-lg font-bold text-slate-900 transition group-hover:text-indigo-700">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">
                  {feature.description}
                </p>
                <div className="mt-5 text-sm font-bold text-indigo-600">
                  Built for your journey <span aria-hidden="true">↗</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="scroll-mt-24 bg-slate-50 px-5 py-20 sm:px-8 sm:py-28"
      >
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
            <div className="lg:sticky lg:top-28">
              <span className="inline-flex rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-700">
                A clearer path forward
              </span>
              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                From your first idea to your final defense.
              </h2>
              <p className="mt-5 max-w-lg leading-8 text-slate-600">
                Big academic projects become easier to manage when you know
                what to work on, what to review, and what to do next.
              </p>
              <Link
                href="/login"
                className="mt-7 inline-flex items-center gap-2 font-bold text-indigo-600 transition hover:text-indigo-800"
              >
                Start your journey <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="space-y-4">
              {steps.map((step) => (
                <article
                  key={step.number}
                  className="flex gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-indigo-200 hover:shadow-md sm:gap-6 sm:p-7"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-sm font-extrabold text-indigo-700 sm:h-14 sm:w-14">
                    {step.number}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {step.description}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About / value proposition */}
      <section id="about" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl bg-[#111b3a] p-7 text-white sm:p-10 lg:grid-cols-2 lg:items-center lg:p-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
              Built around understanding
            </span>
            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Your project should be more than a document.
            </h2>
          </div>
          <div>
            <p className="leading-8 text-slate-300">
              ProjectMate is designed to help students become more organized,
              more confident in their research, and better prepared to explain
              the work they submit. The goal is not simply to finish a project,
              but to understand it.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Research organization
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Practical guidance
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Academic confidence
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="px-5 pb-20 sm:px-8 sm:pb-28">
        <div className="relative mx-auto max-w-7xl overflow-hidden rounded-3xl bg-indigo-600 px-6 py-16 text-center shadow-2xl shadow-indigo-200 sm:px-12 sm:py-20">
          <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[40px] border-white/10" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-blue-500/40 blur-2xl" />

          <div className="relative">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-200">
              Your next chapter starts here
            </p>
            <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-5xl">
              Don't just submit a project. Understand it. Defend it.
            </h2>
            <p className="mx-auto mt-5 max-w-2xl leading-8 text-indigo-100">
              Take the next step toward a more organized, confident academic
              journey with ProjectMate.
            </p>
            <Link
              href="/login"
              className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50"
            >
              Get started with ProjectMate <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white px-5 py-8 sm:px-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
          <Link href="/" className="text-lg font-extrabold tracking-tight">
            Project<span className="text-indigo-600">Mate</span>
          </Link>
          <p className="text-center text-sm text-slate-500">
            Your project. Your research. Your success.
          </p>
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} ProjectMate
          </p>
        </div>
      </footer>
    </main>
  );
}