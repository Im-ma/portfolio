"use client";

import { Button } from "@/components/button/button";
import { useRouter } from "next/navigation";
import { useState } from "react";
import styles from "./admin-notes.module.css";

export function LoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setError("");
    try {
      const response = await fetch("/api/admin/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await response.json()) as { ok?: boolean; error?: string };
      if (!response.ok || !data.ok) {
        setError(data.error || "That password does not match.");
        return;
      }
      router.refresh();
    } catch {
      setError("That did not go through. Try again in a moment.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      <div className={styles.field}>
        <label className="t-mono-label" htmlFor="admin-password">
          PASSWORD
        </label>
        <input
          id="admin-password"
          className={`${styles.input} t-body-s`}
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
      </div>
      <Button type="submit" disabled={pending}>
        {pending ? "Checking" : "Unlock notes"}
      </Button>
      {error ? (
        <p className={`${styles.error} t-body-s`} role="alert">
          {error}
        </p>
      ) : null}
    </form>
  );
}
