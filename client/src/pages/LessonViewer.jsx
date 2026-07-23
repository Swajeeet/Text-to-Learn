import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { getLessonsByModule } from "../api/lessonApi";
import { getProgress, markLessonComplete } from "../api/progressApi";

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
    <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  </div>
);

const isLessonCompleted = (completedLessons, lessonId) =>
  completedLessons.some(
    (cl) => (cl._id || cl) === lessonId || (cl._id || cl)?.toString() === lessonId
  );

const LessonViewer = () => {
  const { moduleId } = useParams();
  const [searchParams] = useSearchParams();
  const courseId = searchParams.get("courseId");
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState({ completedLessons: [], progressPercent: 0, isCompleted: false });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [marking, setMarking] = useState(null); // lessonId being marked

  const fetchProgress = useCallback(() => {
    if (!courseId) return Promise.resolve();
    return getProgress(courseId).then((res) => setProgress(res.data.data.progress));
  }, [courseId]);

  useEffect(() => {
    if (!moduleId) {
      setError("Invalid module ID.");
      setLoading(false);
      return;
    }

    const requests = [getLessonsByModule(moduleId)];
    if (courseId) requests.push(getProgress(courseId));

    Promise.all(requests)
      .then(([lessonsRes, progressRes]) => {
        setLessons(lessonsRes.data.data.lessons || []);
        if (progressRes) setProgress(progressRes.data.data.progress);
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 404) setError("Module not found.");
        else if (status === 400) setError("Invalid module ID.");
        else setError(err.response?.data?.message || "Failed to load lessons.");
      })
      .finally(() => setLoading(false));
  }, [moduleId, courseId]);

  const handleMarkComplete = async (lessonId) => {
    if (!courseId) return;
    setMarking(lessonId);
    try {
      await markLessonComplete(courseId, lessonId);
      await fetchProgress();
    } catch {
      // Mark complete failure is non-fatal; progress unchanged
    } finally {
      setMarking(null);
    }
  };

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4">
        <span className="text-5xl">⚠️</span>
        <p className="text-gray-600 font-medium">{error}</p>
        <button onClick={() => navigate(-1)} className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
          Go Back
        </button>
      </div>
    );
  }

  const { completedLessons, progressPercent } = progress;
  const completedCount = completedLessons.length;

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-1 text-sm text-indigo-600 hover:underline">
        ← Back to Course
      </button>

      <h1 className="text-3xl font-bold text-gray-800 mb-1">Lessons</h1>
      <p className="text-sm text-gray-500 mb-6">
        {lessons.length} lesson{lessons.length !== 1 ? "s" : ""} in this module
      </p>

      {/* Progress Bar (only if courseId is available) */}
      {courseId && (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-semibold text-gray-700">Your Progress</span>
            <span className="text-sm font-bold text-indigo-600">{progressPercent}%</span>
          </div>
          <div className="w-full bg-gray-100 rounded-full h-2.5 mb-3">
            <div
              className="bg-indigo-500 h-2.5 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <div className="flex gap-4 text-xs text-gray-500">
            <span>✅ {completedCount} completed</span>
            <span>📚 {lessons.length} total</span>
            {progress.isCompleted && (
              <span className="text-green-600 font-semibold">🎉 Module Complete!</span>
            )}
          </div>
        </div>
      )}

      {/* Empty State */}
      {lessons.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <span className="text-5xl mb-4">📭</span>
          <p className="text-gray-600 font-medium">No lessons available.</p>
          <p className="text-sm text-gray-400 mt-1">This module doesn't have any lessons yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {lessons.map((lesson) => {
            const completed = isLessonCompleted(completedLessons, lesson._id);
            const isMarking = marking === lesson._id;

            return (
              <div
                key={lesson._id}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-colors ${
                  completed ? "border-green-200" : "border-gray-200"
                }`}
              >
                {/* Lesson Header */}
                <div className="flex items-center gap-4 px-5 py-4 border-b border-gray-100">
                  <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    completed ? "bg-green-100 text-green-600" : "bg-indigo-100 text-indigo-600"
                  }`}>
                    {completed ? "✓" : lesson.order}
                  </div>
                  <h2 className="text-base font-semibold text-gray-800 flex-1">{lesson.title}</h2>
                  <div className="flex items-center gap-2 shrink-0">
                    {lesson.duration && (
                      <span className="text-xs text-gray-400">🕐 {lesson.duration} min</span>
                    )}
                    {completed ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-600 border border-green-200">
                        ✓ Completed
                      </span>
                    ) : courseId ? (
                      <button
                        onClick={() => handleMarkComplete(lesson._id)}
                        disabled={isMarking}
                        className="px-3 py-1 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                      >
                        {isMarking ? "Saving..." : "Mark Complete"}
                      </button>
                    ) : null}
                  </div>
                </div>

                {/* Lesson Content */}
                <div className="px-5 py-4">
                  <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
                    {lesson.content}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default LessonViewer;
