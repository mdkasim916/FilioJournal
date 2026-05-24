// src/pages/CreateJournal.jsx
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useJournal } from "../context/JournalStore";
import { MOODS, SUGGESTED_TAGS, countWords } from "../lib/constants";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { Tag } from "../components/ui";

const TOOLBAR_ACTIONS = [
  { label: "B", cmd: "bold", title: "Bold" },
  { label: "I", cmd: "italic", title: "Italic" },
  { label: "H2", cmd: "h2", title: "Heading" },
  { label: "", cmd: "blockquote", title: "Quote" },
  { label: "—", cmd: "hr", title: "Divider" },
];

export default function CreateJournal() {
  const navigate = useNavigate();
  const { createEntry } = useJournal();
  const titleRef = useRef(null);
  const editorRef = useRef(null);

  const [title, setTitle] = useState("");
  const [mood, setMood] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [wordCount, setWordCount] = useState(0);
  const [navVisible, setNavVisible] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [toolbar, setToolbar] = useState({ visible: false, x: 0, y: 0 });

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
    setSaved(false);
    // Auto-save after 1s idle
    clearTimeout(window._saveTimer);
    window._saveTimer = setTimeout(() => {
      setSaved(true);
    }, 1000);
  };

  // Floating toolbar on selection
  const handleSelect = () => {
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed) {
      setToolbar((t) => ({ ...t, visible: false }));
      return;
    }
    const range = sel.getRangeAt(0);
    const rect = range.getBoundingClientRect();
    setToolbar({
      visible: true,
      x: rect.left + rect.width / 2,
      y: rect.top - 50 + window.scrollY,
    });
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
    if (!title.trim()) {
      titleRef.current?.focus();
      return;
    }

    setSaving(true);

    await createEntry({
      title,
      body: editorRef.current?.innerText || "",
      mood,
      tags,
    });

    setSaving(false);
    navigate("/dashboard");
  };

  return (
    <div className="min-h-full relative">
      {/* ── Floating toolbar ── */}
      {toolbar.visible && (
        <div
          className="fixed z-50 flex gap-1 bg-[#1C1917] px-2 py-1.5 -translate-x-1/2"
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
        className={`flex justify-between items-center px-10 py-5 border-b border-[#F2EFE9] transition-opacity duration-300 bg-[#FBF9F6] sticky top-0 z-40 ${navVisible ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <div className="flex items-center gap-4">
          <span
            className={`font-sans text-[12px] transition-all ${saved ? "text-[#C29F60]" : "text-transparent"}`}
          >
            Saved to Cloud
          </span>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-sans text-[13px] text-[#8A867D]">
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
          <Button onClick={publish} disabled={saving} size="md">
            {saving ? "Publishing…" : "Publish to Archive"}
          </Button>
        </div>
      </nav>

      {/* ── Writing canvas ── */}
      <div className="max-w-[720px] mx-auto px-6 py-16">
        {/* Mood selector */}
        <div className="mb-8">
          <p className="font-sans text-[11px] uppercase tracking-[2px] text-[#8A867D] mb-3">
            How are you feeling?
          </p>
          <div className="flex flex-wrap gap-2">
            {MOODS.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(mood === m.label ? "" : m.label)}
                className={`font-sans text-[12px] uppercase tracking-[1px] px-3 py-1.5 border transition-all duration-150 cursor-pointer ${
                  mood === m.label
                    ? "bg-[#1A3626] text-[#FBF9F6] border-[#1A3626]"
                    : "bg-transparent text-[#8A867D] border-[#8A867D] hover:border-[#1C1917] hover:text-[#1C1917]"
                }`}
              >
                <span className="mr-1.5">{m.emoji}</span>
                {m.label}
              </button>
            ))}
          </div>
        </div>

        {/* Title */}
        <textarea
          ref={titleRef}
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title…"
          rows={1}
          className="w-full bg-transparent border-none outline-none resize-none overflow-hidden text-[#1C1917] placeholder-[#C8C5BF] mb-2"
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: "52px",
            fontWeight: 700,
            lineHeight: 1.15,
          }}
        />

        <hr className="border-t border-[#E5E2DC] mb-8" />

        {/* Rich editor */}
        <style>{`
          [contenteditable]:empty:before { content: attr(data-placeholder); color: #C8C5BF; pointer-events: none; }
          [contenteditable] h2 { font-family: 'Playfair Display', serif; font-size: 28px; font-weight: 700; margin: 1.5em 0 0.5em; color: #1C1917; }
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
            fontSize: "18px",
            lineHeight: 1.85,
          }}
        />

        {/* Tags */}
        <div className="mt-10 pt-8 border-t border-[#F2EFE9]">
          <p className="font-sans text-[11px] uppercase tracking-[2px] text-[#8A867D] mb-3">
            Tags
          </p>
          <div className="flex flex-wrap gap-2 mb-3">
            {tags.map((t) => (
              <Tag
                key={t}
                onRemove={() => setTags((prev) => prev.filter((x) => x !== t))}
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
    </div>
  );
}
