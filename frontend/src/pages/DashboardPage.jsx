import Modal from "../components/ui/Modal";
import { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote, updateNote } from "../services/notesService";
import NotesGrid from "../components/notes/NotesGrid";
import toast from "react-hot-toast";

function DashboardPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [noteToDelete, setNoteToDelete] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const res = await getNotes();
      setNotes(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  // 🌙 DARK MODE
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ⌨️ SHORTCUTS
  useEffect(() => {
    const handler = (e) => {
      const isMac = navigator.platform.toUpperCase().includes("MAC");
      const isNew =
        (isMac ? e.metaKey : e.ctrlKey) && e.key.toLowerCase() === "n";

      if (isNew) {
        e.preventDefault();
        setEditingNote(null);
        setNewNote("");
        setIsModalOpen(true);
      }

      if (e.key === "Escape") {
        setIsModalOpen(false);
        setNoteToDelete(null);
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  const handleSaveNote = async () => {
    if (!newNote.trim()) return;

    try {
      if (editingNote) {
        await updateNote(editingNote.id, { content: newNote });
        toast.success("Note updated");
      } else {
        await createNote({ content: newNote });
        toast.success("Note created");
      }

      setNewNote("");
      setEditingNote(null);
      setIsModalOpen(false);
      fetchNotes();
    } catch {
      toast.error("Something went wrong");
    }
  };

  const handleEdit = (note) => {
    setEditingNote(note);
    setNewNote(note.content);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (note) => {
    setNoteToDelete(note);
  };

  const confirmDelete = async () => {
    if (!noteToDelete) return;

    try {
      await deleteNote(noteToDelete.id);
      toast.success("Note deleted");
      setNoteToDelete(null);
      fetchNotes();
    } catch {
      toast.error("Delete failed");
    }
  };

  return (
    <div className="p-8 w-full bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-8">

        <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100">
          Your Notes
        </h2>

        <div className="flex gap-3 items-center">

          <input
            type="text"
            placeholder="Search notes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border rounded-lg px-3 py-2 w-64 
            bg-white dark:bg-gray-800 
            text-gray-800 dark:text-white 
            border-gray-300 dark:border-gray-600"
          />

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-3 py-2 rounded-lg border 
            bg-white dark:bg-gray-800 
            text-gray-800 dark:text-white"
          >
            {darkMode ? "🌞" : "🌙"}
          </button>

          <button
            onClick={() => {
              setEditingNote(null);
              setNewNote("");
              setIsModalOpen(true);
            }}
            className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition active:scale-95"
          >
            + New Note
            <span className="ml-2 text-xs opacity-70">
              (Ctrl/Cmd + N)
            </span>
          </button>

        </div>
      </div>

      {/* CONTENT */}
      {loading ? (
        <div className="text-center mt-20 text-gray-400">
          Loading notes...
        </div>
      ) : (
        <NotesGrid
          notes={filteredNotes}
          onDelete={handleDeleteClick}
          onEdit={handleEdit}
        />
      )}

      {/* CREATE / EDIT MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <textarea
          value={newNote}
          onChange={(e) => setNewNote(e.target.value)}
          className="w-full border rounded-lg p-2 mb-4 
          bg-white dark:bg-gray-800 text-white"
          rows="4"
        />

        <button
          onClick={handleSaveNote}
          className="bg-black text-white px-4 py-2 rounded-lg w-full"
        >
          {editingNote ? "Update Note" : "Save Note"}
        </button>
      </Modal>

      {/* DELETE MODAL */}
      <Modal isOpen={!!noteToDelete} onClose={() => setNoteToDelete(null)}>
        <p className="mb-4">Delete this note?</p>

        <button
          onClick={confirmDelete}
          className="bg-red-500 text-white px-4 py-2 rounded-lg w-full"
        >
          Delete
        </button>
      </Modal>

    </div>
  );
}

export default DashboardPage;