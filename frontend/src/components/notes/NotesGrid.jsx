import { motion } from "framer-motion";
import NoteCard from "./NoteCard";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] },
  },
};

const NotesGrid = ({ notes, onDelete, onEdit, searchTerm }) => {
  // EMPTY STATE
  if (!notes || notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-28 text-center">
        <div
          className="
            mb-4 flex items-center justify-center
            w-16 h-16 rounded-2xl
            bg-surface dark:bg-surface-dark
            border border-border dark:border-border-dark
            text-xl
          "
        >
          📝
        </div>

        <p className="text-lg font-semibold text-text-primary dark:text-text-darkPrimary">
          {searchTerm ? "No results found" : "No notes yet"}
        </p>

        <p className="text-sm text-text-secondary mt-2">
          {searchTerm
            ? "Try a different keyword"
            : "Start by creating your first note"}
        </p>
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="
        grid gap-6
        sm:grid-cols-2
        lg:grid-cols-3
        xl:grid-cols-4
      "
    >
      {notes.map((note, index) => (
        <motion.div key={note.id} variants={item}>
          <NoteCard
            note={note}
            onDelete={onDelete}
            onEdit={onEdit}
            index={index}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export default NotesGrid;