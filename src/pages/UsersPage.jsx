// src/pages/UsersPage.jsx
import React, { useEffect, useState } from "react";
import api from "../api";
import { getRole } from "../auth";
import { Link } from "react-router-dom";

const roleMap = { 0: "Admin", 1: "Chief", 2: "Manager", 3: "Staff" };
const asRoleText = (r) => (typeof r === "number" ? (roleMap[r] ?? r) : r);

export default function UsersPage() {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [err, setErr] = useState("");
    const role = getRole();

    const load = async () => {
        setLoading(true);
        setErr("");
        try {
            const res = await api.get("/User/users");
            setRows(res.data || []);
        } catch (e) {
            setErr("Kullanıcılar yüklenirken bir hata oluştu.");
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        load();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
                                <td>{u.username}</td>
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
