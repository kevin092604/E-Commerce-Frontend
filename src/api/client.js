const BASE = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

function getToken() {
  return localStorage.getItem("perfume-token");
}

async function request(endpoint, options = {}) {
  const token = getToken();
  const headers = { ...options.headers };

  // Only set Content-Type for JSON (not for FormData)
  if (!(options.body instanceof FormData)) {
    headers["Content-Type"] = "application/json";
  }
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${endpoint}`, { ...options, headers });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: "Error de servidor" }));
    throw new Error(err.message || "Error de servidor");
  }
  return res.json();
}

export const api = {
  get:    (url)       => request(url),
  post:   (url, data) => request(url, { method: "POST", body: data instanceof FormData ? data : JSON.stringify(data) }),
  put:    (url, data) => request(url, { method: "PUT",  body: data instanceof FormData ? data : JSON.stringify(data) }),
  patch:  (url, data) => request(url, { method: "PATCH", body: JSON.stringify(data) }),
  delete: (url)       => request(url, { method: "DELETE" }),
};
