// src/pages/HealthPage.jsx   (YENÝ)
import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";

export default function HealthPage() {
    const [data, setData] = useState(null);
    const [err, setErr] = useState("");

    useEffect(() => {
        apiFetch("/admin/health/details-proxy")
            .then((r) => r.json())
            .then(setData)
            .catch((e) => setErr(String(e)));
    }, []);

    if (err) return <div style={{ color: "crimson" }}>Hata: {err}</div>;
    if (!data) return <div>Yükleniyor…</div>;

    const entries = Object.entries(data.entries || {});
    return (
        <div style={{ maxWidth: 900, margin: "30px auto", fontFamily: "Inter, system-ui" }}>
            <h1>System Health</h1>
            <div style={{ marginBottom: 16 }}>Overall: <strong>{data.status}</strong></div>

            {entries.map(([name, e]) => (
                <div key={name} style={{ padding: 12, marginBottom: 12, border: "1px solid #eee", borderRadius: 12 }}>
                    <div style={{ fontWeight: 600, marginBottom: 6 }}>{name}</div>
                    <div>Status: {e.status}</div>
                    <div>Duration: {e.duration} ms</div>
                    {e.data?.description ? <div>Desc: {e.data.description}</div> : null}
                </div>
            ))}
        </div>
    );
}
