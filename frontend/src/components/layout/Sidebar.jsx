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
  ChevronDown,
  Check,
  Briefcase,
  Folder
} from "lucide-react";
import FolderCreateModal from "../ui/FolderCreateModal";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);

  const ICON_SIZE = 20;

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  // Workspace & Folder State
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  const [folders, setFolders] = useState([]);
  
  const [activeFolder, setActiveFolder] = useState(null);
  const [isFavoritesActive, setIsFavoritesActive] = useState(false); // 🔥 Added Favorites State
  const [showCreateModal, setShowCreateModal] = useState(false);

  // 🔥 Sync active folder AND favorites with URL
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const folderFromURL = params.get("folder");
    const favoritesFromURL = params.get("favorites");

    if (folderFromURL) setActiveFolder(Number(folderFromURL));
    else setActiveFolder(null);

    if (favoritesFromURL === "true") setIsFavoritesActive(true);
    else setIsFavoritesActive(false);
  }, [location]);

  // Dark Mode Toggle
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsWorkspaceDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getWorkspaces = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/workspaces", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      const fetchedWorkspaces = res.data || [];
      setWorkspaces(fetchedWorkspaces);
      if (fetchedWorkspaces.length > 0 && !activeWorkspace) {
        setActiveWorkspace(fetchedWorkspaces[0]);
        localStorage.setItem("activeWorkspaceId", fetchedWorkspaces[0].id);
      }
    } catch (err) {
      console.error("Failed to load workspaces", err);
    }
  };

  const getFolders = async (workspaceId) => {
    if (!workspaceId) return;
    try {
      const res = await axios.get(`http://localhost:8080/api/folders?workspaceId=${workspaceId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setFolders(res.data || []);
    } catch (err) {
      console.error("Failed to load folders", err);
    }
  };

  useEffect(() => { getWorkspaces(); }, []);

  useEffect(() => {
    if (activeWorkspace) getFolders(activeWorkspace.id);
  }, [activeWorkspace]);

  const handleCreateFolder = async (name) => {
    try {
      await axios.post(
        `http://localhost:8080/api/folders?workspaceId=${activeWorkspace.id}`,
        { name },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );
      await getFolders(activeWorkspace.id);
      toast.success("Folder created");
    } catch (err) {
      toast.error("Failed to create folder");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeWorkspaceId");
    toast.success("Logged out");
    navigate("/");
  };

  const navItemClass = ({ isActive }) =>
    `flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold transition-all ${
      isActive
        ? "bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary shadow-sm"
        : "text-text-secondary hover:bg-muted/50 dark:hover:bg-muted-dark/50 hover:text-text-primary dark:hover:text-text-darkPrimary"
    }`;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between px-5 py-8 bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark z-50">
      
      <div>
        {/* BRAND LOGO AREA */}
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-accent dark:bg-accent-dark flex items-center justify-center shadow-lg shadow-accent/10">
            <FileText size={ICON_SIZE} className="text-white dark:text-background-dark" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary dark:text-text-darkPrimary">
            SimplyNotes
          </span>
        </div>

        {/* WORKSPACE SWITCHER */}
        <div className="relative mb-10" ref={dropdownRef}>
          <button
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted dark:hover:bg-muted-dark transition group border border-transparent hover:border-border dark:hover:border-border-dark"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-text-primary/5 dark:bg-text-darkPrimary/10 text-text-primary dark:text-text-darkPrimary flex items-center justify-center">
                <Briefcase size={ICON_SIZE} />
              </div>
              <div className="flex flex-col items-start">
                <span className="text-[14px] font-bold text-text-primary dark:text-text-darkPrimary truncate w-28 text-left">
                  {activeWorkspace?.name || "Loading..."}
                </span>
                <span className="text-[11px] font-medium text-text-secondary uppercase tracking-wider">Workspace</span>
              </div>
            </div>
            <ChevronDown 
              size={18} 
              className={`text-text-secondary transition-transform duration-300 ${isWorkspaceDropdownOpen ? "rotate-180" : ""}`} 
            />
          </button>

          <AnimatePresence>
            {isWorkspaceDropdownOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                className="absolute top-full left-0 w-full mt-2 p-2 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl shadow-2xl z-50 overflow-hidden"
              >
                <div className="max-h-48 overflow-y-auto custom-scrollbar space-y-1">
                  {workspaces.map((ws) => (
                    <button
                      key={ws.id}
                      onClick={() => {
                        setActiveWorkspace(ws);
                        localStorage.setItem("activeWorkspaceId", ws.id);
                        window.dispatchEvent(new Event("workspaceChanged"));
                        setIsWorkspaceDropdownOpen(false);
                        navigate("/dashboard");
                      }}
                      className="w-full flex items-center justify-between px-3 py-3 text-sm font-medium rounded-xl hover:bg-muted dark:hover:bg-muted-dark transition"
                    >
                      <span>{ws.name}</span>
                      {activeWorkspace?.id === ws.id && <Check size={16} className="text-text-primary dark:text-text-darkPrimary" />}
                    </button>
                  ))}
                </div>
                <div className="h-px bg-border dark:bg-border-dark my-2"></div>
                <button 
                  onClick={() => toast("Workspace creation coming soon!", { icon: "🚧" })}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary rounded-xl transition"
                >
                  <Plus size={18} /> Create Workspace
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* 🔥 MAIN NAVIGATION */}
        <div className="mb-8">
          <p className="text-[11px] font-bold text-text-secondary/60 mb-3 uppercase tracking-[0.15em] ml-2">Main</p>
          <div className="space-y-1.5">
            <div
              onClick={() => {
                setActiveFolder(null);
                navigate("/dashboard");
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold cursor-pointer transition-all ${
                location.pathname === "/dashboard" && !isFavoritesActive && activeFolder === null
                  ? "bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary shadow-sm"
                  : "text-text-secondary hover:bg-muted/50 dark:hover:bg-muted-dark/50 hover:text-text-primary dark:hover:text-text-darkPrimary"
              }`}
            >
              <FileText size={ICON_SIZE} /> Notes
            </div>
            
            {/* 🔥 ACTIVATED FAVORITES BUTTON */}
            <div
              onClick={() => {
                setActiveFolder(null);
                navigate("/dashboard?favorites=true");
              }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold cursor-pointer transition-all ${
                isFavoritesActive
                  ? "bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary shadow-sm"
                  : "text-text-secondary hover:bg-muted/50 dark:hover:bg-muted-dark/50 hover:text-text-primary dark:hover:text-text-darkPrimary"
              }`}
            >
              <Star 
                size={ICON_SIZE} 
                className={isFavoritesActive ? "text-yellow-500 fill-yellow-500" : ""} 
              /> 
              Favorites
            </div>
          </div>
        </div>

        {/* FOLDERS LIST */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 ml-2">
            <p className="text-[11px] font-bold text-text-secondary/60 uppercase tracking-[0.15em]">Folders</p>
            <button onClick={() => setShowCreateModal(true)} className="p-1.5 rounded-lg hover:bg-muted dark:hover:bg-muted-dark transition text-text-secondary">
              <Plus size={16} />
            </button>
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar">
            {/* ALL NOTES */}
            <div
              onClick={() => { setActiveFolder(null); navigate("/dashboard"); }}
              className={`px-3 py-3 rounded-xl text-[15px] font-semibold cursor-pointer transition ${
                activeFolder === null && !isFavoritesActive 
                ? "bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary shadow-sm" 
                : "text-text-secondary hover:bg-muted/50 dark:hover:bg-muted-dark/50 hover:text-text-primary dark:hover:text-text-darkPrimary"
              }`}
            >
              All Notes
            </div>

            {/* DYNAMIC FOLDERS */}
            {folders.map((f) => (
              <div
                key={f.id}
                onClick={() => { setActiveFolder(f.id); navigate(`/dashboard?folder=${f.id}`); }}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold cursor-pointer transition truncate ${
                  activeFolder === f.id && !isFavoritesActive 
                  ? "bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary shadow-sm" 
                  : "text-text-secondary hover:bg-muted/50 dark:hover:bg-muted-dark/50 hover:text-text-primary dark:hover:text-text-darkPrimary"
                }`}
              >
                <Folder size={ICON_SIZE} className="opacity-70" />
                {f.name}
              </div>
            ))}
          </div>
        </div>

        {/* EXPLORE */}
        <div>
          <p className="text-[11px] font-bold text-text-secondary/60 mb-3 uppercase tracking-[0.15em] ml-2">Explore</p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-3 px-3 py-3 text-[15px] font-semibold text-text-secondary opacity-40 cursor-not-allowed">
              <Sparkles size={ICON_SIZE} /> AI Assistant
            </div>
            <NavLink to="/settings" className={navItemClass}>
              <Settings size={ICON_SIZE} /> Settings
            </NavLink>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BUTTONS */}
      <div className="space-y-3 pt-6 border-t border-border dark:border-border-dark">
        <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary transition hover:opacity-80">
          {darkMode ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
          {darkMode ? "Light Mode" : "Dark Mode"}
        </button>

        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[14px] font-bold text-red-500 hover:bg-red-500/10 transition">
          <LogOut size={ICON_SIZE} /> Logout
        </button>
      </div>

      <FolderCreateModal open={showCreateModal} onClose={() => setShowCreateModal(false)} onCreate={handleCreateFolder} />
    </aside>
  );
};

export default Sidebar;