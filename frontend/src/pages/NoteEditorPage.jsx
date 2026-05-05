import {
  Undo2,
  Redo2,
  Bold,
  Italic,
  Underline as UnderlineIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link as LinkIcon,
  Image as ImageIcon,
  CheckCircle2,
  Loader2
} from "lucide-react";
import { getFolders } from "../services/folderService";
import AIPanel from "../components/ai/AIPanel";

import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteById, updateNote, createNote } from "../services/notesService";
import toast from "react-hot-toast";

// ⚠️ Temporarily removed FloatingMenu and BubbleMenu to fix Vite error
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

function NoteEditorPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [folders, setFolders] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState("");
  const [note, setNote] = useState({ title: "", content: "" });
  const [aiOpen, setAiOpen] = useState(false);

  // Auto-save states
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Link,
      Image,
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    // 🔥 Listen for editor updates to trigger auto-save
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
  });

  // FETCH FOLDERS
  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const res = await getFolders();
        setFolders(res.data || []);
      } catch (err) {
        console.error("Failed to load folders", err);
      }
    };
    fetchFolders();
  }, []);

  // FETCH NOTE
  useEffect(() => {
    if (!id || id === "new") return;

    const fetchNote = async () => {
      try {
        const res = await getNoteById(id);
        setNote({ title: res.data.title, content: res.data.content });
        setSelectedFolder(res.data.folder?.id?.toString() || ""); 
        
        if (editor && res.data.content) {
          editor.commands.setContent(res.data.content);
          setEditorContent(res.data.content);
        }
      } catch {
        toast.error("Note not found");
      }
    };
    fetchNote();
  }, [id, editor]);

  // 🔥 SAVE FUNCTION (Memoized for Auto-Save)
  const handleSave = useCallback(async (isManual = false) => {
    if (!editor) return;
    
    setIsSaving(true);
    try {
      const payload = {
        title: note.title || "Untitled",
        content: editor.getHTML(),
        folder: selectedFolder ? { id: Number(selectedFolder) } : null,
      };

      if (id === "new") {
        // If manual save on new note, create it and redirect to its new URL
        if (isManual) {
          const res = await createNote(payload);
          toast.success("Note created");
          navigate(`/notes/${res.data.id}`, { replace: true });
        }
      } else {
        // Update existing note
        await updateNote(id, payload);
        const now = new Date();
        setLastSaved(`Saved at ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
        if (isManual) toast.success("Note saved manually");
      }
    } catch {
      if (isManual) toast.error("Save failed");
    } finally {
      setIsSaving(false);
    }
  }, [id, note.title, editor, selectedFolder, navigate]);

  // 🔥 AUTO-SAVE (DEBOUNCING)
  useEffect(() => {
    // Only auto-save if it's an existing note (prevents creating blank drafts)
    if (id === "new") return;

    const timeoutId = setTimeout(() => {
      handleSave(false);
    }, 1500); // Waits 1.5 seconds after typing stops

    return () => clearTimeout(timeoutId);
  }, [note.title, editorContent, selectedFolder, handleSave, id]);

  if (!editor) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-text-secondary hover:text-text-primary dark:hover:text-text-darkPrimary transition text-sm font-medium flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center gap-4">
          {/* AUTO-SAVE STATUS */}
          {id !== "new" && (
            <div className="text-xs text-text-secondary flex items-center gap-1">
              {isSaving ? (
                <><Loader2 size={12} className="animate-spin" /> Saving...</>
              ) : lastSaved ? (
                <><CheckCircle2 size={12} className="text-green-500" /> {lastSaved}</>
              ) : null}
            </div>
          )}

          <button
            onClick={() => handleSave(true)}
            className="bg-accent dark:bg-accent-dark text-white dark:text-background-dark px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm hover:opacity-90 transition"
          >
            Save Note
          </button>
        </div>
      </div>

      {/* TITLE */}
      <input
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        placeholder="Untitled"
        className="text-5xl font-extrabold w-full mb-6 outline-none bg-transparent text-text-primary dark:text-text-darkPrimary placeholder:text-text-secondary/30"
      />

      {/* FOLDER SELECTOR */}
      <div className="mb-6 flex items-center gap-3">
        <select
          value={selectedFolder || ""}
          onChange={(e) => setSelectedFolder(e.target.value)}
          className="px-4 py-2 rounded-xl text-sm font-medium bg-surface dark:bg-surface-dark border border-border dark:border-border-dark text-text-primary dark:text-text-darkPrimary outline-none focus:border-text-secondary cursor-pointer transition-colors"
        >
          <option value="">No Folder</option>
          {folders.map((f) => (
            <option key={f.id} value={f.id}>{f.name}</option>
          ))}
        </select>
      </div>

      {/* STATIC TOOLBAR (Added back since we removed the floating ones) */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-t-2xl px-4 py-3 border-b flex flex-wrap items-center gap-4">
        
        <div className="flex items-center gap-1 pr-4 border-r border-border dark:border-border-dark">
          <button className="p-1.5 rounded hover:bg-muted dark:hover:bg-muted-dark text-text-secondary" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={18} /></button>
          <button className="p-1.5 rounded hover:bg-muted dark:hover:bg-muted-dark text-text-secondary" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={18} /></button>
        </div>

        <div className="flex items-center gap-1 pr-4 border-r border-border dark:border-border-dark">
          <button className={`p-1.5 rounded hover:bg-muted dark:hover:bg-muted-dark ${editor.isActive('bold') ? 'text-text-primary bg-muted dark:bg-muted-dark' : 'text-text-secondary'}`} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={18} /></button>
          <button className={`p-1.5 rounded hover:bg-muted dark:hover:bg-muted-dark ${editor.isActive('italic') ? 'text-text-primary bg-muted dark:bg-muted-dark' : 'text-text-secondary'}`} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={18} /></button>
          <button className={`p-1.5 rounded hover:bg-muted dark:hover:bg-muted-dark ${editor.isActive('underline') ? 'text-text-primary bg-muted dark:bg-muted-dark' : 'text-text-secondary'}`} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={18} /></button>
        </div>

        <div className="flex items-center gap-1 pr-4 border-r border-border dark:border-border-dark">
          <button className="p-1.5 rounded hover:bg-muted dark:hover:bg-muted-dark text-text-secondary" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}>H1</button>
          <button className="p-1.5 rounded hover:bg-muted dark:hover:bg-muted-dark text-text-secondary" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>H2</button>
          <button className={`p-1.5 rounded hover:bg-muted dark:hover:bg-muted-dark ${editor.isActive('bulletList') ? 'text-text-primary bg-muted dark:bg-muted-dark' : 'text-text-secondary'}`} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={18} /></button>
        </div>

        <button onClick={() => setAiOpen(true)} className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm shadow hover:opacity-90 transition">
          ✨ AI Assist
        </button>
      </div>

      {/* EDITOR CONTAINER */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-b-2xl border-t-0 min-h-[500px] shadow-sm pb-10">
        <EditorContent editor={editor} className="prose prose-zinc dark:prose-invert max-w-none p-8 outline-none" />
      </div>

      <AIPanel open={aiOpen} onClose={() => setAiOpen(false)} onAction={(type) => console.log("AI Action:", type)} />
    </div>
  );
}

export default NoteEditorPage;