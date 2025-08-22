// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation, Link } from "react-router-dom";
import { getRoleFromToken, isLoggedIn } from "../auth";
import { motion } from "framer-motion";

function Forbidden({ allowed, role }) {
    return (
        <div className="container section">
            <motion.div
                className="card section"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.25, ease: "easeOut" }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div
                        style={{
                            width: 46, height: 46, borderRadius: 12, display: "grid", placeItems: "center",
                            background: "rgba(239,68,68,.15)", border: "1px solid rgba(239,68,68,.35)"
                        }}
                    >
                        {/* kilit ikonu */}
                        <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M6 10V7a6 6 0 1112 0v3h1a1 1 0 011 1v10a1 1 0 01-1 1H5a1 1 0 01-1-1V11a1 1 0 011-1h1Zm2 0h8V7a4 4 0 10-8 0v3Z" />
                        </svg>
                    </div>
                    <div>
                        <h3 style={{ margin: "0 0 4px 0" }}>Erişim reddedildi</h3>
                        <div className="muted">Bu sayfaya erişim yetkiniz yok.</div>
                    </div>
                </div>

                <div className="kv" style={{ marginTop: 12 }}>
                    <span>Rolünüz</span><b>{role || "-"}</b>
                    <span>Gerekli</span><b>{allowed.join(", ")}</b>
                </div>

                <div className="hstack" style={{ marginTop: 12, gap: 8 }}>
                    <Link to="/" className="btn btn--primary">Ana sayfa</Link>
                    <Link to="/users" className="btn btn--ghost">Kullanıcılar</Link>
                </div>
            </motion.div>
        </div>
    );
}

export default function ProtectedRoute({ allowed, children }) {
    const location = useLocation();

    // Giriş yoksa -> Login
    if (!isLoggedIn())
        return <Navigate to="/login" replace state={{ from: location.pathname }} />;

    const role = getRoleFromToken();

    // Giriş var ama yetki yoksa -> animasyonlu uyarı
    if (!role || !allowed.includes(role)) {
        return <Forbidden allowed={allowed} role={role} />;
    }

    // Yetkili -> hedef sayfayı göster
    return children;
}
