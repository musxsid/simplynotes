import { useEffect, useState } from "react";

function CommandPalette({ open, setOpen, commands, notes = [], onSelectNote }) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Reset when closed
  useEffect(() => {
    if (!open) {
      setQuery("");
      setSelectedIndex(0);
    }
  }, [open]);

  // Filter commands
  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  // Filter notes
  const filteredNotes = notes.filter(
    (n) =>
      query &&
      (n.title?.toLowerCase().includes(query.toLowerCase()) ||
        n.content?.toLowerCase().includes(query.toLowerCase()))
  );

  // Combine for keyboard navigation
  const combined = [
    ...filteredCommands.map((c) => ({ type: "command", data: c })),
    ...filteredNotes.map((n) => ({ type: "note", data: n })),
  ];

  // ⌨️ KEYBOARD NAVIGATION
  useEffect(() => {
    if (!open) return;

    const handleKey = (e) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < combined.length - 1 ? prev + 1 : prev
        );
      }

      if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : 0));
      }

      if (e.key === "Enter") {
        e.preventDefault();
        const item = combined[selectedIndex];
        if (!item) return;

        if (item.type === "command") {
          item.data.action();
        } else {
          onSelectNote(item.data);
        }

        setOpen(false);
      }

      if (e.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, combined, selectedIndex, setOpen, onSelectNote]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl shadow-xl border border-border dark:border-border-dark bg-surface dark:bg-surface-dark overflow-hidden">

        {/* INPUT */}
        <input
          autoFocus
          placeholder="Search notes or type a command..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setSelectedIndex(0);
          }}
          className="
            w-full px-4 py-3 border-b border-border dark:border-border-dark
            bg-transparent outline-none text-sm
            text-text-primary dark:text-text-darkPrimary
          "
        />

        <div className="max-h-80 overflow-y-auto">

          {/* COMMANDS */}
          {filteredCommands.length > 0 && (
            <>
              <p className="px-4 py-2 text-xs text-text-secondary uppercase">
                Commands
              </p>
              {filteredCommands.map((cmd, i) => {
                const index = i;
                const isActive = selectedIndex === index;

                return (
                  <button
                    key={i}
                    onClick={() => {
                      cmd.action();
                      setOpen(false);
                    }}
                    className={`
                      w-full text-left px-4 py-2 text-sm
                      ${isActive ? "bg-muted dark:bg-muted-dark" : "hover:bg-muted dark:hover:bg-muted-dark"}
                    `}
                  >
                    {cmd.label}
                  </button>
                );
              })}
            </>
          )}

          {/* NOTES */}
          {query && (
            <>
              <p className="px-4 py-2 text-xs text-text-secondary uppercase">
                Notes
              </p>

              {filteredNotes.length === 0 ? (
                <p className="px-4 py-2 text-sm text-text-secondary">
                  No matching notes
                </p>
              ) : (
                filteredNotes.map((note, i) => {
                  const index = filteredCommands.length + i;
                  const isActive = selectedIndex === index;

                  return (
                    <button
                      key={note.id}
                      onClick={() => {
                        onSelectNote(note);
                        setOpen(false);
                      }}
                      className={`
                        w-full text-left px-4 py-2 text-sm
                        ${isActive ? "bg-muted dark:bg-muted-dark" : "hover:bg-muted dark:hover:bg-muted-dark"}
                      `}
                    >
                      <div className="font-medium line-clamp-1">
                        {note.title || "Untitled"}
                      </div>
                      <div className="text-xs text-text-secondary line-clamp-1">
                        {note.content?.replace(/<[^>]+>/g, "")}
                      </div>
                    </button>
                  );
                })
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CommandPalette;