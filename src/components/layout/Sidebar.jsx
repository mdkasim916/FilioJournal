import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  LogOut,
  Plus,
  Search,
  Settings,
  Grid,
  Calendar,
  BarChart2,
  RefreshCw,
  CloudCheck,
  CloudOff,
} from "lucide-react";
import { useJournal } from "../../context/JournalStore";
import { NAV_LINKS } from "../../lib/constants";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logOut, authUser, syncStatus, syncNow, isSyncing, syncEnabled } =
    useJournal();

  const handleLogout = async () => {
    await logOut();
    navigate("/");
  };

  const handleSync = async () => {
    if (isSyncing) return;
    await syncNow();
  };

  const getIcon = (iconName) => {
    switch (iconName) {
      case "grid":
        return <Grid size={18} />;
      case "edit":
        return <Plus size={18} />;
      case "calendar":
        return <Calendar size={18} />;
      case "bar-chart":
        return <BarChart2 size={18} />;
      case "settings":
        return <Settings size={18} />;
      default:
        return null;
    }
  };

  return (
    <aside className="w-64 h-screen border-r border-[#1C1917] bg-[#FBF9F6] flex flex-col sticky top-0">
      <div className="p-8 border-b border-[#1C1917]">
        <Link to="/dashboard">
          <span
            className="font-bold text-[22px] text-[#1C1917]"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Folio
          </span>
        </Link>
      </div>

      <nav className="flex-1 py-8 flex flex-col">
        <div className="px-4 mb-8">
          <p className="px-4 text-[10px] uppercase tracking-[2px] text-[#C29F60] font-medium mb-4">
            Navigation
          </p>
          <div className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`flex items-center gap-3 px-4 py-2.5 text-[14px] transition-all ${
                    isActive
                      ? "bg-[#1A3626] text-[#FBF9F6] font-medium"
                      : "text-[#8A867D] hover:text-[#1C1917] hover:bg-[#F2EFE9]"
                  }`}
                >
                  {getIcon(link.icon)}
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>

        {authUser && (
          <div className="px-4">
            <p className="px-4 text-[10px] uppercase tracking-[2px] text-[#C29F60] font-medium mb-4">
              Cloud Sync
            </p>
            <button
              onClick={handleSync}
              disabled={isSyncing || !syncEnabled}
              className="w-full flex items-center justify-between px-4 py-2.5 text-[13px] text-[#8A867D] hover:text-[#1C1917] hover:bg-[#F2EFE9] transition-all cursor-pointer border-none bg-transparent group"
            >
              <div className="flex items-center gap-3">
                <RefreshCw
                  size={16}
                  className={`${isSyncing ? "animate-spin text-[#C29F60]" : "group-hover:rotate-180 transition-transform duration-500"}`}
                />
                <span>{isSyncing ? "Syncing..." : "Sync Now"}</span>
              </div>
              {syncStatus === "synced" && (
                <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
              )}
              {syncStatus === "error" && (
                <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
              )}
            </button>
            <p className="px-4 mt-2 text-[10px] text-[#8A867D] italic">
              Status: {syncStatus}
            </p>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-[#1C1917]">
        <div className="px-4 py-3 flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#1A3626] flex items-center justify-center text-[#FBF9F6] text-[12px] font-bold uppercase">
              {authUser?.email?.charAt(0) || "U"}
            </div>
            <div className="overflow-hidden">
              <p className="text-[13px] font-medium text-[#1C1917] truncate">
                {authUser?.email?.split("@")[0] || "User"}
              </p>
              <p className="text-[11px] text-[#8A867D] truncate">
                {authUser?.email || ""}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-2 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors cursor-pointer text-left border-none bg-transparent"
          >
            <LogOut size={16} />
            Sign Out
          </button>
        </div>
      </div>
    </aside>
  );
}
