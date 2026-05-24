export const moodOptions = [
  {
    id: "calm",
    label: "Calm",
    emoji: "🌿",
    score: 4.2,
    accent: "from-emerald-500/20 to-teal-500/10 text-emerald-800",
  },
  {
    id: "focused",
    label: "Focused",
    emoji: "🎯",
    score: 4.6,
    accent: "from-sky-500/20 to-cyan-500/10 text-sky-800",
  },
  {
    id: "reflective",
    label: "Reflective",
    emoji: "🪞",
    score: 4,
    accent: "from-amber-500/20 to-orange-500/10 text-amber-900",
  },
  {
    id: "energized",
    label: "Energized",
    emoji: "⚡",
    score: 4.8,
    accent: "from-rose-500/20 to-orange-500/10 text-rose-800",
  },
  {
    id: "tired",
    label: "Tired",
    emoji: "🌙",
    score: 2.8,
    accent: "from-slate-500/20 to-zinc-500/10 text-slate-800",
  },
  {
    id: "hopeful",
    label: "Hopeful",
    emoji: "🌤️",
    score: 4.4,
    accent: "from-indigo-500/20 to-violet-500/10 text-indigo-800",
  },
]

export const tagOptions = [
  "work",
  "study",
  "family",
  "health",
  "ideas",
  "gratitude",
  "creative",
  "planning",
]

export const seedEntries = [
  {
    id: "seed-1",
    title: "Reset the week",
    body: "Opened the week by clearing distractions, rewriting my top priorities, and setting a quieter pace for the next few days.",
    mood: "calm",
    tags: ["planning", "work"],
    createdAt: "2026-05-24T07:30:00.000Z",
    isPrivate: false,
    pinned: true,
  },
  {
    id: "seed-2",
    title: "Design review notes",
    body: "Captured the feedback from the last project review and turned it into a short action list before it disappeared into chat history.",
    mood: "focused",
    tags: ["work", "ideas"],
    createdAt: "2026-05-23T19:40:00.000Z",
    isPrivate: false,
    pinned: false,
  },
  {
    id: "seed-3",
    title: "Evening gratitude",
    body: "Today was smaller than expected, but the stillness helped me notice the people and routines that make the week feel stable.",
    mood: "reflective",
    tags: ["gratitude", "family"],
    createdAt: "2026-05-22T21:10:00.000Z",
    isPrivate: true,
    pinned: false,
  },
  {
    id: "seed-4",
    title: "New idea sprint",
    body: "A short burst of energy turned into three product ideas, one presentation structure, and a better headline for the journal home page.",
    mood: "energized",
    tags: ["creative", "ideas"],
    createdAt: "2026-05-21T15:20:00.000Z",
    isPrivate: false,
    pinned: false,
  },
  {
    id: "seed-5",
    title: "Slow morning",
    body: "Started the day a little tired, so I kept the first hour quiet and leaned into a gentler rhythm instead of forcing momentum.",
    mood: "tired",
    tags: ["health", "planning"],
    createdAt: "2026-05-20T08:55:00.000Z",
    isPrivate: false,
    pinned: false,
  },
]

export function getMoodMeta(moodId) {
  return moodOptions.find((option) => option.id === moodId) ?? moodOptions[2]
}

export function formatEntryDate(dateValue) {
  return new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(dateValue))
}

export function formatRelativeTime(dateValue) {
  const date = new Date(dateValue)
  const diff = Date.now() - date.getTime()
  const minute = 60 * 1000
  const hour = 60 * minute
  const day = 24 * hour

  if (diff < hour) {
    return `${Math.max(1, Math.round(diff / minute))}m ago`
  }

  if (diff < day) {
    return `${Math.max(1, Math.round(diff / hour))}h ago`
  }

  return `${Math.max(1, Math.round(diff / day))}d ago`
}

export function sortEntries(entries) {
  return [...entries].sort((firstEntry, secondEntry) => {
    if (firstEntry.pinned !== secondEntry.pinned) {
      return firstEntry.pinned ? -1 : 1
    }

    return new Date(secondEntry.createdAt) - new Date(firstEntry.createdAt)
  })
}

export function countWords(text) {
  return text.trim() ? text.trim().split(/\s+/).length : 0
}

export function calculateStreak(entries) {
  if (entries.length === 0) {
    return 0
  }

  const uniqueDays = [...new Set(entries.map((entry) => entry.createdAt.slice(0, 10)))].sort().reverse()
  let streak = 1
  let anchor = new Date(uniqueDays[0])

  for (let index = 1; index < uniqueDays.length; index += 1) {
    anchor.setDate(anchor.getDate() - 1)
    const expected = anchor.toISOString().slice(0, 10)

    if (uniqueDays[index] === expected) {
      streak += 1
    } else {
      break
    }
  }

  return streak
}

export function statsFromEntries(entries) {
  if (entries.length === 0) {
    return {
      entryCount: 0,
      streak: 0,
      totalWords: 0,
      averageMood: 0,
      privateCount: 0,
      favoriteTag: "",
    }
  }

  const totalWords = entries.reduce((sum, entry) => sum + countWords(entry.body), 0)
  const averageMood =
    entries.reduce((sum, entry) => sum + (getMoodMeta(entry.mood)?.score ?? 0), 0) / entries.length
  const tagCounts = new Map()

  entries.forEach((entry) => {
    entry.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) ?? 0) + 1)
    })
  })

  const favoriteTag = [...tagCounts.entries()].sort((firstTag, secondTag) => {
    if (secondTag[1] !== firstTag[1]) {
      return secondTag[1] - firstTag[1]
    }

    return firstTag[0].localeCompare(secondTag[0])
  })[0]?.[0]

  return {
    entryCount: entries.length,
    streak: calculateStreak(entries),
    totalWords,
    averageMood,
    privateCount: entries.filter((entry) => entry.isPrivate).length,
    favoriteTag: favoriteTag ?? "",
  }
}

export function buildInsights(entries) {
  if (entries.length === 0) {
    return {
      favoriteMood: "reflective",
      mostCommonTag: "planning",
      reflectionPrompt: "Write one small thing that would make tomorrow easier.",
      recentFocus: "Add your first entry to start the pattern.",
    }
  }

  const moodCount = new Map()
  const tagCount = new Map()

  entries.forEach((entry) => {
    moodCount.set(entry.mood, (moodCount.get(entry.mood) ?? 0) + 1)

    entry.tags.forEach((tag) => {
      tagCount.set(tag, (tagCount.get(tag) ?? 0) + 1)
    })
  })

  const favoriteMood = [...moodCount.entries()].sort((firstMood, secondMood) => {
    if (secondMood[1] !== firstMood[1]) {
      return secondMood[1] - firstMood[1]
    }

    return firstMood[0].localeCompare(secondMood[0])
  })[0]?.[0] ?? "reflective"

  const mostCommonTag = [...tagCount.entries()].sort((firstTag, secondTag) => {
    if (secondTag[1] !== firstTag[1]) {
      return secondTag[1] - firstTag[1]
    }

    return firstTag[0].localeCompare(secondTag[0])
  })[0]?.[0] ?? "planning"

  const latestEntry = sortEntries(entries)[0]
  const latestTag = latestEntry?.tags[0] ?? "planning"

  return {
    favoriteMood,
    mostCommonTag,
    reflectionPrompt: `What changed in the ${latestTag} part of your day?`,
    recentFocus: `Your latest entry leaned toward ${getMoodMeta(favoriteMood).label.toLowerCase()} energy.`,
  }
}