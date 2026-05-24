import React, { useRef, useState } from "react";
import { useJournal } from "../context/JournalStore";
import Button from "../components/ui/Button";

export default function Settings() {
  const {
    exportEntries,
    importEntries,
    syncEnabled,
    setSyncEnabled,
    syncStatus,
    signIn,
    logOut,
  } = useJournal();
  const fileRef = useRef(null);
  const [importError, setImportError] = useState("");

  function handleExport() {
    const json = exportEntries();
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `folio-journal-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handleFile(ev) {
    const file = ev.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importEntries(reader.result);
        setImportError("");
        alert("Import successful — entries merged into your journal.");
      } catch (err) {
        setImportError(err instanceof Error ? err.message : String(err));
      }
    };
    reader.readAsText(file);
  }

  return (
    <div className="min-h-full px-12 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-serif font-bold mb-4">Settings & Data</h1>

        <section className="mb-8 p-6 border border-[#1C1917] bg-[#F2EFE9]">
          <h2 className="font-semibold mb-3">Export / Import</h2>
          <p className="text-sm text-[#8A867D] mb-4">
            Export your journal as JSON or import a JSON export to merge
            entries.
          </p>
          <div className="flex gap-3">
            <Button onClick={handleExport}>Export JSON</Button>
            <input
              ref={fileRef}
              type="file"
              accept="application/json"
              onChange={handleFile}
            />
          </div>
          {importError && <p className="text-red-600 mt-2">{importError}</p>}
        </section>

        <section className="mb-8 p-6 border border-[#1C1917] bg-[#F2EFE9]">
          <h2 className="font-semibold mb-3">Sync</h2>
          <p className="text-sm text-[#8A867D] mb-3">
            Enable sync to store your entries across devices. Sign in is
            required to enable sync.
          </p>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={syncEnabled}
                onChange={(e) => setSyncEnabled(e.target.checked)}
              />
              <span className="text-sm">Sync enabled</span>
            </label>
            <span className="text-sm text-[#8A867D]">Status: {syncStatus}</span>
          </div>
        </section>

        <section className="mb-8 p-6 border border-[#1C1917] bg-[#F2EFE9]">
          <h2 className="font-semibold mb-3">Authentication</h2>
          <p className="text-sm text-[#8A867D] mb-3">
            You can use the journal locally without an account. Sign up to
            enable cross-device sync.
          </p>
          <div className="flex gap-3">
            <Button onClick={() => signIn()} variant="outline">
              Sign in (demo)
            </Button>
            <Button onClick={() => logOut()} variant="ghost">
              Sign out
            </Button>
          </div>
        </section>

        <section className="p-6 border border-[#1C1917] bg-[#F2EFE9]">
          <h2 className="font-semibold mb-3">Notes</h2>
          <p className="text-sm text-[#8A867D]">
            This app is local-first and stores entries in your browser's
            localStorage. Sync uses Supabase (optional). If you do not sign in,
            your data remains only on this device. Export your journal regularly
            if you want a backup.
          </p>
        </section>
      </div>
    </div>
  );
}
