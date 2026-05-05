import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MoreVertical, Star, FolderOpen, Trash2 } from "lucide-react";
import toast from "react-hot-toast";

import ConfirmModal from "../ui/ConfirmModal";

function NoteCard({ note, onDelete }) {
  const navigate = useNavigate();
  
  const [showConfirm, setShowConfirm] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Navigate to editor
  const handleClick = () => {
    if (!note?.id) return;
    navigate(`/notes/${note.id}`);
  };

  // ✅ FIX: LOCK BACKGROUND WHEN DELETE MODAL IS OPEN
  useEffect(() => {
    if (showConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [showConfirm]);

  // Handle Clicking Outside the Dropdown Menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false);
      }
    };
    if (isMenuOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  // Mock functions for Phase 3 features
  const handleFavorite = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    toast.success("Added to Favorites!"); // We will wire this to backend later
  };

  const handleMove = (e) => {
    e.stopPropagation();
    setIsMenuOpen(false);
    toast("Move feature coming next!", { icon: "📁" }); 
  };

  return (
    <>
      {/* CARD */}
      <div
        onClick={handleClick}
        className="
          group relative p-5 rounded-2xl cursor-pointer
          bg-surface dark:bg-surface-dark
          border border-border dark:border-border-dark
          shadow-sm hover:shadow-cardHover
          transition-all duration-200 hover:-translate-y-1
          flex flex-col h-full
        "
      >
        {/* HEADER: Title & Menu Button */}
        <div className="flex items-start justify-between gap-4 mb-2">
          <h2 className="font-bold text-lg text-text-primary dark:text-text-darkPrimary line-clamp-1 flex-1">
            {note.title || "Untitled"}
          </h2>

          {/* THREE DOTS BUTTON */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMenuOpen(!isMenuOpen);
              }}
              className="p-1.5 rounded-lg text-text-secondary hover:bg-muted dark:hover:bg-muted-dark hover:text-text-primary dark:hover:text-text-darkPrimary transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
            >
              <MoreVertical size={18} />
            </button>

            {/* DROPDOWN MENU */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, transformOrigin: "top right" }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 top-8 w-40 z-20 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-xl shadow-xl overflow-hidden py-1"
                >
                  <button 
                    onClick={handleFavorite}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary dark:text-text-darkPrimary hover:bg-muted dark:hover:bg-muted-dark transition-colors"
                  >
                    <Star size={14} className="text-yellow-500" /> Favorite
                  </button>
                  <button 
                    onClick={handleMove}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-primary dark:text-text-darkPrimary hover:bg-muted dark:hover:bg-muted-dark transition-colors"
                  >
                    <FolderOpen size={14} className="text-indigo-500" /> Move to...
                  </button>
                  <div className="h-px bg-border dark:bg-border-dark my-1 mx-2" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setIsMenuOpen(false);
                      setShowConfirm(true);
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* CONTENT */}
        <p className="text-[14px] text-text-secondary dark:text-text-darkSecondary line-clamp-3 mb-6 flex-1">
          {note.content ? note.content.replace(/<[^>]+>/g, "") : "No content inside..."}
        </p>

        {/* FOOTER */}
        <div className="mt-auto flex justify-between items-center pt-4 border-t border-border/50 dark:border-border-dark/50">
          <span className="text-[11px] font-medium tracking-wide text-text-secondary uppercase">
            {new Date(note.updatedAt || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </span>
          
          {/* Tag indicator if inside a folder */}
          {note.folder && (
            <span className="text-[10px] px-2 py-1 rounded-md bg-muted dark:bg-muted-dark text-text-secondary font-semibold max-w-[100px] truncate">
              {note.folder.name}
            </span>
          )}
        </div>
      </div>

      {/* CONFIRM MODAL */}
      <ConfirmModal
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={() => {
          onDelete(note);
          setShowConfirm(false);
        }}
        title="Delete Note?"
        message="This note will be permanently deleted. This action cannot be undone."
      />
    </>
  );
}

export default NoteCard;