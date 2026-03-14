const KEY = "perfume-recently-viewed";
const MAX = 6;

export function addToRecentlyViewed(productId) {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || "[]");
    const filtered = existing.filter((id) => id !== productId);
    const updated = [productId, ...filtered].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(updated));
  } catch {}
}

export function getRecentlyViewedIds() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
