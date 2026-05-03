import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { getNotes, deleteNote } from "../services/notesService";
import NotesGrid from "../components/notes/NotesGrid";

function DashboardPage() {
  const navigate = useNavigate();

  const [notes, setNotes] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

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

  // FILTER
  const filtered = useMemo(() => {
    return notes.filter((n) =>
      !query ||
      n.title?.toLowerCase().includes(query.toLowerCase()) ||
      n.content?.toLowerCase().includes(query.toLowerCase())
    );
  }, [notes, query]);

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

  // LOADING STATE
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

      {/* SEARCH BAR */}
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

      {/* NOTES GRID */}
      <NotesGrid
        notes={filtered}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default DashboardPage;