import { useState, useCallback, memo } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const MenuIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
  </svg>
);

const CloseIcon = () => (
  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
  </svg>
);

const linkBase =
  "px-3 py-2 rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1";

const desktopLinkClass = ({ isActive }) =>
  `${linkBase} ${isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-600 hover:text-indigo-600 hover:bg-gray-50"}`;

const mobileLinkClass = ({ isActive }) =>
  `block w-full text-left px-4 py-3 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
    isActive ? "bg-indigo-50 text-indigo-600" : "text-gray-700 hover:bg-gray-50 hover:text-indigo-600"
  }`;

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const close = useCallback(() => setIsOpen(false), []);

  const handleLogout = useCallback(() => {
    logout();
    navigate("/");
    close();
  }, [logout, navigate, close]);

  const authLinks = isAuthenticated
    ? [
        { to: "/", label: "Home", end: true },
        { to: "/generate-course", label: "Generate Course" },
        { to: "/my-courses", label: "My Courses" },
        { to: "/dashboard", label: "Dashboard" },
        { to: "/profile", label: "Profile" },
      ]
    : [
        { to: "/", label: "Home", end: true },
      ];

  return (
    <nav className="w-full bg-white border-b border-gray-200 relative z-50" role="navigation" aria-label="Main navigation">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to="/"
          onClick={close}
          className="text-xl font-bold text-indigo-600 tracking-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 rounded"
          aria-label="Text-to-Learn home"
        >
          Text-to-Learn
        </NavLink>

        {/* Desktop Links */}
        <ul className="hidden md:flex items-center gap-1" role="list">
          {authLinks.map(({ to, label, end }) => (
            <li key={to}>
              <NavLink to={to} end={end} className={desktopLinkClass}>
                {label}
              </NavLink>
            </li>
          ))}

          {isAuthenticated ? (
            <li>
              <button
                id="logout-btn"
                onClick={handleLogout}
                className={`${linkBase} text-gray-600 hover:text-red-600 hover:bg-red-50`}
              >
                Logout
              </button>
            </li>
          ) : (
            <>
              <li>
                <NavLink to="/login" className={desktopLinkClass}>Login</NavLink>
              </li>
              <li>
                <NavLink
                  to="/register"
                  className="px-4 py-2 rounded-md text-sm font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-1"
                >
                  Register
                </NavLink>
              </li>
            </>
          )}
        </ul>

        {/* Hamburger */}
        <button
          className="md:hidden p-2 rounded-md text-gray-600 hover:bg-gray-100 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onClick={() => setIsOpen((o) => !o)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </button>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div
          id="mobile-menu"
          className="md:hidden border-t border-gray-100 bg-white shadow-lg divide-y divide-gray-50"
        >
          <div className="py-1">
            {authLinks.map(({ to, label, end }) => (
              <NavLink key={to} to={to} end={end} onClick={close} className={mobileLinkClass}>
                {label}
              </NavLink>
            ))}
          </div>
          <div className="py-1">
            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                className="block w-full text-left px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                Logout
              </button>
            ) : (
              <>
                <NavLink to="/login" onClick={close} className={mobileLinkClass}>Login</NavLink>
                <NavLink
                  to="/register"
                  onClick={close}
                  className="block w-full text-left px-4 py-3 text-sm font-medium text-indigo-600 hover:bg-indigo-50 transition-colors"
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default memo(Navbar);
