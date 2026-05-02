import { motion } from "framer-motion";
import NoteCard from "./NoteCard";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
transition: { duration: 0.2, ease: "easeOut" }  },
};

const NotesGrid = ({ notes, onDelete, onEdit, searchTerm }) => {
  if (!notes || notes.length === 0) {
    return (
      <div className="text-gray-400 text-center mt-16">
        <p className="text-lg font-medium">
          {searchTerm ? "No matching notes found 🔍" : "No notes yet 📝"}
        </p>
        <p className="text-sm mt-2">
          {searchTerm ? "Try a different keyword" : "Click 'New Note' to create your first note"}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
    >
      {notes.map((note) => (
        <motion.div key={note.id} variants={item}>
          <NoteCard note={note} onDelete={onDelete} onEdit={onEdit} />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NotesGrid;