export type Shape = "land" | "wide" | "tall";

export type LayoutCard = {
  id: string;
  shape: Shape;
  caption: string;
};

export type PlacedCard = {
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotation: number;
  spin: number;
};

export type PileLayout = {
  pieces: PlacedCard[];
  design: { width: number; height: number };
};

const ASPECT: Record<Shape, number> = {
  land: 4 / 3,
  wide: 16 / 10,
  tall: 3 / 4,
};

/** Two columns on a phone, three on a tablet, five on a desktop so the pile stays loose. */
export function columnCount(width: number) {
  if (width < 680) return 2;
  if (width < 1020) return 3;
  return 5;
}

function mulberry32(seed: number) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let next = Math.imul(state ^ (state >>> 15), 1 | state);
    next = (next + Math.imul(next ^ (next >>> 7), 61 | next)) ^ next;
    return ((next ^ (next >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffle<T>(list: readonly T[], random: () => number) {
  const arr = list.slice();
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const swap = arr[i];
    arr[i] = arr[j] as T;
    arr[j] = swap as T;
  }
  return arr;
}

export function estimateCardHeight(shape: Shape, cardW: number, caption: string) {
  const photo = cardW / ASPECT[shape];
  const inner = Math.max(48, cardW - 28);
  const chars = Math.max(8, Math.floor(inner / 11));
  const lines = Math.min(4, Math.max(1, Math.ceil(caption.length / chars)));
  return Math.ceil(12 + photo + 8 + lines * 28 + 16);
}

function cardPixelWidth(shape: Shape, canvasW: number, cols: number) {
  const compact = canvasW < 680;
  const targetOverlap = compact ? 12 : 28;
  const tall = Math.round((targetOverlap * Math.max(1, cols - 1) + canvasW) / cols);
  const min = compact ? 156 : 210;
  const max = compact ? 200 : 280;
  const base = Math.min(max, Math.max(min, tall));
  const scale = shape === "wide" ? 1.12 : shape === "land" ? 1.06 : 1;
  return Math.min(Math.round(base * scale), Math.max(120, canvasW - 16));
}

/**
 * Scatter cards into columns with a little overlap, jitter, and tilt.
 * Positions come back as percentages of the pile, which is what the drag hook stores.
 */
export function layoutPile(
  items: readonly LayoutCard[],
  canvasW: number,
  seed: number,
  measured: Record<string, number> = {},
): PileLayout {
  const width = Math.max(1, Math.round(canvasW));
  const cols = columnCount(width);
  const random = mulberry32(seed);
  const order = shuffle(items, random);
  const compact = width < 680;
  const overlapY = compact ? 12 : 26;
  const jitter = compact ? 10 : 18;
  const colBottom = Array.from({ length: cols }, () => 8);
  let maxBottom = 0;

  const placed = order.map((item) => {
    const cardW = cardPixelWidth(item.shape, width, cols);
    const measuredH = measured[item.id] ?? 0;
    const cardH = measuredH > 40 ? measuredH : estimateCardHeight(item.shape, cardW, item.caption);
    let shortest = 0;
    for (let index = 1; index < colBottom.length; index += 1) {
      if ((colBottom[index] ?? 0) < (colBottom[shortest] ?? 0)) shortest = index;
    }
    const slot = (width - cardW) / Math.max(1, cols - 1);
    const jx = (random() * 2 - 1) * jitter;
    const jy = (random() * 2 - 1) * jitter * 0.55;
    let x = shortest * slot + jx;
    let y = (colBottom[shortest] ?? 0) + jy;
    x = Math.min(Math.max(0, x), Math.max(0, width - cardW));
    y = Math.max(0, y);
    const rotation = Math.round((random() * 11 - 5.5) * 100) / 100;
    const spin = Math.round((random() * 34 - 17) * 10) / 10;
    colBottom[shortest] = y + cardH - overlapY;
    maxBottom = Math.max(maxBottom, y + cardH);
    return { item, cardW, cardH, x, y, rotation, spin };
  });

  const designH = Math.max(1, Math.ceil(maxBottom + 28));
  return {
    design: { width, height: designH },
    pieces: placed.map((entry) => ({
      id: entry.item.id,
      x: (entry.x / width) * 100,
      y: (entry.y / designH) * 100,
      w: (entry.cardW / width) * 100,
      h: (entry.cardH / designH) * 100,
      rotation: entry.rotation,
      spin: entry.spin,
    })),
  };
}
