import React from "react";
import { SAMPLE_ENTRIES, MOODS } from "../lib/constants";
import { SectionLabel, MoodBadge } from "../components/ui";
import { BarChart2, TrendingUp, Calendar, Hash } from "lucide-react";

export default function Analytics() {
  // Simple stats calculation
  const totalEntries = SAMPLE_ENTRIES.length;
  const totalWords = SAMPLE_ENTRIES.reduce(
    (acc, curr) => acc + (curr.words || 0),
    0,
  );
  const avgWords = totalEntries ? Math.round(totalWords / totalEntries) : 0;

  // Mood frequency
  const moodCounts = SAMPLE_ENTRIES.reduce((acc, curr) => {
    acc[curr.mood] = (acc[curr.mood] || 0) + 1;
    return acc;
  }, {});

  const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

  // Tag frequency
  const tagCounts = SAMPLE_ENTRIES.reduce((acc, curr) => {
    curr.tags.forEach((tag) => {
      acc[tag] = (acc[tag] || 0) + 1;
    });
    return acc;
  }, {});

  const topTags = Object.entries(tagCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10);

  return (
    <div className="px-6 md:px-12 py-10 md:py-16">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12 border-b border-[#1C1917] pb-8">
          <p className="font-sans text-[11px] uppercase tracking-[3px] text-[#C29F60] mb-2">
            Writing Insights
          </p>
          <h1 className="font-serif text-[40px] font-bold text-[#1C1917] leading-tight">
            Your Journal Story
          </h1>
        </div>

        {/* High Level Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              label: "Total Entries",
              value: totalEntries,
              icon: <Calendar size={20} />,
            },
            {
              label: "Total Words",
              value: totalWords.toLocaleString(),
              icon: <TrendingUp size={20} />,
            },
            {
              label: "Avg. Words",
              value: avgWords,
              icon: <BarChart2 size={20} />,
            },
            {
              label: "Unique Tags",
              value: Object.keys(tagCounts).length,
              icon: <Hash size={20} />,
            },
          ].map((stat, i) => (
            <div
              key={i}
              className="p-6 border border-[#1C1917] bg-[#F2EFE9]/30"
            >
              <div className="text-[#C29F60] mb-4">{stat.icon}</div>
              <p className="text-[11px] uppercase tracking-[20px] text-[#8A867D] mb-1">
                {stat.label}
              </p>
              <p className="text-[32px] font-serif font-bold text-[#1C1917]">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Mood Distribution */}
          <div>
            <SectionLabel>Mood Distribution</SectionLabel>
            <div className="flex flex-col gap-4 mt-6">
              {sortedMoods.map(([mood, count]) => {
                const percentage = Math.round((count / totalEntries) * 100);
                return (
                  <div key={mood} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <MoodBadge mood={mood} />
                      <span className="font-sans text-[13px] text-[#8A867D]">
                        {count} entries ({percentage}%)
                      </span>
                    </div>
                    <div className="w-full h-2 bg-[#F2EFE9] border border-[#1C1917]/10">
                      <div
                        className="h-full bg-[#1A3626]"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Tags */}
          <div>
            <SectionLabel>Top Subjects</SectionLabel>
            <div className="flex flex-wrap gap-3 mt-6">
              {topTags.map(([tag, count]) => (
                <div
                  key={tag}
                  className="group border border-[#F2EFE9] hover:border-[#1C1917] px-4 py-3 bg-[#FBF9F6] transition-all"
                >
                  <p className="text-[14px] font-sans font-medium text-[#1C1917] group-hover:text-[#C29F60]">
                    #{tag}
                  </p>
                  <p className="text-[11px] text-[#8A867D] uppercase tracking-[1px] mt-1">
                    {count} mentions
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Writing Consistency Mockup */}
        <div className="mt-16 pt-12 border-t border-[#1C1917]">
          <SectionLabel>Writing Rhythm</SectionLabel>
          <div className="mt-8 flex gap-1 h-32 items-end">
            {Array.from({ length: 30 }).map((_, i) => {
              const height = Math.random() * 100 + 10;
              return (
                <div
                  key={i}
                  className="flex-1 bg-[#F2EFE9] border border-b-0 border-[#1C1917]/10 hover:bg-[#C29F60] transition-colors group relative"
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1C1917] text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    May {i + 1}: {Math.round(height * 5)} words
                  </div>
                </div>
              );
            })}
          </div>
          <div className="flex justify-between mt-4">
            <span className="text-[11px] uppercase tracking-[1.5px] text-[#8A867D]">
              May 1
            </span>
            <span className="text-[11px] uppercase tracking-[1.5px] text-[#8A867D]">
              Last 30 Days
            </span>
            <span className="text-[11px] uppercase tracking-[1.5px] text-[#8A867D]">
              May 30
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
