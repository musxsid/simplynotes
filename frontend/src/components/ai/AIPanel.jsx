import { X, Sparkles, Copy, Check } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

function AIPanel({ open, onClose, onAction, result, onInsert }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const actions = [
    { id: "Summarize", label: "Summarize", desc: "Bullet points of key info" },
    { id: "Improve Writing", label: "Fix Writing", desc: "Professional & clear" },
    { id: "Brainstorm Ideas", label: "Brainstorm", desc: "5 fresh creative ideas" },
    { id: "Format Notes", label: "Structure", desc: "Organize messy notes" },
  ];

  const handleClick = async (action) => {
    setLoading(true);
    setCopied(false);
    await onAction(action);
    setLoading(false);
  };

  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    toast.success("Copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* BACKDROP */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* PANEL */}
      <div className="relative w-full max-w-md h-full bg-surface dark:bg-surface-dark border-l border-border dark:border-border-dark shadow-2xl p-6 flex flex-col">
        
        {/* HEADER */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500 rounded-lg text-white">
              <Sparkles size={20} />
            </div>
            <div>
              <h2 className="font-bold text-xl tracking-tight text-text-primary dark:text-text-darkPrimary">Spark AI</h2>
              <p className="text-xs text-text-secondary">Your intelligent workspace partner</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted dark:hover:bg-muted-dark rounded-full transition">
            <X size={20} />
          </button>
        </div>

        {/* ACTIONS GRID */}
        <div className="grid grid-cols-2 gap-3 mb-8">
          {actions.map((action) => (
            <button
              key={action.id}
              onClick={() => handleClick(action.id)}
              disabled={loading}
              className="group text-left p-4 rounded-2xl bg-muted/50 dark:bg-muted-dark/50 hover:bg-indigo-500 hover:text-white transition-all duration-200 border border-transparent hover:border-indigo-400"
            >
              <p className="font-bold text-sm mb-1">{action.label}</p>
              <p className="text-[10px] opacity-60 group-hover:opacity-90">{action.desc}</p>
            </button>
          ))}
        </div>

        {/* OUTPUT AREA */}
        <div className="flex-1 flex flex-col min-h-0">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-text-secondary">Response</span>
            {result && (
              <button onClick={handleCopy} className="text-text-secondary hover:text-indigo-500 transition">
                {copied ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
              </button>
            )}
          </div>
          
          <div className="flex-1 rounded-2xl bg-muted/30 dark:bg-muted-dark/30 border border-border dark:border-border-dark p-5 text-sm leading-relaxed overflow-y-auto whitespace-pre-wrap">
            {loading ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-text-secondary">
                <Sparkles size={24} className="animate-pulse text-indigo-500" />
                <p className="animate-pulse font-medium">Spark is thinking...</p>
              </div>
            ) : result ? (
<div 
        className="prose prose-sm dark:prose-invert max-w-none 
                   prose-h3:text-indigo-500 prose-h3:mt-0 prose-h3:mb-2
                   prose-p:text-text-primary dark:prose-p:text-text-darkPrimary prose-p:my-2
                   prose-li:my-1"
        dangerouslySetInnerHTML={{ __html: result }} 
      />            ) : (
              <div className="h-full flex items-center justify-center text-center text-text-secondary/40 px-6">
                Highlight text in your note and select an action to start.
              </div>
            )}
          </div>

          {/* FOOTER ACTIONS */}
          {result && !loading && (
            <div className="mt-4 flex gap-3">
              <button
                onClick={onInsert}
                className="flex-1 py-4 rounded-2xl bg-indigo-600 text-white font-bold text-sm shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition"
              >
                Insert into Note
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AIPanel;