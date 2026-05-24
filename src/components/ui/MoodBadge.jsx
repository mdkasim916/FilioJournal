import React from "react";

const MOOD_COLORS = {
  Reflective: "#C29F60",
  Hopeful: "#1A3626",
  Melancholic: "#6B5860",
  Energised: "#2A7F62",
  Grateful: "#C29F60",
  Restless: "#8A5D5D",
};

export default function MoodBadge({ mood }) {
  const bg = MOOD_COLORS[mood] || "transparent";
  const color = mood ? "var(--color-background)" : "var(--color-muted)";
  return (
    <span
      className="text-[11px] uppercase tracking-[1px] px-3 py-1 font-semibold"
      style={{ background: bg, color, borderRadius: 0 }}
    >
      {mood}
    </span>
  );
}
