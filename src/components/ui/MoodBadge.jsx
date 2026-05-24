import React from "react";
import { MOODS } from "../../lib/constants";

export default function MoodBadge({ mood }) {
  const moodConfig = MOODS.find((m) => m.label === mood);

  if (!moodConfig) {
    return (
      <span className="text-[10px] uppercase tracking-[1px] px-2 py-0.5 border border-[#F2EFE9] text-[#8A867D]">
        {mood || "Unknown"}
      </span>
    );
  }

  return (
    <span
      className={`text-[10px] uppercase tracking-[1px] px-2 py-0.5 border transition-colors ${moodConfig.color} group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20`}
    >
      {moodConfig.emoji} {mood}
    </span>
  );
}
