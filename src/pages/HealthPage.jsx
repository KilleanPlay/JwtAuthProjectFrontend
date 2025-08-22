import React, { useEffect, useState } from "react";
import { apiFetch } from "../api";
import {
    ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
    PieChart, Pie, Cell,
} from "recharts";

const badge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("healthy")) return <span className="badge -ok">Healthy</span>;
    if (s.includes("degrad")) return <span className="badge -warn">Degraded</span>;
    return <span className="badge -bad">Unhealthy</span>;
};

// ---- Süre parse (TimeSpan veya "... ms" string → ms)
function parseDurationMs(val) {
    if (val == null) return 0;
    if (typeof val === "number") return val;
    let s = String(val).trim().replace(/ms$/i, "").trim();
    if (/^[0-9]+(\.[0-9]+)?$/.test(s)) return parseFloat(s);
    const m = s.match(/^(?:(\d+)\.)?(\d{1,2}):(\d{2}):(\d{2})(?:\.(\d+))?$/);
    if (m) {
        const days = m[1] ? parseInt(m[1], 10) : 0;
        const h = parseInt(m[2], 10);
        const mi = parseInt(m[3], 10);
        const sec = parseInt(m[4], 10);
        const frac = m[5] ? parseFloat("0." + m[5]) : 0;
        const totalSeconds = days * 86400 + h * 3600 + mi * 60 + sec + frac;
        return totalSeconds * 1000;
    }
    return 0;
}
function formatMs(ms) {
    if (ms < 1) return (ms * 1000).toFixed(2) + " µs";
    if (ms < 1000) return ms.toFixed(3) + " ms";
    return (ms / 1000).toFixed(2) + " s";
}

// ---- Uzun isimleri kısalt (camelCase/PascalCase/ayraçlı)
function shortenLabel(name, maxLen = 10) {
    const s = String(name || "").trim();
    if (s.length <= maxLen) return s;

    // camel/PascalCase -> baş harfleri birleştir (ApplicationWriteDbContext -> AppWriteDbCtx)
    const parts = s.match(/[A-Z]?[a-z]+|[A-Z]+(?![a-z])|\d+|[a-z]+/g);
    if (parts && parts.length > 1) {
        let candidate = parts
            .map((p, i) => (i === 0 ? p.slice(0, 3) : p[0])) // ilk parçadan biraz daha fazla al
            .join("");
        if (candidate.length > maxLen) candidate = candidate.slice(0, maxLen);
        if (candidate.length >= Math.min(4, maxLen)) return candidate;
    }

    // tire/altçizgi ayrımı varsa her parçadan 3 karakter
    if (/[-_\s]/.test(s)) {
        const tokenShort = s
            .split(/[-_\s]+/)
            .map(t => (t.length <= 3 ? t : t.slice(0, 3)))
            .join("-");
        if (tokenShort.length <= maxLen) return tokenShort;
    }

    // fallback: baş + … + son
    const head = Math.max(3, Math.floor((maxLen - 1) * 0.6));
    const tail = maxLen - 1 - head;
    return s.slice(0, head) + "…" + s.slice(-tail);
}

export default function HealthPage() {
    const [data, setData] = useState(null);
    const [err, setErr] = useState("");

    useEffect(() => {
        apiFetch("/admin/health/details-proxy")
            .then((r) => r.json())
            .then(setData)
            .catch((e) => setErr(String(e)));
    }, []);

    if (err) return <div className="container section card" style={{ color: "#fecaca", borderColor: "rgba(239,68,68,.4)" }}>Hata: {err}</div>;
    if (!data) return <div className="container section card">Yükleniyor…</div>;

    const entriesObj = data.entries || {};
    const entries = Object.entries(entriesObj);

    // --- kısa adlar (çakışmaları önlemek için benzersizleştir)
    const used = new Set();
    const uniqueShort = (full) => {
        let short = shortenLabel(full, 10);
        if (!used.has(short)) { used.add(short); return short; }
        let n = 2, base = short.replace(/[~#]\d+$/, "");
        while (used.has(`${base}~${n}`)) n++;
        short = `${base}~${n}`;
        used.add(short);
        return short;
    };

    // Bar verisi: { name: tam, short: kısa, ms }
    const durationData = entries.map(([name, e]) => ({
        name,
        short: uniqueShort(name),
        ms: parseDurationMs(e?.duration),
    }));

    // Pie verisi
    const counts = entries.reduce((acc, [, e]) => {
        const s = String(e?.status || "").toLowerCase();
        const key = s.includes("healthy") ? "Healthy" : s.includes("degrad") ? "Degraded" : "Unhealthy";
        acc[key] = (acc[key] || 0) + 1; return acc;
    }, {});
    const pieData = [
        { name: "Healthy", value: counts["Healthy"] || 0 },
        { name: "Degraded", value: counts["Degraded"] || 0 },
        { name: "Unhealthy", value: counts["Unhealthy"] || 0 },
    ];

    // kısa->tam legend metni (yalnızca kısaltılanları göster)
    const legend = durationData
        .filter(d => d.short !== d.name)
        .map(d => `${d.short} = ${d.name}`)
        .join(" · ");

    return (
        <div className="container section">
            <div className="page-head">
                <h2>System Health</h2>
                <div>{badge(data.status)}</div>
            </div>
            <div className="desc">Genel durum, süreler ve kontrol başına özet.</div>

            {/* --- DASHBOARD KARTI (GRAFİKLER) --- */}
            <div className="card section animate-pop">
                <h3 style={{ marginTop: 0, marginBottom: 10 }}>Dashboard</h3>
                <div className="health-charts">
                    {/* Süreler (Bar) */}
                    <div className="chart-item">
                        <div className="muted">Kontrol Süreleri (ms)</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={durationData} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeOpacity={0.12} vertical={false} />
                                <XAxis
                                    dataKey="short"
                                    interval={0}
                                    tick={{ fontSize: 12 }}
                                />
                                <YAxis
                                    domain={[0, "dataMax"]}
                                    tickFormatter={(v) => (v < 1 ? v.toFixed(3) : v >= 1000 ? (v / 1000).toFixed(1) + "k" : String(v))}
                                />
                                <Tooltip
                                    formatter={(v) => formatMs(Number(v))}
                                    // Tooltip başlığında kısa ad yerine TAM adı göster
                                    labelFormatter={(_, payload) => payload?.[0]?.payload?.name ?? ""}
                                />
                                <Bar dataKey="ms" fill="var(--brand)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                        {legend && (
                            <div className="muted" style={{ marginTop: 8, fontSize: 12, wordBreak: "break-word" }}>
                                {legend}
                            </div>
                        )}
                    </div>

                    {/* Durum Dağılımı (Pie) */}
                    <div className="chart-item">
                        <div className="muted">Durum Dağılımı</div>
                        <ResponsiveContainer width="100%" height={260}>
                            <PieChart>
                                <Tooltip formatter={(v, n) => [`${v}`, n]} />
                                <Pie data={pieData} dataKey="value" nameKey="name" innerRadius={60} outerRadius={90} paddingAngle={3}>
                                    <Cell fill="var(--ok)" />
                                    <Cell fill="var(--warn)" />
                                    <Cell fill="var(--bad)" />
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* --- DİĞER DETAY KARTLARI --- */}
            <div className="health-grid" style={{ marginTop: 12 }}>
                {entries.map(([name, e]) => {
                    const ms = parseDurationMs(e.duration);
                    return (
                        <div key={name} className="card health-card animate-pop">
                            <div className="hstack" style={{ justifyContent: 'space-between' }}>
                                <div style={{ fontWeight: 700 }}>{name}</div>
                                {badge(e.status)}
                            </div>
                            <div className="kv" style={{ marginTop: 8 }}>
                                <span>Süre</span><b>{formatMs(ms)}</b>
                                {e.data?.description && (<><span>Açıklama</span><b>{e.data.description}</b></>)}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
