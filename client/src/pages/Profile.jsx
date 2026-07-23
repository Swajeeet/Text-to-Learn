import { useAuth } from "../hooks/useAuth";

const Profile = () => {
  const { user } = useAuth();

  const fields = [
    { label: "Name", value: user?.name },
    { label: "Email", value: user?.email },
    {
      label: "Role",
      value: (
        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-50 text-indigo-600 capitalize">
          {user?.role}
        </span>
      ),
    },
    {
      label: "Member since",
      value: user?.createdAt
        ? new Date(user.createdAt).toLocaleDateString("en-IN", {
            year: "numeric",
            month: "long",
            day: "numeric",
          })
        : "—",
    },
  ];

  return (
    <div className="max-w-2xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Profile</h1>
      <p className="text-sm text-gray-500 mb-8">Your account information</p>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm divide-y divide-gray-100">
        {fields.map(({ label, value }) => (
          <div
            key={label}
            className="flex items-center justify-between px-6 py-4"
          >
            <span className="text-sm font-medium text-gray-500 w-32 shrink-0">
              {label}
            </span>
            <span className="text-sm text-gray-800 text-right">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
