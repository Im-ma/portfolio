let locks = 0;
let previous = "";

/** Keep the page from scrolling while one or more overlays are open. */
export function lockScroll() {
  if (typeof document === "undefined") return () => {};
  if (locks === 0) {
    previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
  }
  locks += 1;
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks = Math.max(0, locks - 1);
    if (locks === 0) document.body.style.overflow = previous;
  };
}
