// src/api.js
export const API_BASE =
    process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_API_BASE ||
    "https://localhost:5001";

export async function apiFetch(path, options = {}) {
    const token = localStorage.getItem("token");

    const headers = { ...(options.headers || {}) };
    let body = options.body;

    // Gövde FormData değilse JSON'a çevir + Content-Type ata
    if (body && !(body instanceof FormData)) {
        if (typeof body !== "string") body = JSON.stringify(body);
        if (!headers["Content-Type"]) headers["Content-Type"] = "application/json";
    }

    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(`${API_BASE}${path}`, { ...options, headers, body });
    if (!res.ok) {
        const msg = await res.text().catch(() => "");
        throw new Error(`HTTP ${res.status} ${msg}`.trim());
    }
    return res;
}

// ---- Yardımcılar ----
async function getJson(path, options) {
    const res = await apiFetch(path, options);
    const ct = res.headers.get("content-type") || "";
    if (ct.includes("application/json")) return res.json();
    const text = await res.text().catch(() => "");
    throw new Error(`Beklenmeyen içerik türü: ${ct}. Örnek gövde: ${text.slice(0, 200)}`);
}

export function normalizeUsers(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.users)) return data.users;
    if (Array.isArray(data?.$values)) return data.$values;    // bazı serializer'lar
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
}

// Önce /users, olmazsa /api/users
export async function listUsers() {
    try {
        const raw = await getJson("/users");
        console.log("RAW /users:", raw);
        return normalizeUsers(raw);
    } catch (e1) {
        const raw = await getJson("/api/users");
        console.log("RAW /api/users:", raw);
        return normalizeUsers(raw);
    }
}

// ---- Eski kod uyumluluğu için default export ----
const api = {
    get: (path, options) => apiFetch(path, { ...(options || {}), method: "GET" }),
    post: (path, body, options) => apiFetch(path, { ...(options || {}), method: "POST", body }),
    put: (path, body, options) => apiFetch(path, { ...(options || {}), method: "PUT", body }),
    patch: (path, body, options) => apiFetch(path, { ...(options || {}), method: "PATCH", body }),
    delete: (path, options) => apiFetch(path, { ...(options || {}), method: "DELETE" })
};

export default api;
