import { useState } from "react";
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
import { Button } from "../components/ui";
import { useJournal } from "../context/JournalStore";

export default function Calendar() {
  const { entries } = useJournal();
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
    return entries.filter((entry) => isSameDay(new Date(entry.createdAt), day));
  };

  return (
    <div className="px-6 md:px-12 py-10 min-h-full bg-[#FBF9F6]">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
          <div>
            <p className="font-sans text-[11px] uppercase tracking-[3px] text-[#C29F60] mb-2">
              Archive Navigation
            </p>
            <h1 className="font-serif text-[32px] md:text-[40px] font-bold text-[#1C1917]">
              {format(currentDate, "MMMM yyyy")}
            </h1>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center border border-[#1C1917] bg-white">
              <button
                onClick={prevMonth}
                className="p-3 hover:bg-[#F2EFE9] transition-colors cursor-pointer border-r border-[#1C1917]"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={nextMonth}
                className="p-3 hover:bg-[#F2EFE9] transition-colors cursor-pointer"
              >
                <ChevronRight size={20} />
              </button>
            </div>
            <Link to="/journal/new" className="flex-1 md:flex-none">
              <Button className="w-full flex items-center justify-center gap-2">
                <Plus size={16} />{" "}
                <span className="hidden sm:inline">New Entry</span>
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-7 border-t border-l border-[#1C1917] shadow-sm">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-4 border-r border-b border-[#1C1917] bg-[#F2EFE9] text-center"
            >
              <span className="text-[11px] uppercase tracking-[2px] font-bold text-[#1C1917]">
                {day}
              </span>
            </div>
          ))}

          {calendarDays.map((day, idx) => {
            const dayEntries = getEntriesForDay(day);
            const isSelectedMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={idx}
                className={`h-[140px] md:h-[180px] p-2 md:p-3 border-r border-b border-[#1C1917] transition-colors flex flex-col group ${
                  !isSelectedMonth ? "bg-[#FBF9F6]/30" : "bg-white"
                } ${isToday ? "bg-[#C29F60]/5" : ""}`}
              >
                <div className="flex justify-between items-start mb-2 shrink-0">
                  <span
                    className={`text-[13px] md:text-[14px] font-serif ${!isSelectedMonth ? "text-[#D1D5DB]" : "text-[#1C1917]"} ${isToday ? "w-7 h-7 flex items-center justify-center bg-[#C29F60] text-white rounded-full font-bold" : ""}`}
                  >
                    {format(day, "d")}
                  </span>
                  {dayEntries.length > 0 && !isToday && (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C29F60] mt-1.5 mr-1" />
                  )}
                </div>

                <div className="flex flex-col gap-1.5 overflow-y-auto no-scrollbar flex-1">
                  {dayEntries.map((entry) => (
                    <Link
                      key={entry.id}
                      to={`/journal/${entry.id}`}
                      className="group/entry shrink-0"
                    >
                      <div className="p-2 border border-[#F2EFE9] hover:border-[#1C1917] hover:bg-[#F2EFE9] transition-all overflow-hidden rounded-sm">
                        <p className="text-[10px] md:text-[11px] font-medium text-[#1C1917] truncate leading-tight">
                          {entry.title}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
