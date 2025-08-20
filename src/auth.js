// src/auth.js
import { jwtDecode } from "jwt-decode";

// .env desteği: URL -> BASE -> varsayılan
export const API_BASE =
    process.env.REACT_APP_API_URL ||
    process.env.REACT_APP_API_BASE ||
    "https://localhost:5001";

const TOKEN_KEY = "token";

export async function loginApi(username, password) {
    const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const { token } = await res.json();
    saveToken(token);
    return token;
}

export function saveToken(token) { localStorage.setItem(TOKEN_KEY, token); }
export function getToken() { return localStorage.getItem(TOKEN_KEY); }
export function clearToken() { localStorage.removeItem(TOKEN_KEY); }

export function getRoleFromToken(token = getToken()) {
    if (!token) return null;
    try {
        const d = jwtDecode(token);
        return d.role ?? d["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ?? null;
    } catch {
        return null;
    }
}

// 🔽 Geriye dönük uyumluluk: eski kod "getRole" istiyor
export function getRole(token = getToken()) {
    return getRoleFromToken(token);
}

export function isLoggedIn() {
    return !!getToken();
}
