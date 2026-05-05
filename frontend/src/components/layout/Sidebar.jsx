import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FileText,
  Star,
  Sparkles,
  Settings,
  LogOut,
  Moon,
  Sun,
  Plus,
} from "lucide-react";
import FolderCreateModal from "../ui/FolderCreateModal";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 🔥 Sync active folder with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const folderFromURL = params.get("folder");

    if (folderFromURL) {
      setActiveFolder(Number(folderFromURL));
    } else {
      setActiveFolder(null);
    }
  }, [location]);

  // DARK MODE
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // FETCH FOLDERS
  const getFolders = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/folders", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFolders(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    getFolders();
  }, []);

  // CREATE FOLDER
  const handleCreateFolder = async (name) => {
    try {
      await axios.post(
        "http://localhost:8080/api/folders",
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      await getFolders();
      toast.success("Folder created");
    } catch (err) {
      console.error(err);
      toast.error("Failed to create folder");
    }
  };

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
          <h1 className="text-xl font-semibold text-text-primary dark:text-text-darkPrimary">
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

            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary opacity-60">
              <Star size={16} />
              Favorites
            </div>
          </div>
        </div>

        {/* FOLDERS */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">
              Folders
            </p>

            <button
              onClick={() => setShowCreateModal(true)}
              className="p-1 rounded-md hover:bg-muted dark:hover:bg-muted-dark"
            >
              <Plus size={14} />
            </button>
          </div>

          <div className="space-y-1">
            {/* ALL NOTES */}
            <div
              onClick={() => {
                setActiveFolder(null);
                navigate("/dashboard");
              }}
              className={`px-3 py-2 rounded-xl text-sm cursor-pointer ${
                activeFolder === null
                  ? "bg-accent/10 text-accent"
                  : "text-text-secondary hover:bg-muted dark:hover:bg-muted-dark"
              }`}
            >
              All Notes
            </div>

            {/* FOLDER LIST */}
            {folders.map((f) => (
              <div
                key={f.id}
                onClick={() => {
                  setActiveFolder(f.id);
                  navigate(`/dashboard?folder=${f.id}`);
                }}
                className={`px-3 py-2 rounded-xl text-sm cursor-pointer ${
                  activeFolder === f.id
                    ? "bg-accent/10 text-accent"
                    : "text-text-secondary hover:bg-muted dark:hover:bg-muted-dark"
                }`}
              >
                {f.name}
              </div>
            ))}
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <p className="text-xs font-semibold text-text-secondary mb-2 uppercase tracking-wider">
            Explore
          </p>

          <div className="space-y-1">
            <div className="flex items-center gap-3 px-3 py-2.5 text-sm text-text-secondary opacity-60">
              <Sparkles size={16} />
              AI Assistant
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
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm bg-muted dark:bg-muted-dark"
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-500/10"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>

      {/* MODAL */}
      <FolderCreateModal
        open={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateFolder}
      />
    </aside>
  );
};

export default Sidebar;