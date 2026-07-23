import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getCourses } from "../api/courseApi";

const difficultyColor = {
  Beginner: "bg-green-50 text-green-700 border-green-200",
  Intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Advanced: "bg-red-50 text-red-700 border-red-200",
};

const statusColor = {
  Draft: "bg-gray-100 text-gray-600",
  Published: "bg-indigo-50 text-indigo-600",
};

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
    <svg
      className="animate-spin h-8 w-8 text-indigo-500"
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
  </div>
);

const MyCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getCourses()
      .then((res) => setCourses(res.data.data.courses))
      .catch((err) =>
        setError(
          err.response?.data?.message ||
            "Failed to load courses. Please try again."
        )
      )
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <Spinner />;

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
        <p className="mt-1 text-sm text-gray-500">
          All AI-generated courses stored in your account.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          role="alert"
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600"
        >
          {error}
        </div>
      )}

      {/* Empty State */}
      {!error && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">📭</span>
          <h2 className="text-lg font-semibold text-gray-700 mb-1">
            No courses generated yet.
          </h2>
          <p className="text-sm text-gray-500 mb-6">
            Use AI to generate your first course instantly.
          </p>
          <Link
            to="/generate-course"
            className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Generate Your First Course
          </Link>
        </div>
      )}

      {/* Course Grid */}
      {courses.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all flex flex-col"
            >
              <div className="p-5 flex-1">
                {/* Title + Difficulty */}
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h2 className="text-base font-semibold text-gray-800 leading-snug line-clamp-2">
                    {course.title}
                  </h2>
                  <span
                    className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${
                      difficultyColor[course.difficulty] ||
                      "bg-gray-50 text-gray-600 border-gray-200"
                    }`}
                  >
                    {course.difficulty}
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-gray-500 line-clamp-2 mb-4">
                  {course.description}
                </p>

                {/* Meta row */}
                <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                  <span>🕐 {course.estimatedDuration} hrs</span>
                  <span>🌐 {course.language}</span>
                  <span
                    className={`px-2 py-0.5 rounded-full font-medium ${
                      statusColor[course.status] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {course.status}
                  </span>
                  <span>
                    📅{" "}
                    {new Date(course.createdAt).toLocaleDateString("en-IN", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </div>

              {/* Card Footer */}
              <div className="px-5 pb-5">
                <button
                  onClick={() => navigate(`/course/${course._id}`)}
                  className="w-full py-2 text-sm font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  View Course
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;
