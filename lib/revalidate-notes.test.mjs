import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";

const walls = readFileSync(new URL("./revalidate-notes.ts", import.meta.url), "utf8");
const admin = readFileSync(new URL("../app/api/admin/notes/route.ts", import.meta.url), "utf8");
const pub = readFileSync(new URL("../app/api/notes/route.ts", import.meta.url), "utf8");

test("note walls are the homepage and gatherings", () => {
  assert.match(walls, /"\/"/);
  assert.match(walls, /"\/gatherings"/);
  assert.match(walls, /revalidatePath\(path\)/);
});

test("admin approve and hide expire the walls only after the write succeeds", () => {
  const failed = admin.indexOf("Could not update note");
  const expire = admin.lastIndexOf("revalidateNoteWalls()");
  assert.ok(failed > 0);
  assert.ok(expire > failed);
});

test("public submissions stay unapproved and do not touch the page cache", () => {
  assert.match(pub, /approved:\s*false/);
  assert.equal(pub.includes("revalidate"), false);
});
