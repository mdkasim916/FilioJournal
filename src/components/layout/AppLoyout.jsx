// src/components/layout/AppLayout.jsx
// Wrap all authenticated routes with this layout
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import { SAMPLE_ENTRIES } from "../../lib/constants";

export default function AppLayout() {
  // In a real app, fetch entries from context/store here
  return (
    <div
      className="flex min-h-screen bg-[#FBF9F6]"
      style={{ fontFamily: "'Outfit', sans-serif" }}
    >
      <Sidebar entries={SAMPLE_ENTRIES} />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
