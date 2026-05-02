import Modal from "../components/ui/Modal";
import { useEffect, useState } from "react";
import { getNotes, createNote, deleteNote, updateNote } from "../services/notesService";
import Sidebar from "../components/layout/Sidebar";
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

  // 🔥 FILTERED NOTES
  const filteredNotes = notes.filter((note) =>
    note.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 🔹 Fetch notes
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

  // 🌙 APPLY DARK MODE
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  // 💾 LOAD + SAVE THEME
  useEffect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark") setDarkMode(true);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // 🔹 HANDLE SAVE
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
    } catch (err) {
      toast.error("Something went wrong");
      console.error(err);
    }
  };

  // 🔹 HANDLE EDIT
  const handleEdit = (note) => {
    setEditingNote(note);
    setNewNote(note.content);
    setIsModalOpen(true);
  };

  // 🔹 DELETE FLOW
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
    } catch (err) {
      toast.error("Delete failed");
      console.error(err);
    }
  };

  return (
    <div className="flex">
      <Sidebar />

      {/* 🔥 MAIN CONTENT */}
      <div className="ml-64 p-8 w-full bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors">

        {/* 🔥 HEADER */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-5 mb-8">

          <h2 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
            Your Notes
          </h2>

          <div className="flex gap-3 w-full md:w-auto items-center">

            {/* 🔍 SEARCH */}
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border rounded-lg px-3 py-2 w-full md:w-64 
              bg-white dark:bg-gray-800 
              text-gray-800 dark:text-white 
              border-gray-300 dark:border-gray-600
              focus:outline-none focus:ring-2 focus:ring-black transition"
            />

            {/* 🌙 DARK MODE */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-3 py-2 rounded-lg border 
              bg-white dark:bg-gray-800 
              text-gray-800 dark:text-white
              border-gray-300 dark:border-gray-600 
              transition active:scale-95"
            >
              {darkMode ? "🌞" : "🌙"}
            </button>

            {/* ➕ NEW NOTE */}
            <button
              onClick={() => {
                setEditingNote(null);
                setNewNote("");
                setIsModalOpen(true);
              }}
              className="bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition active:scale-95"
            >
              + New Note
            </button>

          </div>
        </div>

        {/* 🔥 LOADING / NOTES */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm animate-pulse"
              >
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
              </div>
            ))}
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
          <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-white">
            {editingNote ? "Edit Note" : "Create Note"}
          </h3>

          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full border rounded-lg p-2 mb-4 
            bg-white dark:bg-gray-800 
            text-gray-800 dark:text-white 
            border-gray-300 dark:border-gray-600"
            rows="4"
            placeholder="Write your note..."
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
          <h3 className="text-lg font-semibold mb-4 text-red-500">
            Delete Note
          </h3>

          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Are you sure you want to delete this note?
          </p>

          <div className="flex justify-end gap-3">
            <button
              onClick={() => setNoteToDelete(null)}
              className="px-4 py-2 rounded-lg border 
              border-gray-300 dark:border-gray-600
              text-gray-800 dark:text-white"
            >
              Cancel
            </button>

            <button
              onClick={confirmDelete}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        </Modal>

      </div>
    </div>
  );
}

export default DashboardPage;