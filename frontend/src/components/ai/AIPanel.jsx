import { X, Sparkles } from "lucide-react";
import { useState } from "react";

function AIPanel({ open, onClose, onAction, result, onInsert }) {
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const actions = [
    "Summarize",
    "Improve Writing",
    "Brainstorm Ideas",
    "Format Notes",
  ];

  const handleClick = async (action) => {
    setLoading(true);
    await onAction(action);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      
      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* PANEL */}
      <div className="relative w-full max-w-md h-full bg-surface dark:bg-surface-dark border-l border-border dark:border-border-dark shadow-xl p-5 flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Sparkles size={18} />
            <h2 className="font-semibold text-lg">
              AI Assistant
            </h2>
          </div>

          <button onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* ACTIONS */}
        <div className="space-y-2 mb-6">
          {actions.map((action) => (
            <button
              key={action}
              onClick={() => handleClick(action)}
              className="w-full text-left px-4 py-3 rounded-xl bg-muted dark:bg-muted-dark hover:opacity-80 transition text-sm"
            >
              {action}
            </button>
          ))}
        </div>

        {/* OUTPUT */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 rounded-xl border border-border dark:border-border-dark p-4 text-sm text-text-primary dark:text-text-darkPrimary overflow-y-auto">
            {loading
              ? "Generating..."
              : result || "AI output will appear here..."}
          </div>

          {/* INSERT BUTTON */}
          {result && (
            <button
              onClick={onInsert}
              className="mt-4 px-4 py-2 rounded-xl bg-indigo-600 text-white text-sm hover:opacity-90"
            >
              Insert into Note
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIPanel;