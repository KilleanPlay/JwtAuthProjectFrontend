import React, { useState } from "react";
import { loginApi, getRoleFromToken } from "../auth";

export default function LoginForm() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [busy, setBusy] = useState(false);

    const submit = async (e) => {
        e.preventDefault();
        setError("");
        setBusy(true);
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
        } finally { setBusy(false); }
    };

    return (
        <div className="login-wrapper card animate-pop">
            <form onSubmit={submit} className="vstack">
                <h2 className="login-title">Giriş Yap</h2>
                {error && <div className="alert">{error}</div>}

                <div className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 12c2.761 0 5-2.239 5-5s-2.239-5-5-5-5 2.239-5 5 2.239 5 5 5Zm0 2c-3.866 0-7 2.239-7 5v1h14v-1c0-2.761-3.134-5-7-5Z" fill="currentColor" />
                    </svg>
                    <input className="input" type="text" placeholder="Kullanıcı Adı" value={username} onChange={(e) => setUsername(e.target.value)} required />
                </div>

                <div className="input-icon">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M6 10V7a6 6 0 1112 0v3h1a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V11a1 1 0 011-1h1Zm2 0h8V7a4 4 0 10-8 0v3Z" fill="currentColor" />
                    </svg>
                    <input className="input" type="password" placeholder="Şifre" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>

                <button type="submit" className="btn btn--primary" disabled={busy}>{busy ? "Giriş yapılıyor…" : "Giriş"}</button>
            </form>
        </div>
    );
}