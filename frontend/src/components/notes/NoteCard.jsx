import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ConfirmModal from "../ui/ConfirmModal";

function NoteCard({ note, onDelete }) {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const handleClick = () => {
    if (!note?.id) return;
    navigate(`/notes/${note.id}`);
  };

  // ✅ FIX: LOCK BACKGROUND WHEN MODAL IS OPEN
  useEffect(() => {
    if (showConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showConfirm]);

  return (
    <>
      {/* CARD */}
      <div
        onClick={handleClick}
        className="
          group p-5 rounded-2xl cursor-pointer
          bg-surface dark:bg-surface-dark
          border border-border dark:border-border-dark
          shadow-sm hover:shadow-md
          transition-all duration-200
          hover:-translate-y-[2px]
        "
      >
        {/* TITLE */}
        <h2 className="font-semibold text-lg mb-2 text-text-primary dark:text-text-darkPrimary line-clamp-1">
          {note.title || "Untitled"}
        </h2>

        {/* CONTENT */}
        <p className="text-sm text-text-secondary dark:text-text-darkSecondary line-clamp-3">
          {note.content?.replace(/<[^>]+>/g, "")}
        </p>

        {/* FOOTER */}
        <div className="mt-5 flex justify-between items-center">
          <span className="text-xs text-text-secondary">
            {new Date(note.updatedAt || Date.now()).toLocaleString()}
          </span>

          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowConfirm(true);
            }}
            className="
              text-xs text-red-500 opacity-0
              group-hover:opacity-100
              transition
              hover:underline
            "
          >
            Delete
          </button>
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
        title="Delete note?"
        message="This action cannot be undone."
      />
    </>
  );
}

export default NoteCard;