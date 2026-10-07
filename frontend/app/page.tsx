export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          
          <h1 className="text-2xl font-bold">
            Project<span className="text-blue-600">Mate</span>
          </h1>

          <div className="flex items-center gap-4">
            <button className="rounded-lg px-4 py-2 text-gray-700 hover:bg-gray-100">
              Log in
            </button>

            <button className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700">
              Get Started
            </button>
          </div>

        </div>
      </nav>


      {/* Hero */}
      <section className="bg-blue-50 px-6 py-24">
        <div className="mx-auto max-w-4xl text-center">

          <p className="mb-4 font-semibold text-blue-600">
            BUILT FOR FINAL-YEAR STUDENTS
          </p>

          <h2 className="text-5xl font-bold leading-tight">
            Build your project.
            <br />
            <span className="text-blue-600">
              Understand it. Defend it.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600">
            ProjectMate helps final-year students choose project topics,
            organize research, develop their projects and prepare confidently
            for their final defense.
          </p>

          <div className="mt-8 flex justify-center gap-4">

            <button className="rounded-xl bg-blue-600 px-7 py-4 font-semibold text-white hover:bg-blue-700">
              Start Your Project
            </button>

            <button className="rounded-xl border border-gray-300 bg-white px-7 py-4 font-semibold hover:bg-gray-50">
              Explore Topics
            </button>

          </div>

        </div>
      </section>


      {/* Features */}
      <section className="px-6 py-20">

        <div className="mx-auto max-w-6xl">

          <div className="text-center">

            <p className="font-semibold text-blue-600">
              EVERYTHING IN ONE PLACE
            </p>

            <h2 className="mt-3 text-3xl font-bold">
              Your complete project companion
            </h2>

          </div>


          <div className="mt-12 grid gap-6 md:grid-cols-3">

            <Feature
              title="Topic Explorer"
              description="Find and understand suitable project topics before you commit to one."
            />

            <Feature
              title="Project Workspace"
              description="Organize your chapters, research materials and project files."
            />

            <Feature
              title="AI Research Assistant"
              description="Get help understanding research concepts and developing your project."
            />

            <Feature
              title="Project Intelligence"
              description="Identify gaps between your objectives, research questions and methodology."
            />

            <Feature
              title="Progress Tracking"
              description="Know what you have completed and what you should work on next."
            />

            <Feature
              title="Defense Preparation"
              description="Practice project-specific questions before facing your examiners."
            />

          </div>

        </div>

      </section>


      {/* How it works */}
      <section className="bg-gray-50 px-6 py-20">

        <div className="mx-auto max-w-6xl text-center">

          <p className="font-semibold text-blue-600">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-3xl font-bold">
            From idea to defense
          </h2>


          <div className="mt-12 grid gap-8 md:grid-cols-4">

            <Step number="01" title="Choose" text="Find a suitable project topic." />

            <Step number="02" title="Build" text="Research and develop your project." />

            <Step number="03" title="Validate" text="Check your project for gaps." />

            <Step number="04" title="Defend" text="Practice until you're ready." />

          </div>

        </div>

      </section>


      {/* Final CTA */}
      <section className="bg-blue-600 px-6 py-20 text-center text-white">

        <h2 className="text-4xl font-bold">
          Don't just submit a project.
        </h2>

        <p className="mt-4 text-xl text-blue-100">
          Build something you understand and can defend.
        </p>

        <button className="mt-8 rounded-xl bg-white px-8 py-4 font-semibold text-blue-600">
          Get Started with ProjectMate
        </button>

      </section>


      {/* Footer */}
      <footer className="border-t px-6 py-8 text-center text-gray-500">
        © 2026 ProjectMate — Your Project. Your Research. Your Success.
      </footer>

    </main>
  );
}


function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-gray-200 p-6">
      <h3 className="text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-3 leading-7 text-gray-600">
        {description}
      </p>
    </div>
  );
}


function Step({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <div>
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 font-bold text-blue-600">
        {number}
      </div>

      <h3 className="mt-4 text-xl font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-gray-600">
        {text}
      </p>
    </div>
  );
}