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
  Loader2,
  Globe,
  Copy 
} from "lucide-react";

// 🔥 NEW: Imported generateAIContent
import { getNoteById, updateNote, createNote, uploadImage, toggleShareNote, generateAIContent } from "../services/notesService";
import { getFolders } from "../services/folderService";
import AIPanel from "../components/ai/AIPanel";

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
  
  // 🔥 AI States
  const [aiOpen, setAiOpen] = useState(false);
  const [aiResult, setAiResult] = useState("");

  const [isPublic, setIsPublic] = useState(false);
  const [shareToken, setShareToken] = useState(null);

  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [editorContent, setEditorContent] = useState("");

  const fileInputRef = useRef(null);

  const handleImageUpload = async (file) => {
    if (!file) return;
    const toastId = toast.loading("Uploading image...");
    try {
      const res = await uploadImage(file);
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
      Image.configure({ inline: true, allowBase64: true }), 
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],
    content: "",
    onUpdate: ({ editor }) => {
      setEditorContent(editor.getHTML());
    },
    editorProps: {
      handleDrop: function (view, event, slice, moved) {
        if (!moved && event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files[0]) {
          const file = event.dataTransfer.files[0];
          if (file.type.startsWith("image/")) {
            event.preventDefault(); 
            handleImageUpload(file); 
            return true;
          }
        }
        return false;
      },
    },
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

  useEffect(() => {
    if (!id || id === "new") return;

    const fetchNote = async () => {
      try {
        const res = await getNoteById(id);
        setNote({ title: res.data.title, content: res.data.content });
        setSelectedFolder(res.data.folder?.id?.toString() || ""); 
        
        setIsPublic(res.data.isPublic || false);
        setShareToken(res.data.shareToken || null);
        
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

  useEffect(() => {
    if (id === "new") return;
    const timeoutId = setTimeout(() => { handleSave(false); }, 1500);
    return () => clearTimeout(timeoutId);
  }, [note.title, editorContent, selectedFolder, handleSave, id]);

  const handleToggleShare = async () => {
    if (id === "new") {
      toast.error("Please save your note first!");
      return;
    }

    try {
      const res = await toggleShareNote(id);
      setIsPublic(res.data.isPublic);
      setShareToken(res.data.shareToken);
      
      if (res.data.isPublic) {
        const url = `${window.location.origin}/share/${res.data.shareToken}`;
        navigator.clipboard.writeText(url);
        toast.success("Published! Link copied to clipboard.");
      } else {
        toast.success("Note is now private.");
      }
    } catch (err) {
      toast.error("Failed to change sharing settings");
    }
  };

  const copyPublicLink = () => {
    if (shareToken) {
      const url = `${window.location.origin}/share/${shareToken}`;
      navigator.clipboard.writeText(url);
      toast.success("Link copied!");
    }
  };

  // ✨ NEW: AI Action Handler
  const handleAIAction = async (actionType) => {
    if (!editor) return;
    
    // Grab the highlighted text from TipTap
    const { from, to } = editor.state.selection;
    const selectedText = editor.state.doc.textBetween(from, to, '\n');

    try {
      const res = await generateAIContent(actionType, selectedText);
      setAiResult(res.data.result);
    } catch (err) {
      toast.error("Spark failed to generate a response. Is your API key set up?");
    }
  };

  // ✨ NEW: AI Insert Handler
  const handleAIInsert = () => {
    if (!editor || !aiResult) return;
    
    // Paste Spark's result right where the cursor is, formatted nicely
    editor.chain().focus().insertContent(`\n\n> **Spark's Response:**\n${aiResult}\n\n`).run();
    
    // Close the panel and clear the result
    setAiOpen(false);
    setAiResult("");
  };

  if (!editor) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <input type="file" ref={fileInputRef} onChange={(e) => handleImageUpload(e.target.files[0])} accept="image/*" className="hidden" />

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

          {id !== "new" && (
            <div className="flex items-center gap-2 bg-surface dark:bg-surface-dark border border-border dark:border-border-dark p-1 rounded-xl shadow-sm">
              <button
                onClick={handleToggleShare}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-semibold transition ${
                  isPublic 
                    ? "bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/20" 
                    : "text-text-secondary hover:bg-muted dark:hover:bg-muted-dark hover:text-text-primary"
                }`}
              >
                <Globe size={16} />
                {isPublic ? "Published" : "Publish to Web"}
              </button>
              
              {isPublic && (
                <button 
                  onClick={copyPublicLink}
                  title="Copy Link"
                  className="p-1.5 rounded-lg text-text-secondary hover:bg-muted dark:hover:bg-muted-dark hover:text-text-primary transition"
                >
                  <Copy size={16} />
                </button>
              )}
            </div>
          )}

          <button
            onClick={() => handleSave(true)}
            className="bg-accent dark:bg-accent-dark text-white dark:text-background-dark px-5 py-2 rounded-xl text-sm font-semibold shadow-sm hover:opacity-90 transition"
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
          
          <button 
            className="p-1.5 rounded text-text-secondary hover:bg-muted dark:hover:bg-muted-dark hover:text-text-primary transition-colors" 
            onClick={() => fileInputRef.current?.click()}
          >
            <ImageIcon size={18} />
          </button>
        </div>

        {/* ✨ AI BUTTON */}
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

      {/* ✨ AI PANEL MOUNTED WITH PROPS */}
      <AIPanel 
        open={aiOpen} 
        onClose={() => { setAiOpen(false); setAiResult(""); }} 
        onAction={handleAIAction} 
        result={aiResult}
        onInsert={handleAIInsert}
      />
    </div>
  );
}

export default NoteEditorPage;