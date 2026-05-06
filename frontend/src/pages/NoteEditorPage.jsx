import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
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

import { getNoteById, updateNote, createNote, uploadImage } from "../services/notesService";
import { getFolders } from "../services/folderService";
import AIPanel from "../components/ai/AIPanel";

// Tiptap imports
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

  // 🔥 Reference for our hidden file picker
  const fileInputRef = useRef(null);

  // 🔥 Function to handle the actual uploading
  const handleImageUpload = async (file) => {
    if (!file) return;
    const toastId = toast.loading("Uploading image...");
    try {
      const res = await uploadImage(file);
      // Insert the returned URL into the editor
      editor.chain().focus().setImage({ src: res.url || res.data.url }).run();
      toast.success("Image added!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload image", { id: toastId });
    }
  };

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextStyle,
      Color,
      FontFamily,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: true, allowBase64: true }), // 🔥 Make sure Image is configured properly
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
    // 🔥 ADD THIS TO CATCH DRAG AND DROP
    editorProps: {
      handleDrop: function (view, event, slice, moved) {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault(); // Stop the browser from opening the image in a new tab
            handleImageUpload(file); // Upload it!
            return true;
          }
        }
        return false;
      },
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

  // SAVE FUNCTION
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
        if (isManual) {
          const res = await createNote(payload);
          toast.success("Note created");
          navigate(`/notes/${res.data.id}`, { replace: true });
        }
      } else {
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

  // AUTO-SAVE (DEBOUNCING)
  useEffect(() => {
    if (id === "new") return;

    const timeoutId = setTimeout(() => {
      handleSave(false);
    }, 1500);

    return () => clearTimeout(timeoutId);
  }, [note.title, editorContent, selectedFolder, handleSave, id]);

  if (!editor) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">

      {/* 🔥 HIDDEN FILE INPUT */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={(e) => handleImageUpload(e.target.files[0])} 
        accept="image/*" 
        className="hidden" 
      />

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <button
          onClick={() => navigate("/dashboard")}
          className="text-text-secondary hover:text-text-primary dark:hover:text-text-darkPrimary transition text-sm font-medium flex items-center gap-2"
        >
          ← Back to Dashboard
        </button>

        <div className="flex items-center gap-4">
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

      {/* FULL STATIC TOOLBAR */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-t-2xl px-4 py-3 border-b flex flex-wrap items-center gap-4">
        
        {/* HISTORY */}
        <div className="flex items-center gap-1 pr-4 border-r border-border/50 dark:border-border-dark/50">
          <button className="p-1.5 rounded hover:bg-muted dark:hover:bg-muted-dark text-text-secondary transition-colors" onClick={() => editor.chain().focus().undo().run()}><Undo2 size={18} /></button>
          <button className="p-1.5 rounded hover:bg-muted dark:hover:bg-muted-dark text-text-secondary transition-colors" onClick={() => editor.chain().focus().redo().run()}><Redo2 size={18} /></button>
        </div>

        {/* FONT & HEADINGS */}
        <div className="flex items-center gap-2 pr-4 border-r border-border/50 dark:border-border-dark/50">
          <select
            className="bg-transparent text-sm font-medium text-text-secondary outline-none cursor-pointer hover:text-text-primary dark:hover:text-text-darkPrimary transition-colors"
            onChange={(e) => editor.chain().focus().setFontFamily(e.target.value).run()}
          >
            <option>Arial</option>
            <option>Times New Roman</option>
          </select>

          <select
            className="bg-transparent text-sm font-medium text-text-secondary outline-none cursor-pointer hover:text-text-primary dark:hover:text-text-darkPrimary transition-colors"
            onChange={(e) => {
              const v = e.target.value;
              if (v === "p") editor.chain().focus().setParagraph().run();
              else editor.chain().focus().toggleHeading({ level: Number(v) }).run();
            }}
          >
            <option value="p">Normal</option>
            <option value="1">Heading 1</option>
            <option value="2">Heading 2</option>
          </select>
        </div>

        {/* TEXT FORMATTING & COLOR */}
        <div className="flex items-center gap-1 pr-4 border-r border-border/50 dark:border-border-dark/50">
          <button className={`p-1.5 rounded transition-colors ${editor.isActive('bold') ? 'text-text-primary dark:text-text-darkPrimary bg-muted dark:bg-muted-dark' : 'text-text-secondary hover:bg-muted dark:hover:bg-muted-dark'}`} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={18} /></button>
          <button className={`p-1.5 rounded transition-colors ${editor.isActive('italic') ? 'text-text-primary dark:text-text-darkPrimary bg-muted dark:bg-muted-dark' : 'text-text-secondary hover:bg-muted dark:hover:bg-muted-dark'}`} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={18} /></button>
          <button className={`p-1.5 rounded transition-colors ${editor.isActive('underline') ? 'text-text-primary dark:text-text-darkPrimary bg-muted dark:bg-muted-dark' : 'text-text-secondary hover:bg-muted dark:hover:bg-muted-dark'}`} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={18} /></button>
          
          <div className="relative flex items-center ml-1">
            <input
              type="color"
              className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
              onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
              title="Text Color"
            />
          </div>
        </div>

        {/* ALIGNMENT */}
        <div className="flex items-center gap-1 pr-4 border-r border-border/50 dark:border-border-dark/50">
          <button className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'text-text-primary dark:text-text-darkPrimary bg-muted dark:bg-muted-dark' : 'text-text-secondary hover:bg-muted dark:hover:bg-muted-dark'}`} onClick={() => editor.chain().focus().setTextAlign('left').run()}><AlignLeft size={18} /></button>
          <button className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'text-text-primary dark:text-text-darkPrimary bg-muted dark:bg-muted-dark' : 'text-text-secondary hover:bg-muted dark:hover:bg-muted-dark'}`} onClick={() => editor.chain().focus().setTextAlign('center').run()}><AlignCenter size={18} /></button>
          <button className={`p-1.5 rounded transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'text-text-primary dark:text-text-darkPrimary bg-muted dark:bg-muted-dark' : 'text-text-secondary hover:bg-muted dark:hover:bg-muted-dark'}`} onClick={() => editor.chain().focus().setTextAlign('right').run()}><AlignRight size={18} /></button>
        </div>

        {/* LISTS & MEDIA */}
        <div className="flex items-center gap-1">
          <button className={`p-1.5 rounded transition-colors ${editor.isActive('bulletList') ? 'text-text-primary dark:text-text-darkPrimary bg-muted dark:bg-muted-dark' : 'text-text-secondary hover:bg-muted dark:hover:bg-muted-dark'}`} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={18} /></button>
          <button className={`p-1.5 rounded transition-colors ${editor.isActive('orderedList') ? 'text-text-primary dark:text-text-darkPrimary bg-muted dark:bg-muted-dark' : 'text-text-secondary hover:bg-muted dark:hover:bg-muted-dark'}`} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={18} /></button>
          
          <div className="w-px h-5 bg-border/50 dark:bg-border-dark/50 mx-1"></div>

          <button className="p-1.5 rounded text-text-secondary hover:bg-muted dark:hover:bg-muted-dark hover:text-text-primary transition-colors" onClick={() => { const url = prompt("Enter URL"); if (url) editor.chain().focus().setLink({ href: url }).run(); }}><LinkIcon size={18} /></button>
          
          {/* 🔥 MODIFIED IMAGE BUTTON TO TRIGGER FILE PICKER */}
          <button 
            className="p-1.5 rounded text-text-secondary hover:bg-muted dark:hover:bg-muted-dark hover:text-text-primary transition-colors" 
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={18} />
          </button>
        </div>

        {/* AI BUTTON */}
        <button onClick={() => setAiOpen(true)} className="ml-auto flex items-center gap-2 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white text-sm font-medium shadow-sm hover:shadow hover:opacity-90 transition-all">
          ✨ AI Assist
        </button>
      </div>

      {/* EDITOR CONTAINER */}
      <div className="bg-surface dark:bg-surface-dark border border-border dark:border-border-dark rounded-b-2xl border-t-0 min-h-[500px] shadow-sm pb-10">
        <EditorContent 
          editor={editor} 
          className="
            prose prose-zinc dark:prose-invert max-w-none p-8 outline-none 
            prose-img:rounded-xl prose-img:shadow-md prose-img:max-w-full prose-img:max-h-[500px] prose-img:mx-auto prose-img:object-contain
          " 
        />
      </div>

      <AIPanel open={aiOpen} onClose={() => setAiOpen(false)} onAction={(type) => console.log("AI Action:", type)} />
    </div>
  );
}

export default NoteEditorPage;