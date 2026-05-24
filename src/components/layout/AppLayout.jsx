import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useJournal } from "../../context/JournalStore";

export default function AppLayout() {
  const { authSession, hasJournalSync, isAuthLoading } = useJournal();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6]">
        <div className="text-[#1A3626] animate-pulse font-serif italic text-xl text-center px-6">
          Opening your journal...
        </div>
      </div>
    );
  }

  if (!authSession && hasJournalSync()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className="flex flex-col lg:flex-row h-screen bg-[#FBF9F6] overflow-hidden"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto no-scrollbar relative">
        <Outlet />
      </main>
    </div>
  );
}
