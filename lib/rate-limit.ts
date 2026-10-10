type Bucket = { hits: number[] };

const globalStore = globalThis as unknown as { __portfolioHits?: Map<string, Bucket> };

function store() {
  if (!globalStore.__portfolioHits) globalStore.__portfolioHits = new Map();
  return globalStore.__portfolioHits;
}

/** Best-effort limit per IP. Serverless instances do not share memory. */
export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const bucket = store().get(key) ?? { hits: [] };
  bucket.hits = bucket.hits.filter((stamp) => now - stamp < windowMs);
  if (bucket.hits.length >= limit) {
    store().set(key, bucket);
    return false;
  }
  bucket.hits.push(now);
  store().set(key, bucket);
  return true;
}

export function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0]?.trim() || "unknown";
  return request.headers.get("x-real-ip") || "unknown";
}
