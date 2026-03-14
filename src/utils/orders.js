const KEY = "perfume-orders";

export function saveOrder(order) {
  try {
    const existing = JSON.parse(localStorage.getItem(KEY) || "[]");
    localStorage.setItem(KEY, JSON.stringify([order, ...existing]));
  } catch {}
}

export function getOrders() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || "[]");
  } catch {
    return [];
  }
}
