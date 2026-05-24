/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import {
  buildInsights,
  seedEntries,
  sortEntries,
  statsFromEntries,
} from "../lib/journalData";
import { getTheme, journalThemes } from "../lib/journalThemes";
import {
  fetchRemoteEntries,
  hasJournalSync,
  pushRemoteEntries,
  signInWithEmail,
  signInWithGoogle,
  signOut,
  signUpWithEmail,
} from "../lib/journalSync";
import { supabase } from "../lib/supabase";

const storageKey = "journal-atlas.entries";
const profileKey = "journal-atlas.profile";
const themeKey = "journal-atlas.theme";
const syncKey = "journal-atlas.sync-enabled";

const defaultProfile = {
  name: "Alex Morgan",
  email: "alex.morgan@example.com",
  bio: "Writing to stay grounded and capture the day before it fades.",
};

const JournalContext = createContext(null);

function generateId() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }

  return `entry-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function normalizeEntry(entry) {
  const createdAt =
    entry.createdAt ?? entry.created_at ?? new Date().toISOString();

  return {
    id: entry.id ?? generateId(),
    title: entry.title?.trim() || "Untitled entry",
    body: entry.body?.trim() || "",
    mood: entry.mood || "reflective",
    tags: Array.isArray(entry.tags) ? entry.tags : [],
    createdAt,
    updatedAt: entry.updatedAt ?? entry.updated_at ?? createdAt,
    isPrivate: Boolean(entry.isPrivate ?? entry.is_private),
    pinned: Boolean(entry.pinned),
  };
}

function normalizeEntries(entries) {
  return entries.map(normalizeEntry);
}

function loadEntries() {
  if (typeof window === "undefined") {
    return normalizeEntries(seedEntries);
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey);

    if (!storedValue) {
      return normalizeEntries(seedEntries);
    }

    const parsedEntries = JSON.parse(storedValue);
    return Array.isArray(parsedEntries) && parsedEntries.length > 0
      ? normalizeEntries(parsedEntries)
      : normalizeEntries(seedEntries);
  } catch {
    return normalizeEntries(seedEntries);
  }
}

function loadProfile() {
  if (typeof window === "undefined") {
    return defaultProfile;
  }

  try {
    const storedValue = window.localStorage.getItem(profileKey);

    if (!storedValue) {
      return defaultProfile;
    }

    const parsedProfile = JSON.parse(storedValue);

    return {
      name: parsedProfile?.name?.trim() || defaultProfile.name,
      email: parsedProfile?.email?.trim() || defaultProfile.email,
      bio: parsedProfile?.bio?.trim() || defaultProfile.bio,
    };
  } catch {
    return defaultProfile;
  }
}

function loadThemeId() {
  if (typeof window === "undefined") {
    return journalThemes[0].id;
  }

  try {
    const storedValue = window.localStorage.getItem(themeKey);
    return journalThemes.some((theme) => theme.id === storedValue)
      ? storedValue
      : journalThemes[0].id;
  } catch {
    return journalThemes[0].id;
  }
}

function loadSyncEnabled() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    return window.localStorage.getItem(syncKey) === "true";
  } catch {
    return false;
  }
}

function mergeEntries(localEntries, remoteEntries) {
  const merged = new Map();

  [...localEntries, ...remoteEntries].forEach((entry) => {
    const normalized = normalizeEntry(entry);
    const existing = merged.get(normalized.id);

    if (!existing) {
      merged.set(normalized.id, normalized);
      return;
    }

    const existingTime = new Date(
      existing.updatedAt ?? existing.createdAt,
    ).getTime();
    const nextTime = new Date(
      normalized.updatedAt ?? normalized.createdAt,
    ).getTime();
    merged.set(normalized.id, nextTime >= existingTime ? normalized : existing);
  });

  return sortEntries([...merged.values()]);
}

function toJson(entries) {
  return JSON.stringify(
    {
      version: 1,
      exportedAt: new Date().toISOString(),
      entries: sortEntries(entries),
    },
    null,
    2,
  );
}

function parseEntriesJson(rawValue) {
  const parsed = JSON.parse(rawValue);
  const entries = Array.isArray(parsed) ? parsed : parsed?.entries;

  if (!Array.isArray(entries)) {
    throw new Error("JSON must contain an entries array.");
  }

  return normalizeEntries(entries);
}

export function JournalProvider({ children }) {
  const [entries, setEntries] = useState(loadEntries);
  const [profile, setProfile] = useState(loadProfile);
  const [themeId, setThemeId] = useState(loadThemeId);
  const [syncEnabled, setSyncEnabled] = useState(loadSyncEnabled);
  const [authSession, setAuthSession] = useState(null);
  const [syncStatus, setSyncStatus] = useState(
    hasJournalSync() ? "signed-out" : "offline",
  );
  const [syncError, setSyncError] = useState("");
  const [isSyncing, setIsSyncing] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(entries));
  }, [entries]);

  useEffect(() => {
    window.localStorage.setItem(profileKey, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    window.localStorage.setItem(themeKey, themeId);
  }, [themeId]);

  useEffect(() => {
    window.localStorage.setItem(syncKey, String(syncEnabled));
  }, [syncEnabled]);

  useEffect(() => {
    if (!hasJournalSync() || !supabase) {
      setSyncStatus("offline");
      setIsAuthLoading(false);
      return undefined;
    }

    let active = true;

    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) {
          setAuthSession(data.session ?? null);
          setSyncStatus(data.session ? "signed-in" : "signed-out");
          setIsAuthLoading(false);
        }
      })
      .catch((err) => {
        console.error("Auth error:", err);
        if (active) setIsAuthLoading(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      setAuthSession(session ?? null);
      setSyncStatus(session ? "signed-in" : "signed-out");
      setIsAuthLoading(false);

      // Auto-enable sync when signing in for the first time
      if (session && !syncEnabled) {
        setSyncEnabled(true);
      }
    });

    return () => {
      active = false;
      data.subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (authSession && syncEnabled && syncStatus === "signed-in") {
      syncNow();
    }
  }, [authSession, syncEnabled]);

  const sortedEntries = useMemo(() => sortEntries(entries), [entries]);
  const stats = useMemo(() => statsFromEntries(sortedEntries), [sortedEntries]);
  const insights = useMemo(() => buildInsights(sortedEntries), [sortedEntries]);
  const theme = useMemo(() => getTheme(themeId), [themeId]);
  const entriesById = useMemo(
    () => new Map(sortedEntries.map((entry) => [entry.id, entry])),
    [sortedEntries],
  );

  function setTheme(themeValue) {
    if (journalThemes.some((item) => item.id === themeValue)) {
      setThemeId(themeValue);
    }
  }

  function updateProfile(nextProfile) {
    setProfile({
      name: nextProfile.name ?? defaultProfile.name,
      email: nextProfile.email ?? defaultProfile.email,
      bio: nextProfile.bio ?? defaultProfile.bio,
    });
  }

  async function createEntry(entryInput) {
    const nextEntry = normalizeEntry({
      ...entryInput,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      pinned: false,
    });

    const nextEntries = [nextEntry, ...entries];
    setEntries(nextEntries);

    if (syncEnabled && authSession && hasJournalSync()) {
      try {
        await pushRemoteEntries(authSession.user.id, nextEntries);
        setSyncStatus("synced");
      } catch (error) {
        setSyncStatus("error");
        setSyncError(error instanceof Error ? error.message : "Sync failed.");
      }
    }

    return nextEntry;
  }

  async function updateEntry(entryId, updates) {
    const nextEntries = entries.map((entry) =>
      entry.id === entryId
        ? normalizeEntry({
            ...entry,
            ...updates,
            updatedAt: new Date().toISOString(),
          })
        : entry,
    );
    setEntries(nextEntries);

    if (syncEnabled && authSession && hasJournalSync()) {
      try {
        await pushRemoteEntries(authSession.user.id, nextEntries);
        setSyncStatus("synced");
      } catch (error) {
        setSyncStatus("error");
        setSyncError(error instanceof Error ? error.message : "Sync failed.");
      }
    }
  }

  async function deleteEntry(entryId) {
    const nextEntries = entries.filter((entry) => entry.id !== entryId);
    setEntries(nextEntries);

    if (syncEnabled && authSession && hasJournalSync()) {
      try {
        await pushRemoteEntries(authSession.user.id, nextEntries);
        setSyncStatus("synced");
      } catch (error) {
        setSyncStatus("error");
        setSyncError(error instanceof Error ? error.message : "Sync failed.");
      }
    }
  }

  async function togglePin(entryId) {
    const nextEntries = entries.map((entry) =>
      entry.id === entryId
        ? {
            ...entry,
            pinned: !entry.pinned,
            updatedAt: new Date().toISOString(),
          }
        : entry,
    );
    setEntries(nextEntries);

    if (syncEnabled && authSession && hasJournalSync()) {
      try {
        await pushRemoteEntries(authSession.user.id, nextEntries);
        setSyncStatus("synced");
      } catch (error) {
        setSyncStatus("error");
      }
    }
  }

  function importEntries(rawValue) {
    const importedEntries = parseEntriesJson(rawValue);
    setEntries((currentEntries) =>
      mergeEntries(importedEntries, currentEntries),
    );
    return importedEntries.length;
  }

  function exportEntries() {
    return toJson(entries);
  }

  async function syncNow() {
    if (!authSession || !hasJournalSync() || !syncEnabled) {
      return { ok: false, message: "Sign in to enable sync." };
    }

    try {
      setIsSyncing(true);
      setSyncError("");
      const remoteEntries = await fetchRemoteEntries(authSession.user.id);
      const mergedEntries = mergeEntries(entries, remoteEntries);
      setEntries(mergedEntries);
      await pushRemoteEntries(authSession.user.id, mergedEntries);
      setSyncStatus("synced");
      return { ok: true, message: "Entries synced." };
    } catch (error) {
      const message = error instanceof Error ? error.message : "Sync failed.";
      setSyncStatus("error");
      setSyncError(message);
      return { ok: false, message };
    } finally {
      setIsSyncing(false);
    }
  }

  async function signIn(email, password) {
    const result = await signInWithEmail(email, password);
    return result;
  }

  async function signUp(email, password) {
    const result = await signUpWithEmail(email, password);
    return result;
  }

  async function signInWithGoogleProvider() {
    const result = await signInWithGoogle();
    return result;
  }

  async function logOut() {
    const result = await signOut();
    setAuthSession(null);
    setSyncStatus(hasJournalSync() ? "signed-out" : "offline");
    return result;
  }

  const value = {
    entries,
    sortedEntries,
    entriesById,
    stats,
    insights,
    theme,
    themeId,
    setTheme: setTheme,
    themeOptions: journalThemes,
    profile,
    updateProfile,
    createEntry,
    updateEntry,
    deleteEntry,
    togglePin,
    importEntries,
    exportEntries,
    syncEnabled,
    setSyncEnabled,
    authSession,
    authUser: authSession?.user ?? null,
    syncStatus,
    syncError,
    isSyncing,
    isAuthLoading,
    syncNow,
    signIn,
    signUp,
    signInWithGoogle: signInWithGoogleProvider,
    logOut,
    getEntryById: (entryId) => entriesById.get(entryId) ?? null,
  };

  return (
    <JournalContext.Provider value={value}>{children}</JournalContext.Provider>
  );
}

export function useJournal() {
  const context = useContext(JournalContext);

  if (!context) {
    throw new Error("useJournal must be used within a JournalProvider.");
  }

  return context;
}
