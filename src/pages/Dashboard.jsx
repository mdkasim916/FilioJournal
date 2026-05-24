// src/pages/Dashboard.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { SAMPLE_ENTRIES, formatDate } from "../lib/constants";
import { MoodBadge, Tag, SectionLabel } from "../components/ui";
import Button from "../components/ui/Button";

const PROMPTS = [
  "What am I not saying out loud?",
  "Describe this week in three objects.",
  "What would I tell myself a year from now?",
  "What did I let slide today, and why?",
  "What small thing deserves more gratitude?",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  const moods = [
    "All",
    "Reflective",
    "Hopeful",
    "Melancholic",
    "Grateful",
    "Energised",
  ];
  const promptOfDay = PROMPTS[new Date().getDay() % PROMPTS.length];

  const filtered = SAMPLE_ENTRIES.filter((e) => {
    const matchesMood = activeFilter === "All" || e.mood === activeFilter;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      e.title.toLowerCase().includes(q) ||
      e.body.toLowerCase().includes(q) ||
      e.tags.some((t) => t.includes(q));
    return matchesMood && matchesSearch;
  });

  const pinned = filtered.filter((e) => e.pinned);
  const recent = filtered.filter((e) => !e.pinned);

  // Dashboard pagination: show max 4 entries per page
  const PAGE_SIZE = 4;
  const totalPages = Math.max(1, Math.ceil(recent.length / PAGE_SIZE));
  const visibleRecent = recent.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="flex min-h-full">
      {/* ── Main feed ── */}
      <div className="flex-1 px-12 py-10 min-w-0">
        {/* Header */}
        <div className="flex justify-between items-start border-b border-[#1C1917] pb-8 mb-10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[3px] text-[#8A867D] mb-1">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="font-serif text-[40px] font-bold text-[#1C1917] leading-tight">
              Good morning, Alex.
            </h1>
          </div>
          <Link to="/journal/new">
            <Button size="lg">New Entry</Button>
          </Link>
        </div>

        {/* Prompt of the day */}
        <div className="mb-10 p-6 bg-[#F2EFE9] border-l-4 border-l-[#C29F60] border-t border-r border-b border-[#F2EFE9]">
          <p className="font-sans text-[11px] uppercase tracking-[2px] text-[#C29F60] mb-2">
            Today's prompt
          </p>
          <p className="font-serif text-[22px] italic text-[#1C1917]">
            "{promptOfDay}"
          </p>
          <button
            onClick={() => navigate("/journal/new")}
            className="font-sans text-[13px] text-[#1A3626] mt-3 bg-transparent border-none cursor-pointer hover:underline"
          >
            Write to this prompt →
          </button>
        </div>

        {/* Search + filter */}
        <div className="flex gap-4 mb-6 flex-wrap">
          <div className="relative flex-1 min-w-[200px]">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries, tags, moods…"
              className="w-full h-10 pl-10 pr-4 bg-[#F2EFE9] border border-transparent focus:border-[#1A3626] outline-none font-sans text-[14px] text-[#1C1917] placeholder-[#8A867D] transition-colors"
            />
            <SearchIcon />
          </div>
          <div className="flex gap-1 flex-wrap">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setActiveFilter(m)}
                className={`font-sans text-[11px] uppercase tracking-[1px] px-3 py-2 border transition-all cursor-pointer ${
                  activeFilter === m
                    ? "bg-[#1A3626] text-[#FBF9F6] border-[#1A3626]"
                    : "bg-transparent text-[#8A867D] border-[#F2EFE9] hover:border-[#8A867D]"
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        {/* Pinned */}
        {pinned.length > 0 && (
          <div className="mb-8">
            <SectionLabel>Pinned</SectionLabel>
            {pinned.map((entry) => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </div>
        )}

        {/* Recent */}
        <div>
          <SectionLabel>Recent Entries</SectionLabel>
          {recent.length === 0 ? (
            <div className="py-16 text-center border border-[#F2EFE9]">
              <p className="font-serif text-[20px] italic text-[#8A867D]">
                No entries match your search.
              </p>
            </div>
          ) : (
            <>
              {visibleRecent.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}

              {totalPages > 1 && (
                <div className="flex items-center gap-3 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-[#8A867D]">
                    Page {page} of {totalPages}
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* ── Right sidebar ── */}
      <aside className="w-[280px] shrink-0 border-l border-[#1C1917] px-8 py-10 flex flex-col gap-10">
        {/* Streak */}
        <div>
          <SectionLabel>Writing streak</SectionLabel>
          <div className="flex items-end gap-2">
            <span className="font-serif text-[56px] font-bold text-[#1A3626] leading-none">
              7
            </span>
            <span className="font-sans text-[13px] text-[#8A867D] mb-2">
              days
            </span>
          </div>
          <div className="flex gap-1 mt-3">
            {Array.from({ length: 7 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 ${i < 5 ? "bg-[#1A3626]" : i === 5 ? "bg-[#C29F60]" : "bg-[#F2EFE9]"}`}
              />
            ))}
          </div>
          <p className="font-sans text-[11px] text-[#8A867D] mt-2 uppercase tracking-[1px]">
            5 of 7 days this week
          </p>
        </div>

        <hr className="border-t border-[#F2EFE9]" />

        {/* Mood this week */}
        <div>
          <SectionLabel>Moods this week</SectionLabel>
          <div className="flex flex-col gap-2">
            {[
              { mood: "Reflective", count: 3 },
              { mood: "Grateful", count: 2 },
              { mood: "Hopeful", count: 1 },
            ].map(({ mood, count }) => (
              <div key={mood} className="flex items-center justify-between">
                <MoodBadge mood={mood} />
                <span className="font-sans text-[12px] text-[#8A867D]">
                  ×{count}
                </span>
              </div>
            ))}
          </div>
        </div>

        <hr className="border-t border-[#F2EFE9]" />

        {/* Tags cloud */}
        <div>
          <SectionLabel>Your tags</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {[
              "morning",
              "nature",
              "gratitude",
              "growth",
              "books",
              "relationships",
              "travel",
            ].map((t) => (
              <Tag key={t}>{t}</Tag>
            ))}
          </div>
        </div>

        <hr className="border-t border-[#F2EFE9]" />

        {/* Quick links */}
        <div>
          <SectionLabel>Quick links</SectionLabel>
          <div className="flex flex-col gap-2">
            {[
              { label: "View Calendar", path: "/calendar" },
              { label: "See Analytics", path: "/analytics" },
              { label: "Export Archive", path: "/settings" },
            ].map((l) => (
              <Link
                key={l.path}
                to={l.path}
                className="font-sans text-[13px] text-[#8A867D] hover:text-[#1A3626] transition-colors uppercase tracking-[1px]"
              >
                {l.label} →
              </Link>
            ))}
          </div>
        </div>
      </aside>
    </div>
  );
}

function EntryCard({ entry }) {
  return (
    <Link to={`/journal/${entry.id}`} className="block">
      <div className="group border border-[#F2EFE9] hover:border-[#1C1917] hover:bg-[#1A3626] p-6 mb-2 transition-all duration-200">
        <div className="flex justify-between items-start mb-3">
          <p className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A867D] group-hover:text-[#FBF9F6]/60">
            {formatDate(entry.date)}
          </p>
          <MoodBadge mood={entry.mood} />
        </div>
        <h3 className="font-serif text-[22px] font-bold text-[#1C1917] group-hover:text-[#FBF9F6] mb-2 leading-snug">
          {entry.title}
        </h3>
        <p className="font-sans text-[14px] text-[#8A867D] group-hover:text-[#FBF9F6]/70 leading-[1.6] line-clamp-2">
          {entry.body.split("\n")[0]}
        </p>
        <div className="flex items-center gap-3 mt-4 flex-wrap">
          {entry.tags.map((t) => (
            <span
              key={t}
              className="font-sans text-[11px] uppercase tracking-[1px] text-[#8A867D] group-hover:text-[#FBF9F6]/60"
            >
              #{t}
            </span>
          ))}
          <span className="font-sans text-[11px] text-[#8A867D] group-hover:text-[#FBF9F6]/60 ml-auto">
            {entry.words} words
          </span>
        </div>
      </div>
    </Link>
  );
}

function SearchIcon() {
  return (
    <svg
      className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A867D]"
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}
