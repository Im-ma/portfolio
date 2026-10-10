"use client";

import { Button } from "@/components/button/button";
import { StatusTag } from "@/components/status-tag/status-tag";
import type { StoredNote } from "@/lib/notes";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./admin-notes.module.css";

export function NoteList({ notes, canWrite }: { notes: StoredNote[]; canWrite: boolean }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pendingId, setPendingId] = useState<string | null>(null);

  async function update(note: StoredNote, approved: boolean) {
    setError("");
    setPendingId(note.id);
    try {
      const response = await fetch("/api/admin/notes", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: note.id, approved }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "That did not go through. Try again in a moment.");
        return;
      }
      router.refresh();
    } catch {
      setError("That did not go through. Try again in a moment.");
    } finally {
      setPendingId(null);
    }
  }

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.refresh();
  }

  if (notes.length === 0) {
    return <p className={`${styles.empty} t-body-m`}>No notes yet.</p>;
  }

  return (
    <div>
      <div className={styles.actions}>
        <Button variant="secondary" onClick={logout}>
          Lock page
        </Button>
      </div>
      {error ? (
        <p className={`${styles.error} t-body-s`} role="alert">
          {error}
        </p>
      ) : null}
      <ul className={styles.list}>
        {notes.map((note) => (
          <li key={note.id} className={styles.card}>
            <div>
              <StatusTag status={note.approved ? "Approved" : "Waiting"} />
            </div>
            <p className="t-body-m">{note.body}</p>
            <p className={`${styles.meta} t-mono-small`}>
              {note.name}
              {note.page ? `, ${note.page}` : ""}, {note.createdAt.slice(0, 10)}, {note.color}
            </p>
            {canWrite ? (
              <div className={styles.actions}>
                <Button
                  variant={note.approved ? "secondary" : "primary"}
                  disabled={pendingId === note.id}
                  onClick={() => update(note, !note.approved)}
                >
                  {note.approved ? "Hide" : "Approve"}
                </Button>
              </div>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
