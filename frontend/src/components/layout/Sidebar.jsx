import { NavLink, useNavigate } from "react-router-dom";
import {
  FileText,
  Star,
  Folder,
  Sparkles,
  LayoutTemplate,
  Settings,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/");
  };

  const navItemClass = ({ isActive }) =>
    `
    flex items-center gap-3 px-3 py-2.5 rounded-xl
    text-sm font-medium transition-all
    ${
      isActive
        ? "bg-accent/10 text-accent"
        : "text-text-secondary hover:bg-muted dark:hover:bg-muted-dark hover:text-text-primary dark:hover:text-text-darkPrimary"
    }
  `;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between px-5 py-6 bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark">
      <div>
        {/* LOGO */}
        <div className="mb-10">
          <h1 className="text-xl font-semibold tracking-tight text-text-primary dark:text-text-darkPrimary">
            SimplyNotes
          </h1>
          <p className="text-xs text-text-secondary mt-1">
            your workspace
          </p>
        </div>

        {/* MAIN */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
            Main
          </p>

          <div className="space-y-1">
            <NavLink to="/dashboard" className={navItemClass}>
              <FileText size={16} />
              Notes
            </NavLink>

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary opacity-60 cursor-not-allowed">
              <Star size={16} />
              Favorites
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary opacity-60 cursor-not-allowed">
              <Folder size={16} />
              Folders
            </div>
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
            Explore
          </p>

          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary opacity-60 cursor-not-allowed">
              <Sparkles size={16} />
              AI Assistant
            </div>

            <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-text-secondary opacity-60 cursor-not-allowed">
              <LayoutTemplate size={16} />
              Templates
            </div>

            <NavLink to="/settings" className={navItemClass}>
              <Settings size={16} />
              Settings
            </NavLink>
          </div>
        </div>
      </div>

      {/* BOTTOM */}
      <div className="space-y-3">
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary hover:opacity-80 transition"
        >
          <div className="flex items-center gap-3">
            {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </div>
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-500/10 transition"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;