// src/pages/UsersPage.jsx  (ÜZERİNE YAZ)
import React, { useEffect, useState } from "react";
import api from "../api";
import { getRole } from "../auth";
import { Link } from "react-router-dom";

const roleMap = { 0: "Admin", 1: "Chief", 2: "Manager", 3: "Staff" };
const asRoleText = (r) => (typeof r === "number" ? (roleMap[r] ?? r) : r);

// Her türlü JSON şekline uyumlu normalizasyon:
//  - [ ... ]  (dizi)
//  - { users: [...] }
//  - { $values: [...] }     (bazı serializer'lar)
//  - { data: [...] }, { result: [...] }
function toArray(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.users)) return data.users;
    if (Array.isArray(data?.$values)) return data.$values;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
}

export default function UsersPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const role = getRole();

    const load = async () => {
        setLoading(true);
        setErr("");
        try {
            // fetch-tabanlı api: r.json() ile gövdeyi al
            const r = await api.get("/User/users");
            const raw = await r.json();
            const list = toArray(raw);
            setRows(list);
        } catch (e) {
            console.error(e);
            setErr("Kullanıcılar yüklenirken bir hata oluştu.");
            setRows([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    return (
        <div style={{ maxWidth: 980, margin: "40px auto" }}>
            <h2>Kullanıcılar</h2>
            <p>Rolün: <b>{role}</b></p>

            {(role === "Admin" || role === "Manager") && (
                <p><Link to="/admin">→ Yönetim (Ekle/Güncelle/Sil)</Link></p>
            )}

            <div style={{ marginBottom: 12 }}>
                <button onClick={load}>Yenile</button>
            </div>

            {loading && <p>Yükleniyor...</p>}
            {err && <p style={{ color: "red" }}>{err}</p>}

            {!loading && !err && (
                <table width="100%" border="1" cellPadding="6" style={{ borderCollapse: "collapse" }}>
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Kullanıcı Adı</th>
                            <th>Rol</th>
                            <th>E-posta</th>
                            <th>Telefon</th>
                        </tr>
                    </thead>
                    <tbody>
                        {rows.map((u) => (
                            <tr key={u.id}>
                                <td>{u.id}</td>
                                <td>{u.username ?? u.userName ?? u.name}</td>
                                <td>{asRoleText(u.role)}</td>
                                <td>{u.email || "-"}</td>
                                <td>{u.phone || "-"}</td>
                            </tr>
                        ))}
                        {rows.length === 0 && (
                            <tr>
                                <td colSpan={5} style={{ textAlign: "center" }}>Kayıt bulunamadı.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            )}
        </div>
    );
}
