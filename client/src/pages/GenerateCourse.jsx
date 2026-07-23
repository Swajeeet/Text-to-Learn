import { useState } from "react";
import { generateCourse } from "../api/aiApi";

// Spinner SVG
const Spinner = () => (
  <svg
    className="animate-spin h-4 w-4 text-white"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

const difficultyColor = {
  Beginner: "bg-green-50 text-green-700 border-green-200",
  Intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Advanced: "bg-red-50 text-red-700 border-red-200",
};

const GenerateCourse = () => {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null); // { course, modules }

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!topic.trim()) {
      setError("Please enter a topic to generate a course.");
      return;
    }

    setLoading(true);
    setError("");
    setResult(null);

    try {
      const res = await generateCourse({ topic: topic.trim() });
      setResult(res.data.data); // { course, modules }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Failed to generate course. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Generate a Course</h1>
        <p className="mt-2 text-gray-500 text-sm">
          Enter any topic and our AI will instantly generate a complete course
          with modules and learning objectives.
        </p>
      </div>

      {/* Input Form */}
      <form
        onSubmit={handleGenerate}
        className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8"
      >
        <label
          htmlFor="topic-input"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Topic
        </label>
        <input
          id="topic-input"
          type="text"
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            if (error) setError("");
          }}
          placeholder='e.g. "Machine Learning", "React Hooks", "Operating Systems"'
          disabled={loading}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:text-gray-400 mb-4"
        />

        {error && (
          <p role="alert" className="text-sm text-red-600 mb-4">
            {error}
          </p>
        )}

        <button
          id="generate-btn"
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <Spinner />
              Generating Course...
            </>
          ) : (
            <>
              <span>✨</span>
              Generate Course
            </>
          )}
        </button>
      </form>

      {/* Results */}
      {result && (
        <div id="course-result">
          {/* Course Details Card */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-6">
            <div className="flex items-start justify-between gap-4 flex-wrap">
              <div className="flex-1">
                <h2 className="text-xl font-bold text-gray-800 mb-1">
                  {result.course.title}
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed">
                  {result.course.description}
                </p>
              </div>
              <span
                className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold border ${
                  difficultyColor[result.course.difficulty] ||
                  "bg-gray-50 text-gray-700 border-gray-200"
                }`}
              >
                {result.course.difficulty}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                {
                  label: "Duration",
                  value: `${result.course.estimatedDuration} hrs`,
                },
                { label: "Language", value: result.course.language },
                { label: "Status", value: result.course.status },
                {
                  label: "Modules",
                  value: result.modules?.length ?? 0,
                },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-gray-50 rounded-lg p-3 text-center"
                >
                  <p className="text-xs text-gray-400 mb-1">{label}</p>
                  <p className="text-sm font-semibold text-gray-700">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Modules */}
          {result.modules && result.modules.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Course Modules
              </h3>
              <div className="space-y-3">
                {result.modules.map((mod) => (
                  <div
                    key={mod._id || mod.order}
                    className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex gap-4"
                  >
                    <div className="shrink-0 w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                      {mod.order}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800 mb-1">
                        {mod.title}
                      </h4>
                      <p className="text-sm text-gray-500 leading-relaxed">
                        {mod.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GenerateCourse;
