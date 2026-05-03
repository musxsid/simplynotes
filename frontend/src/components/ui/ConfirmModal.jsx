import { motion } from "framer-motion";

function ConfirmModal({ open, onClose, onConfirm, title, message }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        onClick={onClose}
        className="absolute inset-0 bg-black/50 backdrop-blur-md"
      />

      {/* MODAL */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 w-80"
      >
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        <p className="text-sm text-gray-500 mb-6">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-gray-200 dark:bg-gray-700"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            className="px-3 py-1 rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default ConfirmModal;