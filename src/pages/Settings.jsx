import React, { useRef, useState, useEffect } from "react";
import { useJournal } from "../context/JournalStore";
import { useNotification } from "../context/NotificationContext";
import Button from "../components/ui/Button";

export default function Settings() {
  const {
    exportEntries,
    importEntries,
    syncEnabled,
    setSyncEnabled,
    syncStatus,
    logOut,
    profile,
    updateProfile,
    themeId,
    setTheme,
    themeOptions,
    dailyGoal,
    setDailyGoal,
  } = useJournal();
  const { showNotification } = useNotification();
  const fileRef = useRef(null);
  const [importError, setImportError] = useState("");
  const [name, setName] = useState(profile.name);
  const [bio, setBio] = useState(profile.bio);

  useEffect(() => {
    setName(profile.name);
    setBio(profile.bio);
  }, [profile]);

  function handleProfileUpdate(e) {
    e.preventDefault();
    updateProfile({ ...profile, name, bio });
    showNotification("Profile updated successfully", "success");
  }

  function handleExport() {
    try {
      const json = exportEntries();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `folio-journal-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification("Journal exported successfully", "success");
    } catch (err) {
      showNotification("Failed to export journal", "error");
    }
  }

  function handleFile(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const count = importEntries(reader.result);
        setImportError("");
        showNotification(`${count} entries imported and merged`, "success");
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setImportError(msg);
        showNotification("Failed to import entries", "error");
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-full px-6 md:px-12 py-10 md:py-12 bg-[#FBF9F6]">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-[32px] md:text-[40px] font-serif font-bold mb-8 text-[#1C1917]">
          Settings & Data
        </h1>

        <div className="grid grid-cols-1 gap-6">
          {/* Profile Section */}
          <section className="p-6 md:p-8 border border-[#1C1917] bg-[#F2EFE9]/50">
            <h2 className="font-serif text-[20px] font-bold mb-3 text-[#1C1917]">
              Profile
            </h2>
            <p className="text-sm text-[#8A867D] mb-6 leading-relaxed">
              Customize how you appear in your journal.
            </p>
            <form onSubmit={handleProfileUpdate} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="w-full">
                  <label className="text-[11px] uppercase tracking-[2px] text-[#8A867D] mb-2 block">
                    Display Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full h-10 px-4 bg-white border border-[#1C1917]/10 focus:border-[#1A3626] outline-none font-sans text-[14px] transition-colors"
                  />
                </div>
              </div>
              <div className="w-full">
                <label className="text-[11px] uppercase tracking-[2px] text-[#8A867D] mb-2 block">
                  Bio
                </label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell your story..."
                  rows={3}
                  className="w-full p-4 bg-white border border-[#1C1917]/10 focus:border-[#1A3626] outline-none font-sans text-[14px] transition-colors resize-none"
                />
              </div>
              <Button type="submit" className="w-full sm:w-auto">
                Save Changes
              </Button>
            </form>
          </section>

          {/* Appearance Section */}
          <section className="p-6 md:p-8 border border-[#1C1917] bg-[#F2EFE9]/50">
            <h2 className="font-serif text-[20px] font-bold mb-3 text-[#1C1917]">
              Writing Goals
            </h2>
            <p className="text-sm text-[#8A867D] mb-6 leading-relaxed">
              Set a daily word count goal to stay motivated.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full">
                <label className="text-[11px] uppercase tracking-[2px] text-[#8A867D] mb-2 block">
                  Daily Word Goal
                </label>
                <input
                  type="number"
                  value={dailyGoal}
                  onChange={(e) =>
                    setDailyGoal(parseInt(e.target.value, 10) || 0)
                  }
                  className="w-full h-10 px-4 bg-white border border-[#1C1917]/10 focus:border-[#1A3626] outline-none font-sans text-[14px] transition-colors"
                />
              </div>
              <Button
                onClick={() => showNotification("Goal updated", "info")}
                className="w-full sm:w-auto"
              >
                Update Goal
              </Button>
            </div>
          </section>

          {/* Appearance Section */}
          <section className="p-6 md:p-8 border border-[#1C1917] bg-[#F2EFE9]/50">
            <h2 className="font-serif text-[20px] font-bold mb-3 text-[#1C1917]">
              Appearance
            </h2>
            <p className="text-sm text-[#8A867D] mb-6 leading-relaxed">
              Choose a theme that matches your writing style.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {themeOptions.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTheme(t.id)}
                  className={`p-4 border text-left transition-all duration-200 cursor-pointer ${
                    themeId === t.id
                      ? "border-[#1A3626] bg-[#1A3626] text-[#FBF9F6] shadow-md"
                      : "border-[#1C1917]/10 bg-white text-[#1C1917] hover:border-[#1C1917]"
                  }`}
                >
                  <p className="text-[14px] font-bold mb-1">{t.name}</p>
                  <div className="flex gap-1">
                    <div
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{
                        backgroundColor: t.background.includes("linear")
                          ? t.accent
                          : t.background,
                      }}
                    />
                    <div
                      className="w-4 h-4 rounded-full border border-black/10"
                      style={{ backgroundColor: t.accent }}
                    />
                  </div>
                </button>
              ))}
            </div>
          </section>

          {/* Export / Import Section */}
          <section className="p-6 md:p-8 border border-[#1C1917] bg-[#F2EFE9]/50">
            <h2 className="font-serif text-[20px] font-bold mb-3 text-[#1C1917]">
              Export / Import
            </h2>
            <p className="text-sm text-[#8A867D] mb-6 leading-relaxed">
              Export your journal as JSON or import a JSON export to merge
              entries.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={handleExport} className="w-full sm:w-auto">
                Export JSON
              </Button>
              <div className="relative">
                <input
                  ref={fileRef}
                  type="file"
                  accept="application/json"
                  onChange={handleFile}
                  className="hidden"
                  id="import-file"
                />
                <label
                  htmlFor="import-file"
                  className="flex items-center justify-center h-10 px-6 border border-[#1C1917] bg-transparent text-[#1C1917] text-[13px] uppercase tracking-[1px] hover:bg-[#1C1917] hover:text-[#FBF9F6] transition-all cursor-pointer w-full sm:w-auto"
                >
                  Import JSON
                </label>
              </div>
            </div>
            {importError && (
              <p className="text-red-600 mt-2 text-sm">{importError}</p>
            )}
          </section>

          {/* Cloud Sync Section */}
          <section className="p-6 md:p-8 border border-[#1C1917] bg-[#F2EFE9]/50">
            <h2 className="font-serif text-[20px] font-bold mb-3 text-[#1C1917]">
              Cloud Sync
            </h2>
            <p className="text-sm text-[#8A867D] mb-6 leading-relaxed">
              Syncing keeps your entries safe and accessible across all your
              devices using your Google account.
            </p>
            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <div className="relative flex items-center">
                  <input
                    type="checkbox"
                    checked={syncEnabled}
                    onChange={(e) => setSyncEnabled(e.target.checked)}
                    className="peer sr-only"
                  />
                  <div className="w-10 h-5 bg-[#D1D5DB] rounded-full peer peer-checked:bg-[#1A3626] transition-colors"></div>
                  <div className="absolute left-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-5"></div>
                </div>
                <span className="text-sm font-medium text-[#1C1917]">
                  Enable Sync
                </span>
              </label>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-[1px] text-[#8A867D]">
                  Status:
                </span>
                <span
                  className={`text-[11px] uppercase tracking-[1px] font-bold ${syncStatus === "synced" ? "text-green-600" : "text-[#C29F60]"}`}
                >
                  {syncStatus}
                </span>
              </div>
            </div>
          </section>

          {/* Account Section */}
          <section className="p-6 md:p-8 border border-[#1C1917] bg-[#F2EFE9]/50">
            <h2 className="font-serif text-[20px] font-bold mb-3 text-[#1C1917]">
              Account
            </h2>
            <p className="text-sm text-[#8A867D] mb-6 leading-relaxed">
              Managing your session. Your entries are tied to your Google
              account when sync is enabled.
            </p>
            <Button
              onClick={() => logOut()}
              variant="outline"
              className="w-full sm:w-auto text-red-600 border-red-200 hover:bg-red-50 hover:border-red-600"
            >
              Sign out of Folio
            </Button>
          </section>

          {/* Privacy Section */}
          <section className="p-6 md:p-8 border border-[#1C1917] bg-[#1A3626] text-[#FBF9F6]">
            <h2 className="font-serif text-[20px] font-bold mb-3">
              Data Privacy
            </h2>
            <p className="text-sm text-[#FBF9F6]/70 leading-relaxed">
              Folio is built on a "local-first" philosophy. Your entries are
              stored directly in your browser. When Cloud Sync is active,
              entries are securely mirrored to your private Supabase database.
              We never sell your data, and we don't have an algorithm. Your
              words remain yours.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
