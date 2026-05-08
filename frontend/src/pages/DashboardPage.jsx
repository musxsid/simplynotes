import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { Search, FileText, Plus, Star } from "lucide-react";

import { getNotes, deleteNote } from "../services/notesService";
import { getFolders } from "../services/folderService";
import NotesGrid from "../components/notes/NotesGrid";

import ProfileMenu from "../components/ui/ProfileMenu";

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const activeFolder = params.get("folder");
  
  const isFavoritesActive = params.get("favorites") === "true";

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await getFolders();
        setFolders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch folders:", err);
      }
    };
    fetchFolders();
  }, []);

  const fetchNotes = async () => {
    setLoading(true);
    try {
      const res = await getNotes();
      setNotes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
      if (err.response && (err.response.status === 403 || err.response.status === 404)) {
        localStorage.removeItem("activeWorkspaceId");
        toast.error("Please select a workspace to continue.");
        navigate("/workspaces"); 
      } else {
        toast.error("Failed to load notes");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentWorkspaceId = localStorage.getItem("activeWorkspaceId");
    if (!currentWorkspaceId) {
      navigate("/workspaces");
      return;
    }
    fetchNotes();
  }, [isFavoritesActive, activeFolder, navigate]);

  useEffect(() => {
    const handleWorkspaceChange = () => {
      fetchNotes();
      setQuery(""); 
    };
    window.addEventListener("workspaceChanged", handleWorkspaceChange);
    return () => window.removeEventListener("workspaceChanged", handleWorkspaceChange);
  }, []);

  const groupedNotes = useMemo(() => {
    const map = {};

    notes.forEach((note) => {
      const folderId = note.folder?.id;
      const folderName = note.folder?.name || "Ungrouped";

      if (activeFolder && String(folderId) !== activeFolder) return;
      if (isFavoritesActive && note.isFavorite !== true && note.favorite !== true) return;
      
      if (
        query &&
        !note.title?.toLowerCase().includes(query.toLowerCase()) &&
        !note.content?.toLowerCase().includes(query.toLowerCase())
      ) {
        return;
      }

      if (!map[folderName]) map[folderName] = [];
      map[folderName].push(note);
    });

    return map;
  }, [notes, activeFolder, isFavoritesActive, query]);

  const handleDelete = useCallback(async (note) => {
    try {
      await deleteNote(note.id);
      setNotes((prev) => prev.filter((n) => n.id !== note.id));
      toast.success("Note deleted");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete note");
    }
  }, []);

  if (loading) {
    return (
      <div className="w-full h-[60vh] flex flex-col items-center justify-center">
        <div className="w-6 h-6 border-2 border-text-secondary border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-sm font-medium text-text-secondary">Syncing workspace...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto px-8 py-10">

     
      <div className="fixed top-8 right-8 z-[100] hidden md:block">
        <ProfileMenu />
      </div>

      <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6 mt-2">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-text-primary dark:text-text-darkPrimary flex items-center gap-3">
            {isFavoritesActive && <Star size={32} className="text-yellow-500 fill-yellow-500" />}
            {isFavoritesActive ? "Your Favorites" : "Your Notes"}
          </h1>
          <p className="text-[15px] text-text-secondary mt-2">
            {isFavoritesActive 
              ? "Your starred and most important ideas." 
              : "Capture ideas, stay organized, and focus on what matters."}
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => navigate("/notes/new")}
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-accent dark:bg-accent-dark text-white dark:text-background-dark text-[15px] font-semibold shadow-card hover:shadow-cardHover transition-all duration-200"
        >
          <Plus size={18} /> New Note
        </motion.button>
      </div>

      {notes.length > 0 && (
        <div className="relative mb-12 max-w-xl">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-secondary opacity-70" />
          <input
            type="text"
            placeholder="Search your thoughts..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-2xl bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-[15px] text-text-primary dark:text-text-darkPrimary placeholder:text-text-secondary outline-none focus:border-text-secondary dark:focus:border-text-secondary transition-colors shadow-sm"
          />
        </div>
      )}

      {!loading && notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[50vh] text-center max-w-md mx-auto">
          <div className="w-20 h-20 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-3xl flex items-center justify-center mb-6 shadow-sm">
            <FileText size={32} className="text-text-secondary opacity-40" />
          </div>
          <h3 className="text-xl font-bold text-text-primary dark:text-text-darkPrimary tracking-tight">
            It's quiet in here
          </h3>
          <p className="text-[15px] text-text-secondary mt-2 leading-relaxed">
            This workspace doesn't have any notes yet. Start capturing your ideas or create a new project.
          </p>
          <button 
            onClick={() => navigate("/notes/new")}
            className="mt-8 px-6 py-3 bg-muted dark:bg-muted-dark hover:bg-border dark:hover:bg-border-dark text-text-primary dark:text-text-darkPrimary rounded-xl text-[14px] font-bold transition-colors"
          >
            Create your first note
          </button>
        </div>
      ) : (
        Object.keys(groupedNotes).length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center">
             {isFavoritesActive ? (
                <>
                  <Star size={48} className="text-text-secondary opacity-20 mb-4" />
                  <p className="text-text-primary font-medium text-[16px]">No favorites yet</p>
                  <p className="text-text-secondary text-[14px] mt-1">Star a note to see it here.</p>
                </>
             ) : (
                <p className="text-text-secondary text-[15px]">No notes match your search.</p>
             )}
          </div>
        ) : (
          Object.entries(groupedNotes).map(([folderName, notesGroup]) => (
            <div key={folderName} className="mb-12">
              <h2 className="text-xs font-bold mb-4 text-text-secondary uppercase tracking-[0.15em] ml-1">
                {folderName}
              </h2>
              <NotesGrid
                notes={notesGroup}
                onDelete={handleDelete}
              />
            </div>
          ))
        )
      )}
    </div>
  );
}

export default DashboardPage;