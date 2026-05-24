// src/pages/Dashboard.jsx
import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { formatDate } from "../lib/constants";
import { MoodBadge, Tag, SectionLabel } from "../components/ui";
import Button from "../components/ui/Button";
import { useJournal } from "../context/JournalStore";
import { calculateStreak } from "../lib/journalData";

const PROMPTS = [
  "What am I not saying out loud?",
  "Describe this week in three objects.",
  "What would I tell myself a year from now?",
  "What did I let slide today, and why?",
  "What small thing deserves more gratitude?",
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { profile, entries, dailyGoal } = useJournal();
  const [search, setSearch] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [page, setPage] = useState(1);

  const wordsToday = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return entries
      .filter((e) => e.createdAt.startsWith(today))
      .reduce(
        (acc, curr) => acc + (curr.body ? curr.body.split(/\s+/).length : 0),
        0,
      );
  }, [entries]);

  const goalProgress = Math.min(
    100,
    Math.round((wordsToday / dailyGoal) * 100),
  );

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const moods = [
    "All",
    "Reflective",
    "Hopeful",
    "Melancholic",
    "Grateful",
    "Energised",
  ];
  const promptOfDay = PROMPTS[new Date().getDay() % PROMPTS.length];

  const filtered = useMemo(() => {
    return entries.filter((e) => {
      const matchesMood =
        activeFilter === "All" ||
        e.mood.toLowerCase() === activeFilter.toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch =
        !q ||
        e.title.toLowerCase().includes(q) ||
        e.body.toLowerCase().includes(q) ||
        e.tags.some((t) => t.toLowerCase().includes(q));
      return matchesMood && matchesSearch;
    });
  }, [entries, activeFilter, search]);

  const pinned = filtered.filter((e) => e.pinned);
  const recent = filtered.filter((e) => !e.pinned);

  // Dashboard pagination: show max 4 entries per page
  const PAGE_SIZE = 4;
  const totalPages = Math.max(1, Math.ceil(recent.length / PAGE_SIZE));
  const visibleRecent = recent.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Real Stats
  const streak = calculateStreak(entries);

  const weeklyMoods = useMemo(() => {
    const last7Days = new Date();
    last7Days.setDate(last7Days.getDate() - 7);

    const moodCounts = entries
      .filter((e) => new Date(e.createdAt) > last7Days)
      .reduce((acc, curr) => {
        acc[curr.mood] = (acc[curr.mood] || 0) + 1;
        return acc;
      }, {});

    return Object.entries(moodCounts)
      .map(([mood, count]) => ({ mood, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);
  }, [entries]);

  const topTags = useMemo(() => {
    const tags = entries.flatMap((e) => e.tags);
    const counts = tags.reduce((acc, t) => {
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(counts)
      .sort((a, b) => counts[b] - counts[a])
      .slice(0, 7);
  }, [entries]);

  const weekActivity = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const hasEntry = entries.some((e) => e.createdAt.startsWith(dayStr));
      days.push(hasEntry);
    }
    return days;
  }, [entries]);

  return (
    <div className="flex flex-col xl:flex-row min-h-full">
      {/* ── Main feed ── */}
      <div className="flex-1 px-6 md:px-12 py-10 min-w-0">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start gap-6 border-b border-[#1C1917] pb-8 mb-10">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[3px] text-[#8A867D] mb-1">
              {new Date().toLocaleDateString("en-GB", {
                weekday: "long",
                day: "numeric",
                month: "long",
              })}
            </p>
            <h1 className="font-serif text-[32px] md:text-[40px] font-bold text-[#1C1917] leading-tight">
              {getGreeting()}, {profile.name.split(" ")[0]}.
            </h1>
          </div>
          <Link to="/journal/new" className="w-full sm:w-auto">
            <Button size="lg" className="w-full sm:w-auto">
              New Entry
            </Button>
          </Link>
        </div>

        {/* Prompt of the day */}
        <div className="mb-10 p-6 bg-[#F2EFE9] border-l-4 border-l-[#C29F60] border-t border-r border-b border-[#F2EFE9]">
          <p className="font-sans text-[11px] uppercase tracking-[2px] text-[#C29F60] mb-2">
            Today's prompt
          </p>
          <p className="font-serif text-[20px] md:text-[22px] italic text-[#1C1917]">
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
        <div className="flex flex-col lg:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search entries, tags, moods…"
              className="w-full h-10 pl-10 pr-4 bg-[#F2EFE9] border border-transparent focus:border-[#1A3626] outline-none font-sans text-[14px] text-[#1C1917] placeholder-[#8A867D] transition-colors"
            />
            <SearchIcon />
          </div>
          <div className="flex gap-1 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
            {moods.map((m) => (
              <button
                key={m}
                onClick={() => setActiveFilter(m)}
                className={`whitespace-nowrap font-sans text-[11px] uppercase tracking-[1px] px-3 py-2 border transition-all cursor-pointer ${
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
            <div className="grid grid-cols-1 gap-4">
              {pinned.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}
            </div>
          </div>
        )}

        {/* Recent */}
        <div>
          <SectionLabel>Recent Entries</SectionLabel>
          {recent.length === 0 ? (
            <div className="py-20 text-center border border-[#1C1917]/10 bg-[#F2EFE9]/20">
              <div className="max-w-xs mx-auto">
                <p className="font-serif text-[24px] font-bold text-[#1C1917] mb-3">
                  {search ? "No matches found" : "Your story starts here"}
                </p>
                <p className="text-[14px] text-[#8A867D] mb-8 leading-relaxed">
                  {search
                    ? `We couldn't find any entries matching "${search}". Try a different term.`
                    : "You haven't written any entries yet. Capture your first thought today."}
                </p>
                {search ? (
                  <Button variant="outline" onClick={() => setSearch("")}>
                    Clear Search
                  </Button>
                ) : (
                  <Link to="/journal/new">
                    <Button>Write Your First Entry</Button>
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {visibleRecent.map((entry) => (
                <EntryCard key={entry.id} entry={entry} />
              ))}

              {totalPages > 1 && (
                <div className="flex items-center justify-between gap-3 mt-6 pb-10">
                  <Button
                    variant="outline"
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                  >
                    Previous
                  </Button>
                  <div className="text-sm text-[#8A867D] font-sans">
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
            </div>
          )}
        </div>
      </div>

      {/* ── Right sidebar (Now stacked or shown on large screens) ── */}
      <aside className="w-full xl:w-[320px] shrink-0 xl:border-l border-[#1C1917] px-6 md:px-8 py-10 flex flex-col md:flex-row xl:flex-col gap-10 md:flex-wrap xl:flex-nowrap bg-[#F2EFE9]/30">
        {/* Daily Goal */}
        <div className="flex-1 min-w-[200px]">
          <SectionLabel>Today's Word Goal</SectionLabel>
          <div className="flex items-end justify-between mb-2">
            <span className="font-serif text-[32px] font-bold text-[#1A3626] leading-none">
              {goalProgress}%
            </span>
            <span className="font-sans text-[12px] text-[#8A867D]">
              {wordsToday} / {dailyGoal} words
            </span>
          </div>
          <div className="w-full h-2 bg-[#E5E2DC] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C29F60] transition-all duration-1000"
              style={{ width: `${goalProgress}%` }}
            />
          </div>
          <p className="font-sans text-[11px] text-[#8A867D] mt-3 uppercase tracking-[1px]">
            {goalProgress >= 100
              ? "Goal achieved!"
              : `${dailyGoal - wordsToday} words to go`}
          </p>
        </div>

        <hr className="hidden xl:block border-t border-[#1C1917]/10" />

        {/* Streak */}
        <div className="flex-1 min-w-[200px]">
          <SectionLabel>Writing streak</SectionLabel>
          <div className="flex items-end gap-2">
            <span className="font-serif text-[56px] font-bold text-[#1A3626] leading-none">
              {streak}
            </span>
            <span className="font-sans text-[13px] text-[#8A867D] mb-2">
              day{streak === 1 ? "" : "s"}
            </span>
          </div>
          <div className="flex gap-1 mt-3 max-w-[200px]">
            {weekActivity.map((hasEntry, i) => (
              <div
                key={i}
                className={`h-2 flex-1 ${hasEntry ? "bg-[#1A3626]" : "bg-[#F2EFE9]"}`}
              />
            ))}
          </div>
          <p className="font-sans text-[11px] text-[#8A867D] mt-2 uppercase tracking-[1px]">
            {weekActivity.filter(Boolean).length} of 7 days this week
          </p>
        </div>

        <hr className="hidden xl:block border-t border-[#1C1917]/10" />

        {/* Mood this week */}
        <div className="flex-1 min-w-[200px]">
          <SectionLabel>Moods this week</SectionLabel>
          <div className="flex flex-col gap-2">
            {weeklyMoods.length > 0 ? (
              weeklyMoods.map(({ mood, count }) => (
                <div key={mood} className="flex items-center justify-between">
                  <MoodBadge mood={mood} />
                  <span className="font-sans text-[12px] text-[#8A867D]">
                    ×{count}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-[12px] text-[#8A867D] italic">
                No entries this week
              </p>
            )}
          </div>
        </div>

        <hr className="hidden xl:block border-t border-[#1C1917]/10" />

        {/* Tags cloud */}
        <div className="flex-1 min-w-[200px]">
          <SectionLabel>Your tags</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {topTags.length > 0 ? (
              topTags.map((t) => <Tag key={t}>{t}</Tag>)
            ) : (
              <p className="text-[12px] text-[#8A867D] italic">
                Add tags to your entries
              </p>
            )}
          </div>
        </div>

        <hr className="hidden xl:block border-t border-[#1C1917]/10" />

        {/* Quick links */}
        <div className="flex-1 min-w-[200px]">
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
      <div className="group border border-[#F2EFE9] hover:border-[#1C1917] hover:bg-[#1A3626] p-4 md:p-6 mb-1 transition-all duration-200">
        <div className="flex justify-between items-start mb-3">
          <p className="font-sans text-[11px] uppercase tracking-[1.5px] text-[#8A867D] group-hover:text-[#FBF9F6]/60">
            {formatDate(entry.createdAt)}
          </p>
          <MoodBadge mood={entry.mood} />
        </div>
        <h3 className="font-serif text-[20px] md:text-[22px] font-bold text-[#1C1917] group-hover:text-[#FBF9F6] mb-2 leading-snug">
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
            {entry.body ? entry.body.split(/\s+/).length : 0} words
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
