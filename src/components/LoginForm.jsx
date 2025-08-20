// src/components/LoginForm.jsx
import React, { useState } from "react";
import { loginApi, getRoleFromToken } from "../auth";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        try {
            const token = await loginApi(username, password);
            const role = getRoleFromToken(token);
            if (role === "Admin" || role === "Manager") {
                window.location.href = "/health";
            } else {
                window.location.href = "/users";
            }
        } catch (err) {
            setError("Kullanıcı adı veya şifre hatalı.");
        }
    };

    return (
        <form onSubmit={submit} style={{ maxWidth: 360, margin: "80px auto" }}>
            <h2>Giriş Yap</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <input
                type="text"
                placeholder="Kullanıcı Adı"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                style={{ width: "100%", marginBottom: 8 }}
            />
            <input
                type="password"
                placeholder="Şifre"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={{ width: "100%", marginBottom: 8 }}
            />
            <button type="submit" style={{ width: "100%" }}>Giriş</button>
        </form>
    );
}
