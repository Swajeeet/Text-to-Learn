import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    icon: "✨",
    title: "AI-Powered Generation",
    description:
      "Enter any topic and instantly receive a structured course with modules, lessons, and objectives — powered by advanced LLMs.",
  },
  {
    icon: "📚",
    title: "Structured Learning",
    description:
      "Courses are organized into clear modules and lessons so you always know where you are and what comes next.",
  },
  {
    icon: "📈",
    title: "Track Your Progress",
    description:
      "Mark lessons complete, track your percentage, and pick up exactly where you left off — every time.",
  },
  {
    icon: "⬇",
    title: "PDF Export",
    description:
      "Download any course as a PDF and study offline, share with teammates, or archive for future reference.",
  },
  {
    icon: "▶",
    title: "YouTube Resources",
    description:
      "Every course links to curated YouTube videos so you can reinforce your learning with real-world demonstrations.",
  },
  {
    icon: "🔐",
    title: "Secure & Private",
    description:
      "Your courses are stored securely in your personal account with JWT authentication and no third-party tracking.",
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-[calc(100vh-64px)]">
      {/* Hero */}
      <section className="bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-20 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto text-center">
          <span className="inline-block mb-4 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-600 tracking-wide uppercase">
            AI-Powered Learning
          </span>
          <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 leading-tight mb-5">
            Learn <span className="text-indigo-600">Anything</span>,<br className="hidden sm:block" /> In Minutes
          </h1>
          <p className="text-lg text-gray-500 mb-8 max-w-xl mx-auto leading-relaxed">
            Type any topic — Machine Learning, React, Economics — and Text-to-Learn instantly generates a complete, structured course just for you.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              to="/generate-course"
              className="w-full sm:w-auto px-7 py-3 rounded-lg text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              ✨ Generate a Course
            </Link>
            {!isAuthenticated && (
              <Link
                to="/register"
                className="w-full sm:w-auto px-7 py-3 rounded-lg text-sm font-semibold bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Get Started Free →
              </Link>
            )}
            {isAuthenticated && (
              <Link
                to="/my-courses"
                className="w-full sm:w-auto px-7 py-3 rounded-lg text-sm font-semibold bg-white text-indigo-600 border border-indigo-200 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                My Courses →
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 px-4 sm:px-6 bg-white" aria-label="Features">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-10">
            Everything you need to learn faster
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon, title, description }) => (
              <div
                key={title}
                className="p-5 rounded-xl border border-gray-100 bg-gray-50 hover:border-indigo-200 hover:bg-indigo-50 transition-colors"
              >
                <span className="text-2xl mb-3 block">{icon}</span>
                <h3 className="text-sm font-semibold text-gray-800 mb-1">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      {!isAuthenticated && (
        <section className="py-14 px-4 sm:px-6 bg-indigo-600" aria-label="Call to action">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold text-white mb-3">Ready to start learning?</h2>
            <p className="text-indigo-200 mb-6 text-sm">
              Create your free account and generate your first course in under 30 seconds.
            </p>
            <Link
              to="/register"
              className="inline-block px-8 py-3 rounded-lg text-sm font-semibold bg-white text-indigo-600 hover:bg-indigo-50 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600"
            >
              Create Free Account
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
