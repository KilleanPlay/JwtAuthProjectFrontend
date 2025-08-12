import { jwtDecode } from "jwt-decode";
import api from "./api";

export const loginApi = async (username, password) => {
    const { data } = await api.post("/login", { username, password });
    localStorage.setItem("token", data.token);
    return data;
};

export const logout = () => localStorage.removeItem("token");
export const isLoggedIn = () => !!localStorage.getItem("token");

export const getRole = () => {
    const t = localStorage.getItem("token");
    if (!t) return null;
    try {
        const d = jwtDecode(t); // ✅ burada değişti
        return (
            d["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ||
            d.role ||
            null
        );
    } catch {
        return null;
    }
};
