// ─── Design Tokens ────────────────────────────────────────────────────────────
export const colors = {
  green:   "#1A3626",
  bg:      "#FBF9F6",
  surface: "#F2EFE9",
  text:    "#1C1917",
  muted:   "#8A867D",
  brass:   "#C29F60",
};

// ─── Mood options ─────────────────────────────────────────────────────────────
export const MOODS = [
  { label: "Reflective", emoji: "🌊", color: "bg-blue-50   text-blue-700   border-blue-200" },
  { label: "Hopeful",    emoji: "🌱", color: "bg-green-50  text-green-700  border-green-200" },
  { label: "Melancholic",emoji: "🌧️", color: "bg-slate-50  text-slate-600  border-slate-200" },
  { label: "Energised",  emoji: "⚡", color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  { label: "Grateful",   emoji: "✨", color: "bg-purple-50 text-purple-700 border-purple-200" },
  { label: "Restless",   emoji: "🌪️", color: "bg-orange-50 text-orange-700 border-orange-200" },
  { label: "Content",    emoji: "☀️", color: "bg-amber-50  text-amber-700  border-amber-200" },
  { label: "Anxious",    emoji: "🌀", color: "bg-red-50    text-red-700    border-red-200" },
];

// ─── Tag suggestions ──────────────────────────────────────────────────────────
export const SUGGESTED_TAGS = [
  "morning", "evening", "gratitude", "growth", "travel",
  "creativity", "work", "relationships", "health", "goals",
  "memories", "dreams", "nature", "books", "ideas",
];

// ─── Sample entries (shared across pages) ─────────────────────────────────────
export const SAMPLE_ENTRIES = [
  {
    id: "1",
    title: "On the Stillness Before Dawn",
    body: "There is a particular quality to the silence at 5 in the morning that I have been thinking about all week. It is not the absence of sound — it is the presence of something deeper, a held breath the world takes before committing to another day.\n\nI have been waking at this hour not by alarm but by some internal insistence, as though my mind refuses to miss the moment. The light comes in slowly, almost apologetically, as if it knows it is interrupting something.",
    date: "2026-05-21",
    mood: "Reflective",
    tags: ["morning", "nature"],
    words: 148,
    pinned: true,
  },
  {
    id: "2",
    title: "Three Things I Forgot to Notice",
    body: "The smell of old books in the library on Cavendish Street. I walked past it three times this week before actually going in. Why do I keep deferring small pleasures?\n\nThe way my neighbour's cat sits in the exact same patch of sun every afternoon, moving only fractionally as the light shifts. There is a lesson in that patience.",
    date: "2026-05-18",
    mood: "Grateful",
    tags: ["gratitude", "observations"],
    words: 103,
    pinned: false,
  },
  {
    id: "3",
    title: "Correspondence with My Younger Self",
    body: "If I could send a letter back ten years, what would it say? Not the usual reassurances — it gets better, you figure it out — but something honest. Something with teeth.\n\nIt would say: the thing you are most afraid of is not the thing that will hurt you. You are looking in the wrong direction.",
    date: "2026-05-14",
    mood: "Melancholic",
    tags: ["growth", "memories"],
    words: 122,
    pinned: false,
  },
  {
    id: "4",
    title: "A Walk Without Destination",
    body: "Took the long way home today — the way I never take because it adds twenty minutes and I am always, apparently, in a hurry to arrive somewhere. But today I let the road decide and it took me somewhere entirely unexpected.",
    date: "2026-05-10",
    mood: "Hopeful",
    tags: ["travel", "nature"],
    words: 119,
    pinned: false,
  },
  {
    id: "5",
    title: "Notes on Finishing",
    body: "I finished the novel I have been reading for six weeks. Put it down on the coffee table and sat with it for a while, the way you sit with a person who has just told you something important.",
    date: "2026-05-06",
    mood: "Reflective",
    tags: ["books", "creativity"],
    words: 105,
    pinned: false,
  },
  {
    id: "6",
    title: "What Patience Looks Like",
    body: "My grandmother used to say patience is not waiting. It is knowing what is worth waiting for. I have been thinking about the difference all week.",
    date: "2026-04-28",
    mood: "Content",
    tags: ["growth", "relationships"],
    words: 72,
    pinned: false,
  },
];

// ─── Nav links ────────────────────────────────────────────────────────────────
export const NAV_LINKS = [
  { label: "Dashboard",     path: "/dashboard",   icon: "grid" },
  { label: "New Entry",     path: "/journal/new", icon: "edit" },
  { label: "Calendar",      path: "/calendar",    icon: "calendar" },
  { label: "Analytics",     path: "/analytics",   icon: "bar-chart" },
  { label: "Settings",      path: "/settings",    icon: "settings" },
];

// ─── Utility ──────────────────────────────────────────────────────────────────
export const formatDate = (iso) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
  });

export const countWords = (text = "") =>
  text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;