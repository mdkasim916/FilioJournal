import { hasSupabaseConfig, supabase } from "./supabase";

const entriesTable = "journal_entries";

export function hasJournalSync() {
  return Boolean(hasSupabaseConfig && supabase);
}

export function mapRemoteEntry(record) {
  const createdAt = record.created_at ?? record.createdAt ?? new Date().toISOString();

  return {
    id: record.id,
    title: record.title ?? "Untitled",
    body: record.body ?? "",
    mood: record.mood ?? "reflective",
    tags: Array.isArray(record.tags) ? record.tags : [],
    createdAt,
    updatedAt: record.updated_at ?? record.updatedAt ?? createdAt,
    isPrivate: Boolean(record.is_private ?? record.isPrivate),
    pinned: Boolean(record.pinned),
  };
}

export function mapLocalEntry(userId, entry) {
  return {
    id: entry.id,
    user_id: userId,
    title: entry.title,
    body: entry.body,
    mood: entry.mood,
    tags: entry.tags,
    created_at: entry.createdAt,
    updated_at: entry.updatedAt ?? entry.createdAt,
    is_private: entry.isPrivate,
    pinned: entry.pinned,
  };
}

export async function fetchRemoteEntries(userId) {
  if (!hasJournalSync()) {
    return [];
  }

  const { data, error } = await supabase
    .from(entriesTable)
    .select("*")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []).map(mapRemoteEntry);
}

export async function pushRemoteEntries(userId, entries) {
  if (!hasJournalSync()) {
    return [];
  }

  const payload = entries.map((entry) => mapLocalEntry(userId, entry));
  const { error } = await supabase.from(entriesTable).upsert(payload, {
    onConflict: "id",
  });

  if (error) {
    throw error;
  }

  return payload;
}

export async function signInWithEmail(email, password) {
  if (!hasJournalSync()) {
    throw new Error("Supabase is not configured for this workspace.");
  }

  return supabase.auth.signInWithPassword({ email, password });
}

export async function signUpWithEmail(email, password) {
  if (!hasJournalSync()) {
    throw new Error("Supabase is not configured for this workspace.");
  }

  return supabase.auth.signUp({ email, password });
}

export async function signInWithGoogle() {
  if (!hasJournalSync()) {
    throw new Error("Supabase is not configured for this workspace.");
  }

  return supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: window.location.origin,
    },
  });
}

export async function signOut() {
  if (!hasJournalSync()) {
    return { error: null };
  }

  return supabase.auth.signOut();
}
