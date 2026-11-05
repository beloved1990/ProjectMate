
import Link from 'next/link';

const features = [
  {
    number: '01',
    icon: '▤',
    title: 'Project Workspace',
    description:
      'Organize your research projects, manage tasks, and keep your academic work in one place.',
    color: 'bg-blue-50 text-blue-600',
  },
  {
    number: '02',
    icon: '✳',
    title: 'AI Research Assistant',
    description:
      'Ask research questions, understand difficult concepts, and receive guidance as you develop your work.',
    color: 'bg-violet-50 text-violet-600',
  },
  {
    number: '03',
    icon: '⌘',
    title: 'Research Consistency',
    description:
      'Examine how your research objectives, questions, methodology, and findings connect.',
    color: 'bg-indigo-50 text-indigo-600',
  },
  {
    number: '04',
    icon: '◎',
    title: 'Citation Checker',
    description:
      'Review your citations and references to identify possible inconsistencies in your academic writing.',
    color: 'bg-emerald-50 text-emerald-600',
  },
  {
    number: '05',
    icon: '↗',
    title: 'Project Intelligence',
    description:
      'Evaluate your research, identify areas that need improvement, and understand what to work on next.',
    color: 'bg-amber-50 text-amber-600',
  },
  {
    number: '06',
    icon: '◇',
    title: 'Defence Preparation',
    description:
      'Prepare for your project defence with research-based questions and guidance on what to revise.',
    color: 'bg-rose-50 text-rose-600',
  },
];

const steps = [
  {
    number: '01',
    title: 'Start with your research',
    description:
      'Create your project workspace and begin organizing your research.',
  },
  {
    number: '02',
    title: 'Develop your work',
    description:
      'Manage tasks, explore research questions, and get AI-powered guidance.',
  },
  {
    number: '03',
    title: 'Review and improve',
    description:
      'Check your research consistency, citations, and areas that need attention.',
  },
  {
    number: '04',
    title: 'Prepare with confidence',
    description:
      'Understand your research and prepare to explain and defend your work.',
  },
];

function SignupLink({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href="/register" className={className}>
      {children}
    </Link>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen overflow-hidden bg-white text-slate-900">
      {/* Navigation */}
      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/95 backdrop-blur-xl">
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

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 sm:px-4"
            >
              Log in
            </Link>

            <SignupLink className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 sm:px-5">
              Sign Up <span aria-hidden="true">→</span>
            </SignupLink>
          </div>
        </nav>
      </header>

      {/* Hero */}
      <section className="relative isolate bg-[#f7f8ff]">
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-indigo-200/40 blur-3xl" />
          <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-blue-200/40 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(#a5b4fc_0.8px,transparent_0.8px)] bg-[size:24px_24px] opacity-30" />
        </div>

        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 py-16 sm:px-8 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:py-24">
          {/* Introduction */}
          <div className="relative z-10">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-indigo-100 bg-white px-4 py-2 text-xs font-bold tracking-wide text-indigo-700 shadow-sm sm:text-sm">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              YOUR ACADEMIC JOURNEY, ORGANIZED
            </div>

            <h1 className="max-w-2xl text-4xl font-black leading-[1.12] tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Your research.
              <span className="mt-2 block bg-gradient-to-r from-indigo-600 via-blue-600 to-violet-600 bg-clip-text text-transparent">
                Your progress.
              </span>
              <span className="mt-2 block">Your success.</span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-slate-600 sm:text-lg">
              ProjectMate is your academic research companion. Plan your
              project, organize your work, get AI-powered research guidance,
              improve your writing, and prepare to defend what you have learned.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <SignupLink className="inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-indigo-600 px-7 py-4 font-bold text-white shadow-xl shadow-indigo-200 transition hover:-translate-y-1 hover:bg-indigo-700">
                Get Started <span aria-hidden="true">→</span>
              </SignupLink>

              <a
                href="#features"
                className="inline-flex min-h-14 items-center justify-center rounded-xl border border-slate-200 bg-white px-7 py-4 font-bold text-slate-700 shadow-sm transition hover:border-indigo-200 hover:bg-indigo-50"
              >
                Explore Features
              </a>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-sm text-slate-500">
              <span className="flex items-center gap-2">
                <span className="font-bold text-emerald-600">✓</span>
                Research organization
              </span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-emerald-600">✓</span>
                AI-powered guidance
              </span>
              <span className="flex items-center gap-2">
                <span className="font-bold text-emerald-600">✓</span>
                Project improvement
              </span>
            </div>
          </div>

          {/* ProjectMate workspace illustration */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[2rem] bg-gradient-to-br from-indigo-200/70 to-blue-100/50 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white bg-white shadow-2xl shadow-indigo-200/50">
              {/* Workspace heading */}
              <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-black text-white">
                    P
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      ProjectMate
                    </p>
                    <p className="text-xs text-slate-500">
                      Your Academic Workspace
                    </p>
                  </div>
                </div>

                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  ● Workspace
                </span>
              </div>

              <div className="bg-slate-50/80 p-5 sm:p-6">
                <div className="mb-5">
                  <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                    EVERYTHING IN ONE PLACE
                  </p>
                  <h2 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900 sm:text-2xl">
                    Work smarter on your research.
                  </h2>
                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    The tools you need throughout your academic journey.
                  </p>
                </div>

                {/* Main workspace preview */}
                <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                        MY PROJECT
                      </p>
                      <h3 className="mt-1 font-bold text-slate-900">
                        Research Workspace
                      </h3>
                    </div>
                    <span className="rounded-lg bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-700">
                      Organized
                    </span>
                  </div>

                  <div className="mt-5 space-y-3">
                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                        ▤
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">
                          Project Management
                        </p>
                        <p className="text-xs text-slate-500">
                          Projects, tasks and deadlines
                        </p>
                      </div>
                      <span className="text-emerald-600">✓</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-violet-100 text-violet-700">
                        ✳
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">
                          AI Research Assistant
                        </p>
                        <p className="text-xs text-slate-500">
                          Research questions and guidance
                        </p>
                      </div>
                      <span className="text-emerald-600">✓</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                        ⌘
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">
                          Research Analysis
                        </p>
                        <p className="text-xs text-slate-500">
                          Consistency and citation checks
                        </p>
                      </div>
                      <span className="text-emerald-600">✓</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                        ↗
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">
                          Project Intelligence
                        </p>
                        <p className="text-xs text-slate-500">
                          Quality insights and improvements
                        </p>
                      </div>
                      <span className="text-emerald-600">✓</span>
                    </div>

                    <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-rose-100 text-rose-700">
                        ◇
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-bold text-slate-800">
                          Defence Preparation
                        </p>
                        <p className="text-xs text-slate-500">
                          Questions and revision guidance
                        </p>
                      </div>
                      <span className="text-emerald-600">✓</span>
                    </div>
                  </div>
                </div>

                {/* Workspace message */}
                <div className="mt-4 flex items-center gap-3 rounded-xl border border-indigo-100 bg-indigo-50 p-4">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-xl text-indigo-600 shadow-sm">
                    ✦
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900">
                      More than project storage
                    </p>
                    <p className="mt-1 text-xs leading-5 text-slate-600">
                      Build understanding, improve your work, and move forward
                      with confidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Floating label */}
            <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-xl border border-slate-100 bg-white p-4 shadow-xl sm:flex">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-lg text-emerald-700">
                ✓
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">
                  Every step counts
                </p>
                <p className="text-xs text-slate-500">
                  Your research, moving forward
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-2xl text-center">
            <span className="inline-flex rounded-full bg-indigo-50 px-4 py-2 text-xs font-bold uppercase tracking-widest text-indigo-700">
              What ProjectMate offers
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              Everything you need to move your research forward.
            </h2>

            <p className="mt-5 text-base leading-8 text-slate-600 sm:text-lg">
              From organizing your project to understanding and improving your
              research, ProjectMate brings essential academic tools together.
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
                How it works
              </span>

              <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
                From your first idea to your final defence.
              </h2>

              <p className="mt-5 max-w-lg leading-8 text-slate-600">
                Academic projects become easier to manage when you have a
                structured way to organize your work, review your research,
                and understand what needs attention.
              </p>

              <SignupLink className="mt-7 inline-flex items-center gap-2 font-bold text-indigo-600 transition hover:text-indigo-800">
                Start your journey <span aria-hidden="true">→</span>
              </SignupLink>
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

      {/* About */}
      <section id="about" className="scroll-mt-24 px-5 py-20 sm:px-8 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 rounded-3xl bg-[#111b3a] p-7 text-white sm:p-10 lg:grid-cols-2 lg:items-center lg:p-14">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-300">
              About ProjectMate
            </span>

            <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              Don't just complete your research. Understand it.
            </h2>
          </div>

          <div>
            <p className="leading-8 text-slate-300">
              ProjectMate is an academic research workspace designed to help
              students become more organized, develop a better understanding
              of their work, identify areas for improvement, and prepare to
              explain their research confidently. It brings project
              organization and intelligent research guidance into one place.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                Research organization
              </span>

              <span className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm text-slate-200">
                AI-powered guidance
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
              Plan your research. Improve your work. Defend with confidence.
            </h2>

            <p className="mx-auto mt-5 max-w-2xl leading-8 text-indigo-100">
              Take the next step towards a more organized and confident
              academic journey with ProjectMate.
            </p>

            <SignupLink className="mt-8 inline-flex min-h-14 items-center justify-center gap-3 rounded-xl bg-white px-7 py-4 font-bold text-indigo-700 shadow-lg transition hover:-translate-y-1 hover:bg-indigo-50">
              Get Started <span aria-hidden="true">→</span>
            </SignupLink>
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
            © 2026 ProjectMate. Built for your success.
          </p>
        </div>
      </footer>
    </main>
  );
}
