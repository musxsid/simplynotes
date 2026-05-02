import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

const NoteCard = ({ note, onDelete, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.12 } }}
      whileTap={{ scale: 0.97 }}
      className="
       backdrop-blur-xl bg-white/70 dark:bg-gray-800/70 
border border-white/20 dark:border-gray-700
shadow-xl
        text-gray-800 dark:text-gray-200
        rounded-2xl p-5 
        border border-gray-200 dark:border-gray-700
        shadow-sm hover:shadow-md
        transition
      "
    >
      {/* Content */}
      <p className="text-sm leading-relaxed line-clamp-4">
        {note.content}
      </p>

      {/* Actions */}
      <div className="flex justify-between items-center mt-5">
        <button
          onClick={() => onEdit(note)}
          className="flex items-center gap-1 text-blue-500 hover:text-blue-600 text-sm"
        >
          <Pencil size={16} />
          Edit
        </button>

        <button
          onClick={() => onDelete(note)}
          className="flex items-center gap-1 text-red-500 hover:text-red-600 text-sm"
        >
          <Trash2 size={16} />
          Delete
        </button>
      </div>
    </motion.div>
  );
};

export default NoteCard;