import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { apiFetch } from "../api";

const badge = (status) => {
    const s = String(status || "").toLowerCase();
    if (s.includes("healthy")) return <span className="badge -ok">Healthy</span>;
    if (s.includes("degrad")) return <span className="badge -warn">Degraded</span>;
    return <span className="badge -bad">Unhealthy</span>;
};

const variants = {
    fadeUp: { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0, transition: { duration: .4 } } },
    pop: { initial: { opacity: 0, scale: .96 }, animate: { opacity: 1, scale: 1, transition: { duration: .35 } } }
};

export default function Home() {
    const [health, setHealth] = useState(null);
    const [gallery, setGallery] = useState([]);
    const [preview, setPreview] = useState(null);

    // Parallax hafif efekt
    const { scrollY } = useScroll();
    const y1 = useTransform(scrollY, [0, 300], [0, -30]);
    const y2 = useTransform(scrollY, [0, 300], [0, -60]);

    useEffect(() => {
        // Health durumu (opsiyonel, hata olursa görmezden gel)
        apiFetch("/admin/health/details-proxy").then(r => r.json()).then(setHealth).catch(() => { });

        // Galeri (localStorage)
        const saved = localStorage.getItem("hc_gallery");
        if (saved) {
            try { setGallery(JSON.parse(saved)); } catch { }
        }
    }, []);

    const saveGallery = (arr) => {
        setGallery(arr);
        localStorage.setItem("hc_gallery", JSON.stringify(arr));
    };

    const onFiles = async (files) => {
        const list = Array.from(files).slice(0, 24);
        const results = await Promise.all(list.map(file => new Promise(res => {
            const reader = new FileReader();
            reader.onload = () => res({ id: (crypto?.randomUUID?.() || (Date.now() + "-" + Math.random())), name: file.name, dataUrl: reader.result });
            reader.readAsDataURL(file);
        })));
        saveGallery([...results, ...gallery]);
    };

    const removeItem = (id) => {
        saveGallery(gallery.filter(g => g.id !== id));
    };

    return (
        <div className="container section">
            {/* --- HERO --- */}
            <div className="hero card" style={{ position: "relative", overflow: "hidden" }}>
                <motion.div style={{ position: "absolute", inset: 0, y: y1, pointerEvents: "none" }}>
                    <div className="blob b1" />
                    <div className="blob b2" />
                    <div className="blob b3" />
                </motion.div>

                <motion.h1 className="hero-title" variants={variants.fadeUp} initial="initial" animate="animate">
                    HealthCheck+
                </motion.h1>
                <motion.p className="hero-sub" variants={variants.fadeUp} initial="initial" animate="animate">
                    .NET backend ve React frontend ile <b>rol bazlı</b> güvenli yönetim, gerçek zamanlı <b>Health</b> durumları ve şık bir arayüz.
                </motion.p>

                <motion.div className="hstack" style={{ gap: 10, flexWrap: "wrap" }} variants={variants.pop} initial="initial" animate="animate">
                    <Link to="/health" className="btn btn--primary">Health Dashboard</Link>
                    <Link to="/users" className="btn">Kullanıcılar</Link>
                    <Link to="/admin" className="btn btn--ghost">Admin Paneli</Link>
                    {health?.status && <span style={{ marginLeft: "auto" }}>{badge(health.status)}</span>}
                </motion.div>
            </div>

            {/* --- ÖZELLİKLER --- */}
            <div className="features-grid">
                {[
                    { t: "Rol Bazlı Erişim", d: "Admin/Manager korumalı sayfalar, JWT decode ile hızlı kontrol.", i: "🛡️" },
                    { t: "Health İzlencesi", d: "Servis, DB, Redis, Self dahil tüm kontroller tek ekranda.", i: "📈" },
                    { t: "Grafikler", d: "Süre bar grafiği ve durum pasta grafiği ile görünürlük.", i: "📊" },
                    { t: "Modern UI", d: "Glassmorphism, soft shadow, badge’ler ve animasyonlu geçişler.", i: "✨" },
                ].map((f, idx) => (
                    <motion.div key={idx} className="card feat" initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .3 }} transition={{ delay: idx * .06 }}>
                        <div className="feat-ico">{f.i}</div>
                        <div className="feat-title">{f.t}</div>
                        <div className="feat-desc">{f.d}</div>
                    </motion.div>
                ))}
            </div>

            {/* --- GALERİ (yükle/drag-drop) --- */}
            <motion.div className="card section" style={{ marginTop: 16 }} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="page-head"><h3 style={{ margin: 0 }}>Proje Galerisi</h3><span className="muted">Ekran görüntülerinizi buraya ekleyin</span></div>

                <div
                    className="dropzone"
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => { e.preventDefault(); onFiles(e.dataTransfer.files); }}
                >
                    <input
                        id="gallery-input"
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => onFiles(e.target.files)}
                        style={{ display: "none" }}
                    />
                    <label htmlFor="gallery-input" className="btn btn--ghost">+ Görsel Ekle</label>
                    <span className="muted" style={{ marginLeft: 8 }}>Sürükleyip bırakabilirsiniz</span>
                </div>

                {gallery.length === 0 ? (
                    <div className="muted" style={{ marginTop: 8 }}>Henüz görsel yok.</div>
                ) : (
                    <div className="gallery-grid">
                        {gallery.map(item => (
                            <motion.div key={item.id} className="img-card" whileHover={{ y: -4 }} onClick={() => setPreview(item)}>
                                <img src={item.dataUrl} alt={item.name} />
                                <div className="img-meta">
                                    <span className="name" title={item.name}>{item.name}</span>
                                    <button className="btn btn--ghost" onClick={(e) => { e.stopPropagation(); removeItem(item.id); }}>Sil</button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            {/* --- Modal --- */}
            {preview && (
                <motion.div className="modal" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPreview(null)}>
                    <motion.img src={preview.dataUrl} alt={preview.name} initial={{ scale: .92 }} animate={{ scale: 1 }} />
                </motion.div>
            )}
        </div>
    );
}