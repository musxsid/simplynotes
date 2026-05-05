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
} from "lucide-react";
import { getFolders } from "../services/folderService";

import AIPanel from "../components/ai/AIPanel";

import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getNoteById, updateNote, createNote } from "../services/notesService";
import toast from "react-hot-toast";

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
  const [aiResult, setAiResult] = useState("");
  const [folders, setFolders] = useState([]);
const [selectedFolder, setSelectedFolder] = useState("");

  const [note, setNote] = useState({ title: "", content: "" });
  const [aiOpen, setAiOpen] = useState(false);

  const runMockAI = (text, type) => {
  if (!text) return "Please select some text first.";

  switch (type) {
    case "Summarize":
      return text.slice(0, 100) + "... (summary)";
    case "Improve Writing":
      return text + " (improved)";
    case "Brainstorm Ideas":
      return "• Idea 1\n• Idea 2\n• Idea 3";
    case "Format Notes":
      return text.toUpperCase();
    default:
      return text;
  }
};
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
  });
  
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
  // FETCH NOTE
  useEffect(() => {
    if (!id || id === "new") return;

    const fetchNote = async () => {
      try {
        const res = await getNoteById(id);
        setNote(res.data);
        
        // ✅ FIX 1: Read from the new nested folder object instead of raw folderId
        setSelectedFolder(res.data.folder?.id?.toString() || ""); 
        
        if (editor && res.data.content) {
          editor.commands.setContent(res.data.content);
        }
      } catch {
        toast.error("Note not found");
      }
    };

    fetchNote();
  }, [id, editor]);

  // SAVE
  const handleSave = async () => {
    try {
      const payload = {
        title: note.title || "Untitled",
        content: editor.getHTML(),

        // ✅ FIX 2: Send a nested object that Spring Boot Jackson can map to an Entity
        folder: selectedFolder ? { id: Number(selectedFolder) } : null,
      };

      if (id === "new") {
        const res = await createNote(payload);
        toast.success("Note created");
        navigate(`/notes/${res.data.id}`);
      } else {
        await updateNote(id, payload);
        toast.success("Note saved");
      }
    } catch {
      toast.error("Save failed");
    }
  };
  if (!editor) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-text-secondary hover:text-text-primary dark:hover:text-text-darkPrimary transition"
        >
          ← Back
        </button>

        <button
          onClick={handleSave}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl shadow hover:opacity-90 transition"
        >
          Save
        </button>
      </div>

      {/* TITLE */}
      <input
        value={note.title}
        onChange={(e) => setNote({ ...note, title: e.target.value })}
        placeholder="Untitled"
        className="text-4xl font-bold w-full mb-6 outline-none bg-transparent text-text-primary dark:text-text-darkPrimary"
      />
      {/* ✅ ADD THIS HERE */}
<div className="mb-4 flex items-center gap-3">
  <select
    value={selectedFolder || ""}
    onChange={(e) => setSelectedFolder(e.target.value)}
    className="
      px-4 py-2 rounded-xl text-sm
      bg-surface dark:bg-surface-dark
      border border-border dark:border-border-dark
      text-text-primary dark:text-text-darkPrimary
      outline-none focus:ring-2 focus:ring-indigo-400
    "
  >
    <option value="">No Folder</option>

    {folders.map((f) => (
      <option key={f.id} value={f.id}>
        {f.name}
      </option>
    ))}
  </select>

  {selectedFolder && (
    <span className="text-xs text-text-secondary">
      📁 {folders.find(f => f.id === Number(selectedFolder))?.name}
    </span>
  )}
</div>

      {/* TOOLBAR */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl px-4 py-3 shadow-sm mb-5">
        <div className="flex flex-wrap items-center justify-between gap-4">

          {/* LEFT */}
          <div className="flex flex-wrap items-center gap-4">

            {/* HISTORY */}
            <div className="flex items-center gap-2 pr-4 border-r border-border dark:border-border-dark">
              <button className="tool-btn" onClick={() => editor.chain().focus().undo().run()}>
                <Undo2 size={18} />
              </button>
              <button className="tool-btn" onClick={() => editor.chain().focus().redo().run()}>
                <Redo2 size={18} />
              </button>
            </div>

            {/* FONT */}
            <div className="flex items-center gap-2 pr-4 border-r border-border dark:border-border-dark">
              <select
                className="tool-select"
                onChange={(e) =>
                  editor.chain().focus().setFontFamily(e.target.value).run()
                }
              >
                <option>Arial</option>
                <option>Times New Roman</option>
              </select>

              <select
                className="tool-select"
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "p") editor.chain().focus().setParagraph().run();
                  else editor.chain().focus().toggleHeading({ level: Number(v) }).run();
                }}
              >
                <option value="p">Normal</option>
                <option value="1">H1</option>
                <option value="2">H2</option>
              </select>
            </div>

            {/* TEXT */}
            <div className="flex items-center gap-2 pr-4 border-r border-border dark:border-border-dark">
              <button className="tool-btn" onClick={() => editor.chain().focus().toggleBold().run()}>
                <Bold size={18} />
              </button>
              <button className="tool-btn" onClick={() => editor.chain().focus().toggleItalic().run()}>
                <Italic size={18} />
              </button>
              <button className="tool-btn" onClick={() => editor.chain().focus().toggleUnderline().run()}>
                <UnderlineIcon size={18} />
              </button>

              <input
                type="color"
                className="w-8 h-8 rounded-lg border cursor-pointer"
                onChange={(e) =>
                  editor.chain().focus().setColor(e.target.value).run()
                }
              />
            </div>

            {/* ALIGN */}
            <div className="flex items-center gap-2 pr-4 border-r border-border dark:border-border-dark">
              <button className="tool-btn" onClick={() => editor.chain().focus().setTextAlign("left").run()}>
                <AlignLeft size={18} />
              </button>
              <button className="tool-btn" onClick={() => editor.chain().focus().setTextAlign("center").run()}>
                <AlignCenter size={18} />
              </button>
              <button className="tool-btn" onClick={() => editor.chain().focus().setTextAlign("right").run()}>
                <AlignRight size={18} />
              </button>
            </div>

            {/* LIST */}
            <div className="flex items-center gap-2 pr-4 border-r border-border dark:border-border-dark">
              <button className="tool-btn" onClick={() => editor.chain().focus().toggleBulletList().run()}>
                <List size={18} />
              </button>
              <button className="tool-btn" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
                <ListOrdered size={18} />
              </button>
            </div>

            {/* INSERT */}
            <div className="flex items-center gap-2">
              <button
                className="tool-btn"
                onClick={() => {
                  const url = prompt("Enter URL");
                  if (url) editor.chain().focus().setLink({ href: url }).run();
                }}
              >
                <LinkIcon size={18} />
              </button>

              <button
                className="tool-btn"
                onClick={() => {
                  const url = prompt("Image URL");
                  if (url) editor.chain().focus().setImage({ src: url }).run();
                }}
              >
                <ImageIcon size={18} />
              </button>
            </div>
          </div>

          {/* AI BUTTON */}
          <button
            onClick={() => setAiOpen(true)}
            className="
              flex items-center gap-2 px-4 py-2 rounded-xl
              bg-gradient-to-r from-purple-500 to-indigo-500
              text-white text-sm shadow hover:opacity-90 transition
            "
          >
            ✨ AI
          </button>

        </div>
      </div>

      {/* EDITOR */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-2xl p-6 min-h-[400px] shadow focus-within:ring-2 focus-within:ring-indigo-400">
        <EditorContent editor={editor} />
      </div>

      {/* AI PANEL */}
      <AIPanel
        open={aiOpen}
        onClose={() => setAiOpen(false)}
        onAction={(type) => {
          console.log("AI Action:", type);
        }}
      />
    </div>
  );
}

export default NoteEditorPage;