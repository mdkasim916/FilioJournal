import { Outlet, Navigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { useJournal } from "../../context/JournalStore";

export default function AppLayout() {
  const { authSession, hasJournalSync, isAuthLoading } = useJournal();

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FBF9F6]">
        <div className="text-[#1A3626] animate-pulse font-serif italic text-xl">
          Opening your journal...
        </div>
      </div>
    );
  }

  // If we have supabase configured but no session, redirect to login
  // This is a simple protection mechanism
  if (!authSession && hasJournalSync()) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div
      className="flex min-h-screen bg-[#FBF9F6]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
