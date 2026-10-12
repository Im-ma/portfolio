"use client";

import { createContext, useContext, useState } from "react";
import type { BuiltView } from "@/lib/built-views";
import styles from "./case-study.module.css";

const BuiltContext = createContext<BuiltView>("all");

export function useBuiltView() {
  return useContext(BuiltContext);
}

const options: { value: BuiltView; label: string }[] = [
  { value: "all", label: "All" },
  { value: "design", label: "Design view" },
  { value: "engineering", label: "Engineering view" },
];

export function BuiltToggle({ children }: { children: React.ReactNode }) {
  const [view, setView] = useState<BuiltView>("all");
  return (
    <BuiltContext.Provider value={view}>
      <div className={styles.views} role="radiogroup" aria-label="How I built it">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={view === option.value}
            className={`${styles.view} t-body-nav`}
            data-active={view === option.value ? "true" : undefined}
            onClick={() => setView(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
      {children}
    </BuiltContext.Provider>
  );
}
