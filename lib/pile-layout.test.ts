import assert from "node:assert/strict";
import test from "node:test";
import { columnCount, layoutPile, type LayoutCard, type Shape } from "./pile-layout.ts";

function items(count: number): LayoutCard[] {
  const shapes: Shape[] = ["tall", "land", "wide"];
  return Array.from({ length: count }, (_, index) => ({
    id: `card-${index}`,
    shape: shapes[index % shapes.length] ?? "tall",
    caption: index % 5 === 0 ? "a birthday poster for Pastor Abraham" : "caught mid-smile",
  }));
}

test("columns stay loose on a phone, a tablet, and a desktop", () => {
  assert.equal(columnCount(390), 2);
  assert.equal(columnCount(800), 3);
  assert.equal(columnCount(1200), 5);
});

test("fifty four cards keep a slight tilt and spread across the row", () => {
  const laid = layoutPile(items(54), 1200, 42);
  assert.equal(laid.pieces.length, 54);
  assert.equal(new Set(laid.pieces.map((piece) => piece.id)).size, 54);
  for (const piece of laid.pieces) {
    assert.ok(piece.rotation >= -6 && piece.rotation <= 6);
    assert.ok(piece.x >= 0 && piece.x <= 100);
    assert.ok(piece.y >= 0 && piece.y <= 100);
    assert.ok(piece.w > 8 && piece.w < 40);
  }
  const xs = laid.pieces.map((piece) => piece.x);
  assert.ok(Math.max(...xs) - Math.min(...xs) > 40);
  assert.ok(laid.design.height > 1400);
  assert.ok(laid.design.height < 8000);
});

test("one seed always lays the pile out the same way", () => {
  const first = layoutPile(items(54), 1200, 7);
  const second = layoutPile(items(54), 1200, 7);
  assert.deepEqual(first, second);
  const other = layoutPile(items(54), 1200, 8);
  assert.notDeepEqual(
    first.pieces.map((piece) => piece.id),
    other.pieces.map((piece) => piece.id),
  );
});

test("measured heights make the pile taller", () => {
  const base = layoutPile(items(4), 1200, 1);
  const tall = layoutPile(items(4), 1200, 1, {
    "card-0": 800,
    "card-1": 800,
    "card-2": 800,
    "card-3": 800,
  });
  assert.ok(tall.design.height > base.design.height);
});
