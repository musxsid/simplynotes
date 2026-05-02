import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out");
    navigate("/");
  };

  return (
    <div
      className="
      h-screen w-64 fixed left-0 top-0 flex flex-col
      backdrop-blur-xl bg-white/10 dark:bg-gray-900/60
      border-r border-white/10 dark:border-gray-800
      text-gray-800 dark:text-gray-100
      p-6
    "
    >
      {/* 🔥 LOGO */}
      <div className="mb-10">
        <h1 className="text-2xl font-semibold tracking-tight">
          SimplyNotes
        </h1>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Your workspace, organized.
        </p>
      </div>

      {/* 🔹 WORKSPACE SECTION */}
      <div className="mb-6">
        <p className="text-xs uppercase text-gray-400 mb-2 px-1">
          Workspace
        </p>

        <button
          className="
          w-full flex items-center gap-3 px-3 py-2 rounded-xl
          bg-white/60 dark:bg-gray-800/60
          backdrop-blur
          border border-white/20 dark:border-gray-700
          text-gray-900 dark:text-white
          shadow-sm
        "
        >
          <span>📒</span>
          <span className="text-sm font-medium">Notes</span>
        </button>
      </div>

      {/* 🔹 SETTINGS SECTION */}
      <div className="mb-6">
        <p className="text-xs uppercase text-gray-400 mb-2 px-1">
          Preferences
        </p>

        <button
          className="
          w-full flex items-center gap-3 px-3 py-2 rounded-xl
          text-gray-500 dark:text-gray-400
          hover:bg-white/40 dark:hover:bg-gray-800/40
          hover:text-gray-900 dark:hover:text-white
          transition
        "
        >
          <span>⚙️</span>
          <span className="text-sm font-medium">Settings</span>
        </button>
      </div>

      {/* 🔻 LOGOUT BUTTON (CTA STYLE) */}
      <div className="mt-auto">
        <button
          onClick={handleLogout}
          className="
          w-full flex items-center justify-center gap-2
          px-4 py-3 rounded-xl
          bg-red-500/90 text-white
          hover:bg-red-600
          transition active:scale-95
          shadow-md
        "
        >
          <span>🚪</span>
          <span className="text-sm font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;