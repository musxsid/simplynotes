import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  FileText, Star, Sparkles, Settings, LogOut,
  Moon, Sun, Plus, ChevronDown, Check,
  Briefcase, Folder, LayoutGrid, Trash2,
  Calendar, Mail
} from "lucide-react";
import FolderCreateModal from "../ui/FolderCreateModal";
import CreateWorkspaceModal from "../ui/CreateWorkspaceModal";
import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import axios from "axios";
import { deleteFolder } from "../../services/folderService";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dropdownRef = useRef(null);
  
  const [folderToDelete, setFolderToDelete] = useState(null);
  const ICON_SIZE = 20;

  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("theme") === "dark");
  const [workspaces, setWorkspaces] = useState([]);
  const [activeWorkspace, setActiveWorkspace] = useState(null);
  const [isWorkspaceDropdownOpen, setIsWorkspaceDropdownOpen] = useState(false);
  
  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState(null);
  const [isFavoritesActive, setIsFavoritesActive] = useState(false); 
  
  const [showCreateFolderModal, setShowCreateFolderModal] = useState(false);
  const [showCreateWorkspaceModal, setShowCreateWorkspaceModal] = useState(false);
  
  const [isFoldersOpen, setIsFoldersOpen] = useState(true);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const folderFromURL = params.get("folder");
    const favoritesFromURL = params.get("favorites");

    if (folderFromURL) setActiveFolder(Number(folderFromURL));
    else setActiveFolder(null);

    if (favoritesFromURL === "true") setIsFavoritesActive(true);
    else setIsFavoritesActive(false);
  }, [location]);

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
        const storedId = localStorage.getItem("activeWorkspaceId");
        const match = fetchedWorkspaces.find(w => w.id.toString() === storedId);
        setActiveWorkspace(match || fetchedWorkspaces[0]);
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
  useEffect(() => { if (activeWorkspace) getFolders(activeWorkspace.id); }, [activeWorkspace]);

  useEffect(() => {
    const syncWorkspace = () => {
      const storedId = localStorage.getItem("activeWorkspaceId");
      if (storedId && workspaces.length > 0) {
        const match = workspaces.find(w => w.id.toString() === storedId);
        if (match) setActiveWorkspace(match);
      }
    };
    window.addEventListener("workspaceChanged", syncWorkspace);
    return () => window.removeEventListener("workspaceChanged", syncWorkspace);
  }, [workspaces]);

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

  const promptDeleteFolder = (e, folderId, folderName) => {
    e.stopPropagation();
    setFolderToDelete({ id: folderId, name: folderName });
  };

  const executeDeleteFolder = async () => {
    if (!folderToDelete) return;
    try {
      await deleteFolder(folderToDelete.id);
      toast.success("Folder deleted");
      if (activeFolder === folderToDelete.id) {
        setActiveFolder(null);
        navigate("/dashboard");
      }
      getFolders(activeWorkspace.id); 
    } catch (err) {
      toast.error("Failed to delete folder");
    } finally {
      setFolderToDelete(null); 
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activeWorkspaceId");
    localStorage.removeItem("pinnedWorkspaceId"); 
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
    <aside className="fixed left-0 top-0 h-screen w-64 flex flex-col justify-between bg-surface dark:bg-surface-dark border-r border-border dark:border-border-dark z-50">
      
      <div className="px-5 pt-8 pb-2">
        <div className="flex items-center gap-3 px-2 mb-8">
          <div className="w-9 h-9 rounded-xl bg-accent dark:bg-accent-dark flex items-center justify-center shadow-lg shadow-accent/10">
            <FileText size={ICON_SIZE} className="text-white dark:text-background-dark" />
          </div>
          <span className="text-xl font-bold tracking-tight text-text-primary dark:text-text-darkPrimary">
            SimplyNotes
          </span>
        </div>

        <div className="relative mb-6" ref={dropdownRef}>
          <button
            onClick={() => setIsWorkspaceDropdownOpen(!isWorkspaceDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-muted dark:hover:bg-muted-dark transition group border border-transparent hover:border-border dark:hover:border-border-dark"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 flex-shrink-0 rounded-lg bg-text-primary/5 dark:bg-text-darkPrimary/10 text-text-primary dark:text-text-darkPrimary flex items-center justify-center text-lg font-bold overflow-hidden">
                {activeWorkspace?.icon?.length > 2 
                  ? activeWorkspace.icon.charAt(0).toUpperCase() 
                  : (activeWorkspace?.icon || <Briefcase size={ICON_SIZE} />)}
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
                      <div className="flex items-center gap-2">
                        <span>{ws.icon || "💼"}</span>
                        <span>{ws.name}</span>
                      </div>
                      {activeWorkspace?.id === ws.id && <Check size={16} className="text-text-primary dark:text-text-darkPrimary" />}
                    </button>
                  ))}
                </div>
                
                <div className="h-px bg-border dark:bg-border-dark my-2"></div>
                
                <button 
                  onClick={() => { setIsWorkspaceDropdownOpen(false); navigate("/workspaces"); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary rounded-xl transition"
                >
                  <LayoutGrid size={18} /> View All Workspaces
                </button>

                <button 
                  onClick={() => { setIsWorkspaceDropdownOpen(false); setShowCreateWorkspaceModal(true); }}
                  className="w-full flex items-center gap-2 px-3 py-2.5 text-sm font-semibold text-text-secondary hover:text-text-primary rounded-xl transition"
                >
                  <Plus size={18} /> Create Workspace
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-5 custom-scrollbar pb-4">
        
        <div className="mb-8">
          <p className="text-[11px] font-bold text-text-secondary/60 mb-3 uppercase tracking-[0.15em] ml-2">Main</p>
          <div className="space-y-1.5">
            <div
              onClick={() => { setActiveFolder(null); navigate("/dashboard"); }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold cursor-pointer transition-all ${
                location.pathname === "/dashboard" && !isFavoritesActive && activeFolder === null
                  ? "bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary shadow-sm"
                  : "text-text-secondary hover:bg-muted/50 dark:hover:bg-muted-dark/50 hover:text-text-primary dark:hover:text-text-darkPrimary"
              }`}
            >
              <FileText size={ICON_SIZE} /> Notes
            </div>
            
            <NavLink to="/calendar" className={navItemClass}>
              <Calendar size={ICON_SIZE} /> Calendar
            </NavLink>
            <NavLink to="/mails" className={navItemClass}>
              <Mail size={ICON_SIZE} /> Mails
            </NavLink>

            <div
              onClick={() => { setActiveFolder(null); navigate("/dashboard?favorites=true"); }}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold cursor-pointer transition-all ${
                isFavoritesActive
                  ? "bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary shadow-sm"
                  : "text-text-secondary hover:bg-muted/50 dark:hover:bg-muted-dark/50 hover:text-text-primary dark:hover:text-text-darkPrimary"
              }`}
            >
              <Star size={ICON_SIZE} className={isFavoritesActive ? "text-yellow-500 fill-yellow-500" : ""} /> Favorites
            </div>
          </div>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-3 ml-2 group">
            <div 
              onClick={() => setIsFoldersOpen(!isFoldersOpen)}
              className="flex items-center gap-1 cursor-pointer select-none"
            >
              <ChevronDown 
                size={14} 
                className={`text-text-secondary transition-transform duration-200 ${!isFoldersOpen ? "-rotate-90" : ""}`} 
              />
              <p className="text-[11px] font-bold text-text-secondary/60 uppercase tracking-[0.15em] hover:text-text-primary transition-colors">
                Folders
              </p>
            </div>
            <button 
              onClick={() => setShowCreateFolderModal(true)} 
              className="p-1.5 rounded-lg hover:bg-muted dark:hover:bg-muted-dark transition text-text-secondary hover:text-text-primary"
            >
              <Plus size={16} />
            </button>
          </div>

          <AnimatePresence>
            {isFoldersOpen && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="space-y-1.5">
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

                  {folders.map((f) => (
                    <div
                      key={f.id}
                      onClick={() => { setActiveFolder(f.id); navigate(`/dashboard?folder=${f.id}`); }}
                      className={`group flex items-center justify-between px-3 py-3 rounded-xl text-[15px] font-semibold cursor-pointer transition ${
                        activeFolder === f.id && !isFavoritesActive 
                        ? "bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary shadow-sm" 
                        : "text-text-secondary hover:bg-muted/50 dark:hover:bg-muted-dark/50 hover:text-text-primary dark:hover:text-text-darkPrimary"
                      }`}
                    >
                      <div className="flex items-center gap-3 truncate">
                        <Folder size={ICON_SIZE} className="opacity-70 flex-shrink-0" />
                        <span className="truncate">{f.name}</span>
                      </div>
                      
                      <button
                        onClick={(e) => promptDeleteFolder(e, f.id, f.name)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-500 transition-all flex-shrink-0"
                        title="Delete folder"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="px-5 pb-8 pt-4 border-t border-border dark:border-border-dark bg-surface dark:bg-surface-dark">
        
        {/* AI Assistant Card */}
        <NavLink 
          to="/ai" 
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3.5 rounded-2xl mb-4 transition-all duration-300 group
            ${isActive ? 'bg-indigo-500 text-white' : 'bg-indigo-500/5 hover:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'}
          `}
        >
          <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
          <div className="flex flex-col">
            <span className="text-[14px] font-bold">AI Assistant</span>
            <span className="text-[11px] opacity-70">Generate & fix notes</span>
          </div>
        </NavLink>

        <div className="space-y-1.5">
          <NavLink to="/settings" className={navItemClass}>
            <Settings size={ICON_SIZE} /> Settings
          </NavLink>
          
          <button onClick={() => setDarkMode(!darkMode)} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold text-text-secondary hover:bg-muted dark:hover:bg-muted-dark hover:text-text-primary dark:hover:text-text-darkPrimary transition">
            {darkMode ? <Sun size={ICON_SIZE} /> : <Moon size={ICON_SIZE} />}
            {darkMode ? "Light Mode" : "Dark Mode"}
          </button>

          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-semibold text-red-500 hover:bg-red-500/10 transition">
            <LogOut size={ICON_SIZE} /> Logout
          </button>
        </div>
      </div>

      <FolderCreateModal open={showCreateFolderModal} onClose={() => setShowCreateFolderModal(false)} onCreate={handleCreateFolder} />
      
      <CreateWorkspaceModal 
        open={showCreateWorkspaceModal} 
        onClose={() => setShowCreateWorkspaceModal(false)} 
        onCreated={() => {
          getWorkspaces(); 
          navigate("/workspaces"); 
        }} 
      />

      <AnimatePresence>
        {folderToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark p-6 rounded-3xl shadow-2xl w-full max-w-sm text-center"
            >
              <div className="w-12 h-12 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-red-500">
                <Trash2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary mb-2 tracking-tight">
                Delete Folder?
              </h3>
              <p className="text-[15px] text-text-secondary mb-8 leading-relaxed">
                Are you sure you want to delete the <strong className="text-text-primary dark:text-text-darkPrimary">"{folderToDelete.name}"</strong> folder? Any notes inside will become ungrouped.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setFolderToDelete(null)}
                  className="flex-1 py-3 rounded-xl font-bold text-[14px] bg-muted dark:bg-muted-dark text-text-primary dark:text-text-darkPrimary hover:opacity-80 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={executeDeleteFolder}
                  className="flex-1 py-3 rounded-xl font-bold text-[14px] bg-red-500 text-white hover:bg-red-600 transition shadow-lg shadow-red-500/20 active:scale-95"
                >
                  Delete Folder
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </aside>
  );
};

export default Sidebar;