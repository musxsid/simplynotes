import { motion } from "framer-motion";
import { Pencil, Trash2 } from "lucide-react";

const NoteCard = ({ note, onDelete, onEdit }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 220, damping: 18 }}
      whileHover={{ y: -6, scale: 1.01 }}
      whileTap={{ scale: 0.97 }}
      className="
        backdrop-blur-xl bg-white/70 dark:bg-gray-800/70
        border border-white/20 dark:border-gray-700
        rounded-2xl p-5
        shadow-lg hover:shadow-xl
        transition-all duration-200
        text-gray-800 dark:text-gray-200
        flex flex-col justify-between
        min-h-[140px]
      "
    >
      {/* Content */}
      <p className="text-sm leading-relaxed line-clamp-4 mb-4">
        {note.content}
      </p>

      {/* Divider */}
      <div className="h-px bg-gray-200 dark:bg-gray-700 mb-3 opacity-60"></div>

      {/* Actions */}
      <div className="flex justify-between items-center">

        {/* Edit */}
        <button
          onClick={() => onEdit(note)}
          className="
            flex items-center gap-1 px-2 py-1 rounded-md
            text-blue-500 hover:bg-blue-500/10
            transition text-sm
          "
        >
          <Pencil size={16} />
          Edit
        </button>

        {/* Delete */}
        <button
          onClick={() => onDelete(note)}
          className="
            flex items-center gap-1 px-2 py-1 rounded-md
            text-red-500 hover:bg-red-500/10
            transition text-sm
          "
        >
          <Trash2 size={16} />
          Delete
        </button>

      </div>
    </motion.div>
  );
};

export default NoteCard;