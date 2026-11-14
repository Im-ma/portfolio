import { revalidatePath } from "next/cache";

/** Pages that bake approved notes into the response. */
export const NOTE_WALL_PATHS = ["/", "/off-the-clock"] as const;

/**
 * Drop the cached homepage and Off the clock page.
 * The next visit renders again and reads Supabase. Other pages stay cached.
 */
export function revalidateNoteWalls() {
  for (const path of NOTE_WALL_PATHS) {
    revalidatePath(path);
  }
}
