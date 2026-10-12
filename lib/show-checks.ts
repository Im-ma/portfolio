/** Dev markers, and preview deploys when NEXT_PUBLIC_SHOW_CHECKS=1. */
export function showChecks() {
  return process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_SHOW_CHECKS === "1";
}

/** Editor annotations and design notes. Hidden unless the checks flag is set. */
export function showAnnotations() {
  return process.env.NEXT_PUBLIC_SHOW_CHECKS === "1";
}
