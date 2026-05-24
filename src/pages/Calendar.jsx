import React, { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isSameDay,
  addMonths,
  subMonths,
} from "date-fns";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { SAMPLE_ENTRIES } from "../lib/constants";
import { MoodBadge } from "../components/ui";

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({
    start: startDate,
    end: endDate,
  });

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const getEntriesForDay = (day) => {
    return SAMPLE_ENTRIES.filter((entry) =>
      isSameDay(new Date(entry.date), day),
    );
  };

  return (
    <div className="px-6 md:px-12 py-10">
      <div className="flex flex-col md:row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <p className="font-sans text-[11px] uppercase tracking-[3px] text-[#8A867D] mb-1">
            Archive Navigation
          </p>
          <h1 className="font-serif text-[32px] md:text-[40px] font-bold text-[#1C1917]">
            {format(currentDate, "MMMM yyyy")}
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={prevMonth}
            className="p-2 border border-[#1C1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={nextMonth}
            className="p-2 border border-[#1C1917] hover:bg-[#F2EFE9] transition-colors cursor-pointer"
          >
            <ChevronRight size={20} />
          </button>
          <Link to="/journal/new">
            <button className="bg-[#1A3626] text-[#FBF9F6] px-6 py-2.5 text-[13px] uppercase tracking-[1px] hover:bg-[#1A3626]/90 transition-colors flex items-center gap-2">
              <Plus size={16} /> New Entry
            </button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-7 border-t border-l border-[#1C1917]">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="p-4 border-r border-b border-[#1C1917] bg-[#F2EFE9]/50 text-center"
          >
            <span className="text-[11px] uppercase tracking-[2px] font-bold text-[#8A867D]">
              {day}
            </span>
          </div>
        ))}

        {calendarDays.map((day, idx) => {
          const entries = getEntriesForDay(day);
          const isSelectedMonth = isSameMonth(day, monthStart);
          const isToday = isSameDay(day, new Date());

          return (
            <div
              key={idx}
              className={`min-h-[120px] md:min-h-[160px] p-2 md:p-4 border-r border-b border-[#1C1917] transition-colors ${
                !isSelectedMonth ? "bg-[#FBF9F6]/30" : "bg-[#FBF9F6]"
              } ${isToday ? "ring-inset ring-2 ring-[#C29F60]" : ""}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span
                  className={`text-[14px] font-serif ${!isSelectedMonth ? "text-[#D1D5DB]" : "text-[#1C1917]"} ${isToday ? "font-bold text-[#C29F60]" : ""}`}
                >
                  {format(day, "d")}
                </span>
                {entries.length > 0 && (
                  <span className="w-2 h-2 rounded-full bg-[#C29F60]" />
                )}
              </div>

              <div className="flex flex-col gap-1">
                {entries.map((entry) => (
                  <Link
                    key={entry.id}
                    to={`/journal/${entry.id}`}
                    className="group"
                  >
                    <div className="p-1.5 border border-transparent hover:border-[#1C1917] hover:bg-[#F2EFE9] transition-all overflow-hidden">
                      <p className="text-[10px] md:text-[11px] font-medium text-[#1C1917] truncate leading-tight">
                        {entry.title}
                      </p>
                      <div className="mt-1 scale-[0.8] origin-left">
                        <MoodBadge mood={entry.mood} />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
