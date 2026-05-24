import { useMemo } from "react";
import { Link } from "react-router-dom";
import { SectionLabel, MoodBadge, Button } from "../components/ui";
import {
  BarChart2,
  TrendingUp,
  Calendar as CalendarIcon,
  Hash,
} from "lucide-react";
import { useJournal } from "../context/JournalStore";

export default function Analytics() {
  const { entries } = useJournal();

  // Stats calculation
  const stats = useMemo(() => {
    const totalEntries = entries.length;
    const totalWords = entries.reduce(
      (acc, curr) => acc + (curr.body ? curr.body.split(/\s+/).length : 0),
      0,
    );
    const avgWords = totalEntries ? Math.round(totalWords / totalEntries) : 0;

    // Mood frequency
    const moodCounts = entries.reduce((acc, curr) => {
      acc[curr.mood] = (acc[curr.mood] || 0) + 1;
      return acc;
    }, {});

    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);

    // Tag frequency
    const tagCounts = entries.reduce((acc, curr) => {
      curr.tags.forEach((tag) => {
        acc[tag] = (acc[tag] || 0) + 1;
      });
      return acc;
    }, {});

    const topTags = Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      totalEntries,
      totalWords,
      avgWords,
      sortedMoods,
      topTags,
      tagCountsCount: Object.keys(tagCounts).length,
    };
  }, [entries]);

  const rhythmData = useMemo(() => {
    const days = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().slice(0, 10);
      const dayEntries = entries.filter((e) => e.createdAt.startsWith(dayStr));
      const words = dayEntries.reduce(
        (acc, curr) => acc + (curr.body ? curr.body.split(/\s+/).length : 0),
        0,
      );
      days.push({ date: d, words });
    }
    return days;
  }, [entries]);

  const maxWords = Math.max(...rhythmData.map((d) => d.words), 100);

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
        {stats.totalEntries === 0 ? (
          <div className="py-20 text-center border border-[#1C1917] bg-[#F2EFE9]/30 mb-12">
            <div className="max-w-md mx-auto px-6">
              <BarChart2 className="mx-auto text-[#C29F60] mb-6" size={48} />
              <h2 className="font-serif text-[28px] font-bold text-[#1C1917] mb-3">
                No data to analyze yet
              </h2>
              <p className="text-[#8A867D] mb-8 leading-relaxed">
                As you write more entries, we'll help you visualize your mood
                patterns, word counts, and recurring themes.
              </p>
              <Link to="/journal/new">
                <Button>Start Your First Entry</Button>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {[
                {
                  label: "Total Entries",
                  value: stats.totalEntries,
                  icon: <CalendarIcon size={20} />,
                },
                {
                  label: "Total Words",
                  value: stats.totalWords.toLocaleString(),
                  icon: <TrendingUp size={20} />,
                },
                {
                  label: "Avg. Words",
                  value: stats.avgWords,
                  icon: <BarChart2 size={20} />,
                },
                {
                  label: "Unique Tags",
                  value: stats.tagCountsCount,
                  icon: <Hash size={20} />,
                },
              ].map((stat) => (
                <div
                  key={stat.label}
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
                  {stats.sortedMoods.length > 0 ? (
                    stats.sortedMoods.map(([mood, count]) => {
                      const percentage = Math.round(
                        (count / stats.totalEntries) * 100,
                      );
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
                    })
                  ) : (
                    <p className="text-[14px] text-[#8A867D] italic">
                      Start journaling to see your mood patterns.
                    </p>
                  )}
                </div>
              </div>

              {/* Top Tags */}
              <div>
                <SectionLabel>Top Subjects</SectionLabel>
                <div className="flex flex-wrap gap-3 mt-6">
                  {stats.topTags.length > 0 ? (
                    stats.topTags.map(([tag, count]) => (
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
                    ))
                  ) : (
                    <p className="text-[14px] text-[#8A867D] italic">
                      Add tags to your entries to see your top subjects.
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Writing Rhythm */}
            <div className="mt-16 pt-12 border-t border-[#1C1917]">
              <SectionLabel>Writing Rhythm</SectionLabel>
              <div className="mt-8 flex gap-1 h-32 items-end">
                {rhythmData.map((day, i) => {
                  const height = (day.words / maxWords) * 100;
                  return (
                    <div
                      key={i}
                      className="flex-1 bg-[#F2EFE9] border border-b-0 border-[#1C1917]/10 hover:bg-[#C29F60] transition-colors group relative"
                      style={{ height: `${Math.max(height, 5)}%` }}
                    >
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-[#1C1917] text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-10">
                        {day.date.toLocaleDateString("en-GB", {
                          month: "short",
                          day: "numeric",
                        })}
                        : {day.words} words
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-4">
                <span className="text-[11px] uppercase tracking-[1.5px] text-[#8A867D]">
                  {rhythmData[0].date.toLocaleDateString("en-GB", {
                    month: "short",
                    day: "numeric",
                  })}
                </span>
                <span className="text-[11px] uppercase tracking-[1.5px] text-[#8A867D]">
                  Last 30 Days
                </span>
                <span className="text-[11px] uppercase tracking-[1.5px] text-[#8A867D]">
                  Today
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
