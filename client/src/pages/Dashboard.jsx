import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const cards = [
  {
    id: "card-my-courses",
    title: "My Courses",
    description: "View all AI-generated courses in your account.",
    icon: "📚",
    to: "/my-courses",
  },
  {
    id: "card-generate",
    title: "Generate Course",
    description: "Use AI to generate a new course instantly.",
    icon: "✨",
    to: "/generate-course",
  },
  {
    id: "card-profile",
    title: "Profile",
    description: "Manage your account and preferences.",
    icon: "👤",
    to: "/profile",
  },
  {
    id: "card-progress",
    title: "Progress",
    description: "Track your learning progress across courses.",
    icon: "📈",
    to: "/my-courses",
  },
];

const Dashboard = () => {
  const { user } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Welcome back, {user?.name} 👋
        </h1>
        <div className="mt-2 flex flex-col gap-1 text-sm text-gray-500">
          <span>Email: <span className="text-gray-700 font-medium">{user?.email}</span></span>
          <span>
            Role:{" "}
            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 capitalize">
              {user?.role}
            </span>
          </span>
        </div>
      </div>

      {/* Divider */}
      <hr className="border-gray-200 mb-8" />

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {cards.map((card) => (
          <Link
            key={card.id}
            id={card.id}
            to={card.to}
            className="group flex items-start gap-4 p-5 bg-white rounded-xl border border-gray-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all"
          >
            <span className="text-3xl">{card.icon}</span>
            <div>
              <h2 className="text-base font-semibold text-gray-800 group-hover:text-indigo-600 transition-colors">
                {card.title}
              </h2>
              <p className="mt-1 text-sm text-gray-500">{card.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
