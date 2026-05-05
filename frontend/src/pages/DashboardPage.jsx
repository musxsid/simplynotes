import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";

import { getNotes, deleteNote } from "../services/notesService";
import { getFolders } from "../services/folderService";
import NotesGrid from "../components/notes/NotesGrid";

function DashboardPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [folders, setFolders] = useState([]);
  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const params = new URLSearchParams(location.search);
  const activeFolder = params.get("folder");

  // FETCH FOLDERS
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

  // FETCH NOTES
  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await getNotes();
        setNotes(res.data || []);
      } catch (err) {
        console.error("Failed to fetch notes:", err);
        toast.error("Failed to load notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNotes();
  }, []);

  // 🔥 FIXED GROUPING
  const groupedNotes = useMemo(() => {
    const map = {};

    notes.forEach((note) => {
      const folderId = note.folder?.id || note.folderId;

      // FILTER BY SIDEBAR
      if (activeFolder && String(folderId) !== activeFolder) return;

      // SEARCH FILTER
      if (
        query &&
        !note.title?.toLowerCase().includes(query.toLowerCase()) &&
        !note.content?.toLowerCase().includes(query.toLowerCase())
      ) {
        return;
      }

      // 🔥 FIXED NAME RESOLUTION
      const folderName =
        note.folder?.name ||
        folders.find((f) => Number(f.id) === Number(folderId))?.name ||
        "Ungrouped";

      if (!map[folderName]) map[folderName] = [];
      map[folderName].push(note);
    });

    return map;
  }, [notes, activeFolder, query, folders]); // ✅ FIXED dependency

  // DELETE
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
      <div className="flex justify-center items-center h-40">
        <p className="text-text-secondary">Loading notes...</p>
      </div>
    );
  }

  return (
    <div className="w-full px-6 py-6">

      {/* HEADER */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold text-text-primary dark:text-text-darkPrimary">
            Your Notes
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            Capture ideas, stay organized
          </p>
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/notes/new")}
          className="
            px-5 py-2.5 rounded-xl
            bg-indigo-600 text-white text-sm font-medium
            shadow-sm hover:shadow-md
            transition
          "
        >
          + New Note
        </motion.button>
      </div>

      {/* SEARCH */}
      <div className="mb-8 max-w-md">
        <input
          type="text"
          placeholder="Search notes..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="
            w-full h-11 px-4 rounded-xl
            bg-surface dark:bg-surface-dark
            border border-border dark:border-border-dark
            text-sm text-text-primary dark:text-text-darkPrimary
            placeholder:text-text-secondary
            outline-none
            focus:ring-2 focus:ring-indigo-400
            transition
          "
        />
      </div>

      {/* 🔥 GROUPED NOTES */}
      {Object.keys(groupedNotes).length === 0 ? (
        <p className="text-text-secondary text-sm">No notes found</p>
      ) : (
        Object.entries(groupedNotes).map(([folderName, notes]) => (
          <div key={folderName} className="mb-10">

            <h2 className="text-lg font-semibold mb-3 text-text-secondary">
              {folderName}
            </h2>

            <NotesGrid
              notes={notes}
              onDelete={handleDelete}
            />
          </div>
        ))
      )}

    </div>
  );
}

export default DashboardPage;