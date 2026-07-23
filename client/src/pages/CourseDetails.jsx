import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getCourseById, getModulesByCourse } from "../api/courseDetailsApi";
import { downloadCoursePdf } from "../api/pdfApi";
import { getCourseVideos } from "../api/youtubeApi";

const difficultyColor = {
  Beginner: "bg-green-50 text-green-700 border-green-200",
  Intermediate: "bg-yellow-50 text-yellow-700 border-yellow-200",
  Advanced: "bg-red-50 text-red-700 border-red-200",
};

const Spinner = () => (
  <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
    <svg className="animate-spin h-8 w-8 text-indigo-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
    </svg>
  </div>
);

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pdfLoading, setPdfLoading] = useState(false);
  const [pdfError, setPdfError] = useState("");
  const [videos, setVideos] = useState([]);
  const [videosLoading, setVideosLoading] = useState(false);
  const [videosError, setVideosError] = useState("");

  const handleDownloadPdf = async () => {
    setPdfLoading(true);
    setPdfError("");
    try {
      const res = await downloadCoursePdf(id);
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${course.title.replace(/[^a-z0-9]/gi, "-").toLowerCase()}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setPdfError(err.response?.data?.message || "PDF download failed. Please try again.");
    } finally {
      setPdfLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError("Invalid course ID.");
      setLoading(false);
      return;
    }

    Promise.all([getCourseById(id), getModulesByCourse(id)])
      .then(([courseRes, modulesRes]) => {
        setCourse(courseRes.data.data.course);
        setModules(modulesRes.data.data.modules || []);
      })
      .catch((err) => {
        const status = err.response?.status;
        if (status === 404) setError("Course not found.");
        else if (status === 400) setError("Invalid course ID.");
        else setError(err.response?.data?.message || "Failed to load course. Please try again.");
      })
      .finally(() => setLoading(false));
  }, [id]);

  // Fetch YouTube videos once course title is available
  useEffect(() => {
    if (!course?.title) return;
    setVideosLoading(true);
    setVideosError("");
    getCourseVideos(course.title)
      .then((res) => setVideos(res.data.data.videos || []))
      .catch((err) =>
        setVideosError(err.response?.data?.message || "Failed to load videos.")
      )
      .finally(() => setVideosLoading(false));
  }, [course?.title]);

  if (loading) return <Spinner />;

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] gap-4">
        <span className="text-5xl">⚠️</span>
        <p className="text-gray-600 font-medium">{error}</p>
        <button
          onClick={() => navigate("/my-courses")}
          className="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Back to My Courses
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Back */}
      <button
        onClick={() => navigate("/my-courses")}
        className="mb-6 flex items-center gap-1 text-sm text-indigo-600 hover:underline"
      >
        ← My Courses
      </button>

      {/* Course Header Card */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 mb-8">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <h1 className="text-2xl font-bold text-gray-800 flex-1">{course.title}</h1>
          <div className="flex items-center gap-2 shrink-0 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColor[course.difficulty] || "bg-gray-50 text-gray-600 border-gray-200"}`}>
              {course.difficulty}
            </span>
            <button
              id="download-pdf-btn"
              onClick={handleDownloadPdf}
              disabled={pdfLoading}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {pdfLoading ? "Downloading..." : "⬇ Download PDF"}
            </button>
          </div>
        </div>
        {pdfError && (
          <p className="text-xs text-red-600 mb-3">{pdfError}</p>
        )}

        <p className="text-sm text-gray-500 leading-relaxed mb-6">{course.description}</p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: "Duration", value: `${course.estimatedDuration} hrs` },
            { label: "Language", value: course.language },
            { label: "Status", value: course.status },
            {
              label: "Created",
              value: new Date(course.createdAt).toLocaleDateString("en-IN", {
                year: "numeric", month: "short", day: "numeric",
              }),
            },
          ].map(({ label, value }) => (
            <div key={label} className="bg-gray-50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400 mb-1">{label}</p>
              <p className="text-sm font-semibold text-gray-700">{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modules */}
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Course Modules{" "}
        <span className="text-sm font-normal text-gray-400">({modules.length})</span>
      </h2>

      {modules.length === 0 ? (
        <p className="text-sm text-gray-400">No modules found for this course.</p>
      ) : (
        <div className="space-y-3">
          {modules.map((mod) => (
            <div
              key={mod._id}
              className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex items-start gap-4"
            >
              <div className="shrink-0 w-9 h-9 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-sm font-bold">
                {mod.order}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">{mod.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed mb-3">{mod.description}</p>
                <button
                  onClick={() => navigate(`/lesson/${mod._id}?courseId=${id}`)}
                  className="px-4 py-1.5 text-xs font-medium text-indigo-600 border border-indigo-200 rounded-lg hover:bg-indigo-50 transition-colors"
                >
                  View Lessons
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Recommended Videos */}
      <div className="mt-10">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recommended Videos</h2>
        {videosLoading && (
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <svg className="animate-spin h-4 w-4 text-indigo-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Loading videos...
          </div>
        )}
        {videosError && !videosLoading && (
          <p className="text-sm text-red-500">{videosError}</p>
        )}
        {!videosLoading && !videosError && videos.length === 0 && (
          <p className="text-sm text-gray-400">No recommended videos available.</p>
        )}
        {!videosLoading && videos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video) => (
              <div
                key={video.videoId}
                className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md hover:border-red-200 transition-all"
              >
                {video.thumbnail && (
                  <img
                    src={video.thumbnail}
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                )}
                <div className="p-4">
                  <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 mb-1">
                    {video.title}
                  </h3>
                  <p className="text-xs text-gray-400 mb-3">{video.channelTitle}</p>
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-1.5 w-full py-1.5 text-xs font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
                  >
                    ▶ Watch on YouTube
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseDetails;
