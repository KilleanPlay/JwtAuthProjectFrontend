import React, { useEffect, useState } from "react";
import api from "../api";
import { getRole } from "../auth";
import { Link } from "react-router-dom";

const roleMap = { 0: "Admin", 1: "Chief", 2: "Manager", 3: "Staff" };
const asRoleText = (r) => (typeof r === "number" ? (roleMap[r] ?? r) : r);

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
        <div className="container section">
            <div className="page-head">
                <h2>Kullanıcılar</h2>
                <span className="muted">Rolün: <b style={{ color: "#fff" }}>{role}</b></span>
            </div>

            {(role === "Admin" || role === "Manager") && (
                <p><Link to="/admin" className="btn btn--primary">→ Yönetim</Link></p>
            )}

            <div className="toolbar">
                <button className="btn" onClick={load}>Yenile</button>
            </div>

            {loading && <div className="card section">Yükleniyor…</div>}
            {err && <div className="card section" style={{ borderColor: "rgba(239,68,68,.4)" }}>{err}</div>}

            {!loading && !err && (
                <div className="table-wrap card">
                    <table className="table">
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
                                    <td>{u.email || <span className="muted">-</span>}</td>
                                    <td>{u.phone || <span className="muted">-</span>}</td>
                                </tr>
                            ))}
                            {rows.length === 0 && (
                                <tr>
                                    <td colSpan={5} style={{ textAlign: "center" }}>Kayıt bulunamadı.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}