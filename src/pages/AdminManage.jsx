// src/pages/AdminManage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";

export default function AdminManage() {
    const [rows, setRows] = useState([]);
    // Varsayılan: Staff (3). Formda email/phone opsiyonel.
    const [form, setForm] = useState({ username: "", password: "", role: 3, email: "", phone: "" });
    const [editId, setEditId] = useState(null);

    const load = () => api.get("/User/users").then(res => setRows(res.data));

    useEffect(() => { load(); }, []);

    const createUser = async (e) => {
        e.preventDefault();
        await api.post("/User/create", form);
        setForm({ username: "", password: "", role: 3, email: "", phone: "" });
        load();
    };

    const startEdit = (u) => {
        setEditId(u.id);
        setForm({
            username: u.username,
            password: "",               // güncellemede şifre opsiyonel
            role: typeof u.role === "number" ? u.role : (Number(u.role) || 3),
            email: u.email || "",
            phone: u.phone || ""
        });
    };

    const updateUser = async (e) => {
        e.preventDefault();
        await api.put(`/User/update/${editId}`, form);
        setEditId(null);
        setForm({ username: "", password: "", role: 3, email: "", phone: "" });
        load();
    };

    const remove = async (id) => {
        if (!window.confirm("Silinsin mi?")) return;
        await api.delete(`/User/delete/${id}`);
        load();
    };

    return (
        <div style={{ maxWidth: 900, margin: "40px auto" }}>
            <h2>Yönetim: Kullanıcı Ekle / Güncelle / Sil</h2>

            <form onSubmit={editId ? updateUser : createUser} style={{ display: "grid", gap: 8, maxWidth: 420 }}>
                <input
                    placeholder="Kullanıcı Adı"
                    value={form.username}
                    onChange={(e) => setForm({ ...form, username: e.target.value })}
                    required
                />
                <input
                    type="password"
                    placeholder={editId ? "Yeni Şifre (opsiyonel)" : "Şifre"}
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required={!editId}
                />
                <input
                    type="email"
                    placeholder="E-posta (opsiyonel)"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
                <input
                    type="tel"
                    placeholder="Telefon (opsiyonel)"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />

                {/* SIRALAMA SENİN DEDİĞİN GİBİ: Admin=0, Chief=1, Manager=2, Staff=3 */}
                <select
                    value={form.role}
                    onChange={(e) => setForm({ ...form, role: +e.target.value })}
                >
                    <option value={0}>Admin</option>
                    <option value={1}>Chief</option>
                    <option value={2}>Manager</option>
                    <option value={3}>Staff</option>
                </select>

                <div style={{ display: "flex", gap: 8 }}>
                    <button type="submit" style={{ flex: 1 }}>{editId ? "Güncelle" : "Ekle"}</button>
                    {editId && (
                        <button
                            type="button"
                            style={{ flex: 1 }}
                            onClick={() => { setEditId(null); setForm({ username: "", password: "", role: 3, email: "", phone: "" }); }}
                        >
                            İptal
                        </button>
                    )}
                </div>
            </form>

            <hr style={{ margin: "24px 0" }} />

            <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Kullanıcı Adı</th>
                        <th>Rol</th>
                        <th>E-posta</th>
                        <th>Telefon</th>
                        <th>İşlem</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map(u => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.username}</td>
                            <td>{typeof u.role === "number" ? u.role : u.role}</td>
                            <td>{u.email || "-"}</td>
                            <td>{u.phone || "-"}</td>
                            <td>
                                <button onClick={() => startEdit(u)}>Düzenle</button>{" "}
                                <button onClick={() => remove(u.id)}>Sil</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
