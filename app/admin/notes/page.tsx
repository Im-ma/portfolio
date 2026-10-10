import { Footer } from "@/components/footer/footer";
import { adminConfigured, isAdmin } from "@/lib/admin-auth";
import { getAllNotes } from "@/lib/notes";
import { supabaseMode } from "@/lib/supabase";
import type { Metadata } from "next";
import { LoginForm } from "./login-form";
import { NoteList } from "./note-list";
import styles from "./admin-notes.module.css";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Notes",
  robots: { index: false, follow: false },
};

export default async function AdminNotesPage() {
  const mode = supabaseMode();
  const configured = adminConfigured();
  const authed = configured ? await isAdmin() : false;
  const notes = authed ? await getAllNotes() : [];

  return (
    <>
      <main id="content" className={styles.main}>
        <div className="shell">
          <p className="t-mono-label">NOTES</p>
          <h1 className="t-display-h1-case">Approve the wall</h1>
          <p className={`${styles.lead} t-body-l`}>
            New notes arrive unapproved. After you approve one, it can show on the note wall
            without a new deploy.
          </p>
          {!configured ? (
            <p className={`${styles.lead} t-body-m`}>
              This page stays locked until ADMIN_PASSWORD is set. You can also approve notes in
              the Supabase dashboard by setting approved to true. The table SQL is in the README.
            </p>
          ) : null}
          {configured && !authed ? <LoginForm /> : null}
          {authed && mode === "off" ? (
            <p className={`${styles.lead} t-body-m`}>
              Supabase is not connected yet, so there is nothing to list. Add the URL and keys
              from .env.example.
            </p>
          ) : null}
          {authed && mode === "anon" ? (
            <p className={`${styles.lead} t-body-m`}>
              The anon key can read approved notes. Approving from here needs the service role
              key. Until then, flip approved in the Supabase dashboard.
            </p>
          ) : null}
          {authed && mode !== "off" ? <NoteList notes={notes} canWrite={mode === "service"} /> : null}
        </div>
      </main>
      <Footer />
    </>
  );
}
