import { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useJournal } from "../../context/JournalStore";

export default function AppLayout() {
  const { theme } = useJournal();

  useEffect(() => {
    if (!theme) return;
    const root = document.documentElement;
    root.style.setProperty("--theme-accent", theme.accent);
    root.style.setProperty("--theme-bg", theme.background);
    root.style.setProperty("--theme-text", theme.text);
    root.style.setProperty("--theme-muted", theme.muted);
  }, [theme]);

  return (
    <div
      className="flex flex-col lg:flex-row h-screen overflow-hidden"
      style={{
        fontFamily: "'Outfit', sans-serif",
        backgroundColor: "var(--theme-bg)",
        color: "var(--theme-text)",
      }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <Outlet />
      </main>
    </div>
  );
}
