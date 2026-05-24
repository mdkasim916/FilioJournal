// src/pages/JournalEditor.jsx
import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useJournal } from "../context/JournalStore";
import { useNotification } from "../context/NotificationContext";
import { MOODS, SUGGESTED_TAGS, countWords } from "../lib/constants";
import Button from "../components/ui/Button";
import { Tag, Modal } from "../components/ui";

const TOOLBAR_ACTIONS = [
  { label: "B", cmd: "bold", title: "Bold" },
  { label: "I", cmd: "italic", title: "Italic" },
  { label: "H2", cmd: "h2", title: "Heading" },
  { label: "“", cmd: "blockquote", title: "Quote" },
  { label: "—", cmd: "hr", title: "Divider" },
];

export default function JournalEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { createEntry, updateEntry, getEntryById, deleteEntry } = useJournal();
  const { showNotification } = useNotification();

  const titleRef = useRef(null);
  const editorRef = useRef(null);
  const saveTimerRef = useRef(null);

  const editingEntry = id ? getEntryById(id) : null;

  const [title, setTitle] = useState(editingEntry?.title || "");
  const [mood, setMood] = useState(editingEntry?.mood || "");
  const [tags, setTags] = useState(editingEntry?.tags || []);
  const [tagInput, setTagInput] = useState("");
  const [wordCount, setWordCount] = useState(
    editingEntry ? countWords(editingEntry.body) : 0,
  );
  const [navVisible, setNavVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [toolbar, setToolbar] = useState({ visible: false, x: 0, y: 0 });
  const isEditMode = Boolean(editingEntry);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (editingEntry && editorRef.current) {
      editorRef.current.innerText = editingEntry.body;
    }
  }, [editingEntry]);

  // Debounced Auto-save
  const autoSave = useCallback(() => {
    if (!id || !hasChanges) return;

    setSaving(true);
    const entryData = {
      title,
      body: editorRef.current?.innerText || "",
      mood,
      tags,
    };

    updateEntry(id, entryData);
    setLastSaved(new Date());
    setSaving(false);
    setHasChanges(false);
  }, [id, title, mood, tags, updateEntry, hasChanges]);

  useEffect(() => {
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    if (hasChanges && id) {
      saveTimerRef.current = setTimeout(autoSave, 3000);
    }
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [hasChanges, id, autoSave]);

  // Prevent accidental navigation
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasChanges]);

  // Auto-resize title
  useEffect(() => {
    const el = titleRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = el.scrollHeight + "px";
    }
  }, [title]);

  // Hide nav on scroll
  useEffect(() => {
    const onScroll = () => setNavVisible(window.scrollY < 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Update word count when editor content changes
  const handleEditorInput = () => {
    const text = editorRef.current?.innerText || "";
    setWordCount(countWords(text));
    setHasChanges(true);
  };

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
    setHasChanges(true);
  };

  const handleMoodChange = (m) => {
    setMood(mood === m ? "" : m);
    setHasChanges(true);
  };

  const handleTagsChange = (newTags) => {
    setTags(newTags);
    setHasChanges(true);
  };

  // Floating toolbar on selection
  const handleSelect = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setToolbar((t) => ({ ...t, visible: false }));
      return;
    }
    try {
      const range = sel.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setToolbar({
        visible: true,
        x: rect.left + rect.width / 2,
        y: rect.top - 50 + window.scrollY,
      });
    } catch {
      setToolbar((t) => ({ ...t, visible: false }));
    }
  };

  const execFormat = (cmd) => {
    if (cmd === "h2") {
      document.execCommand("formatBlock", false, "<h2>");
    } else if (cmd === "blockquote") {
      document.execCommand("formatBlock", false, "<blockquote>");
    } else if (cmd === "hr") {
      document.execCommand("insertHorizontalRule");
    } else {
      document.execCommand(cmd);
    }
    editorRef.current?.focus();
    setToolbar((t) => ({ ...t, visible: false }));
  };

  const addTag = (t) => {
    const tag = t.trim().toLowerCase();
    if (tag && !tags.includes(tag)) setTags((prev) => [...prev, tag]);
    setTagInput("");
  };

  const handleTagKey = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag(tagInput);
    }
    if (e.key === "Backspace" && !tagInput)
      setTags((prev) => prev.slice(0, -1));
  };

  const publish = async () => {
    if (!title.trim() && !(editorRef.current?.innerText || "").trim()) {
      showNotification("Please add a title or some content", "error");
      titleRef.current?.focus();
      return;
    }

    setSaving(true);

    const entryData = {
      title: title.trim() || "Untitled Entry",
      body: editorRef.current?.innerText || "",
      mood,
      tags,
    };

    try {
      if (isEditMode) {
        await updateEntry(id, entryData);
        showNotification("Entry updated successfully", "success");
      } else {
        const newEntry = await createEntry(entryData);
        showNotification("New entry published", "success");
        setHasChanges(false);
        navigate(`/journal/${newEntry.id}`, { replace: true });
        return;
      }
      setHasChanges(false);
      navigate(`/journal/${id}`);
    } catch {
      showNotification("Failed to save entry", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    try {
      await deleteEntry(id);
      showNotification("Entry deleted", "success");
      setHasChanges(false);
      navigate("/dashboard");
    } catch {
      showNotification("Failed to delete entry", "error");
    }
  };

  return (
    <div className="relative bg-[#FBF9F6] min-h-full">
      {/* ── Floating toolbar ── */}
      {toolbar.visible && (
        <div
          className="fixed z-50 flex gap-1 bg-[#1C1917] px-2 py-1.5 -translate-x-1/2 rounded shadow-xl"
          style={{ left: toolbar.x, top: toolbar.y }}
        >
          {TOOLBAR_ACTIONS.map((a) => (
            <button
              key={a.cmd}
              onMouseDown={(e) => {
                e.preventDefault();
                execFormat(a.cmd);
              }}
              title={a.title}
              className="font-sans text-[12px] text-[#FBF9F6] px-2 py-1 hover:bg-white/20 transition-colors cursor-pointer bg-transparent border-none min-w-[28px]"
            >
              {a.label}
            </button>
          ))}
        </div>
      )}

      {/* ── Nav ── */}
      <nav
        className={`flex justify-between items-center px-4 md:px-10 py-5 border-b border-[#F2EFE9] transition-opacity duration-300 bg-[#FBF9F6] sticky top-0 z-40 ${navVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex items-center gap-4">
          <button
            onClick={() => {
              if (hasChanges && !window.confirm("Disregard unsaved changes?"))
                return;
              navigate(-1);
            }}
            className="font-sans text-[14px] text-[#8A867D] hover:text-[#1C1917] transition-colors bg-transparent border-none cursor-pointer flex items-center gap-2"
          >
            <span className="text-lg">←</span>
            <span className="hidden md:inline">Back</span>
          </button>
          <div className="flex items-center gap-2">
            <div
              className={`w-2 h-2 rounded-full ${saving ? "bg-[#C29F60] animate-pulse" : lastSaved ? "bg-green-500" : "bg-transparent"}`}
            />
            <span className="font-sans text-[11px] text-[#8A867D] uppercase tracking-[1px]">
              {saving
                ? "Saving..."
                : lastSaved
                  ? `Saved ${lastSaved.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : ""}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-4 md:gap-6">
          <span className="hidden sm:inline font-sans text-[13px] text-[#8A867D]">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
          {isEditMode && (
            <button
              onClick={() => setShowDeleteModal(true)}
              className="font-sans text-[13px] text-red-600 hover:text-red-800 transition-colors bg-transparent border-none cursor-pointer"
            >
              Delete
            </button>
          )}
          <Button
            onClick={publish}
            disabled={saving}
            size="md"
            className="text-[13px] md:text-[14px] px-6"
          >
            {saving ? "Saving…" : isEditMode ? "Update" : "Publish"}
          </Button>
        </div>
      </nav>

      {/* ── Writing canvas ── */}
      <div className="max-w-[720px] mx-auto px-6 py-10 md:py-16">
        {/* Mood selector */}
        <div className="mb-12">
          <p className="font-sans text-[11px] uppercase tracking-[3px] text-[#C29F60] mb-4">
            Current Mood
          </p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => handleMoodChange(m.label)}
                className={`font-sans text-[12px] uppercase tracking-[1px] px-4 py-2 border transition-all duration-200 cursor-pointer ${
                  mood === m.label
                    ? "bg-[#1A3626] text-[#FBF9F6] border-[#1A3626] shadow-md"
                    : "bg-transparent text-[#8A867D] border-[#E5E2DC] hover:border-[#1C1917] hover:text-[#1C1917]"
                }`}
              >
                <span className="mr-2">{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <textarea
          ref={titleRef}
          value={title}
          onChange={handleTitleChange}
          placeholder="Give this moment a name..."
          rows={1}
          className="w-full bg-transparent border-none outline-none resize-none overflow-hidden text-[#1C1917] placeholder-[#C8C5BF] mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "clamp(32px, 8vw, 52px)",
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        />

        <hr className="border-t border-[#E5E2DC] mb-8" />

        {/* Rich editor */}
        <style>{`
          [contenteditable]:empty:before { content: attr(data-placeholder); color: #C8C5BF; pointer-events: none; }
          [contenteditable] h2 { font-family: 'Playfair Display', serif; font-size: 1.5em; font-weight: 700; margin: 1.5em 0 0.5em; color: #1C1917; }
          [contenteditable] blockquote { border-left: 3px solid #C29F60; padding-left: 20px; margin: 1.5em 0; color: #8A867D; font-style: italic; }
          [contenteditable] hr { border: none; border-top: 1px solid #1C1917; margin: 2em 0; }
          [contenteditable] p { margin-bottom: 1em; }
          [contenteditable]:focus { outline: none; }
        `}</style>
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          data-placeholder="Begin writing…"
          onInput={handleEditorInput}
          onMouseUp={handleSelect}
          onKeyUp={handleSelect}
          className="min-h-[400px] text-[#1C1917]"
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "clamp(16px, 4vw, 18px)",
            lineHeight: 1.85,
          }}
        />

        {/* Tags */}
        <div className="mt-10 pt-8 border-t border-[#F2EFE9] mb-20">
          <p className="font-sans text-[11px] uppercase tracking-[2px] text-[#8A867D] mb-3">
            Tags
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((t) => (
              <Tag
                key={t}
                onRemove={() => handleTagsChange(tags.filter((x) => x !== t))}
              >
                #{t}
              </Tag>
            ))}
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagKey}
              onBlur={() => tagInput && addTag(tagInput)}
              placeholder="Add tag…"
              className="font-sans text-[13px] text-[#1C1917] placeholder-[#8A867D] bg-transparent border-none outline-none min-w-[100px] h-7"
            />
          </div>
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A867D] mr-1">
              Suggest:
            </span>
            {SUGGESTED_TAGS.filter((t) => !tags.includes(t))
              .slice(0, 8)
              .map((t) => (
                <button
                  key={t}
                  onClick={() => addTag(t)}
                  className="font-sans text-[11px] text-[#8A867D] hover:text-[#1A3626] bg-transparent border-none cursor-pointer"
                >
                  +{t}
                </button>
              ))}
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Entry"
        footer={
          <>
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              className="bg-red-600 text-white hover:bg-red-700"
              onClick={handleDelete}
            >
              Delete Entry
            </Button>
          </>
        }
      >
        <p className="text-[15px] text-[#8A867D] leading-relaxed">
          Are you sure you want to delete this entry? This action cannot be
          undone.
        </p>
      </Modal>
    </div>
  );
}
