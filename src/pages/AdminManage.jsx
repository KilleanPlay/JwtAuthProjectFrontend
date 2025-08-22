import React, { useEffect, useState } from "react";
import api from "../api";

const DEFAULT_ROLES = ["Admin", "Chief", "Manager", "Staff"];
const ROLE_TO_INT = { Admin: 0, Chief: 1, Manager: 2, Staff: 3 };

function toArray(data) {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.users)) return data.users;
    if (Array.isArray(data?.$values)) return data.$values;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.result)) return data.result;
    return [];
}

export default function AdminManage() {
    const [users, setUsers] = useState([]);
    const [roles] = useState(DEFAULT_ROLES);
    const [err, setErr] = useState("");

    const emptyForm = { id: 0, username: "", password: "", role: "Staff", email: "", phone: "" };
    const [form, setForm] = useState(emptyForm);
    const [mode, setMode] = useState("create");

    const load = async () => {
        setErr("");
        try {
            const r = await api.get("/User/users");
            const raw = await r.json();
            setUsers(toArray(raw));
        } catch (e) {
            console.error(e);
            setErr("Kullanıcı listesi alınamadı.");
            setUsers([]);
        }
    };

    useEffect(() => { load(); }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setForm((f) => ({ ...f, [name]: value }));
    };

    const submitCreate = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const payload = { ...form };
            if (!payload.password) delete payload.password;
            payload.role = ROLE_TO_INT[payload.role] ?? payload.role;
            await api.post("/User/users", payload);
            setForm(emptyForm);
            await load();
        } catch (e) {
            console.error(e);
            setErr("Ekleme sırasında hata oluştu.");
        }
    };

    const submitUpdate = async (e) => {
        e.preventDefault();
        setErr("");
        try {
            const payload = { ...form };
            if (!payload.password) delete payload.password;
            payload.role = ROLE_TO_INT[payload.role] ?? payload.role;
            await api.put(`/User/users/${form.id}`, payload);
            setForm(emptyForm);
            setMode("create");
            await load();
        } catch (e) {
            console.error(e);
            setErr("Güncelleme sırasında hata oluştu.");
        }
    };

    const editUser = (u) => {
        let roleText = u.role;
        if (typeof u.role === "number") {
            const map = ["Admin", "Chief", "Manager", "Staff"];
            roleText = map[u.role] ?? "Staff";
        }
        setForm({
            id: u.id,
            username: u.username ?? u.userName ?? "",
            password: "",
            role: roleText,
            email: u.email ?? "",
            phone: u.phone ?? ""
        });
        setMode("edit");
        window.scrollTo(0, 0);
    };

    const deleteUser = async (id) => {
        if (!window.confirm("Silinsin mi?")) return;
        setErr("");
        try {
            await api.delete(`/User/users/${id}`);
            await load();
        } catch (e) {
            console.error(e);
            setErr("Silme sırasında hata oluştu.");
        }
    };

    return (
        <div className="container section">
            <h2 style={{ marginBottom: 12 }}>Admin Paneli</h2>
            {err && <div className="alert" style={{ marginBottom: 12 }}>{err}</div>}

            <form onSubmit={mode === "create" ? submitCreate : submitUpdate} className="card section">
                <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr" }}>
                    <div>
                        <label className="muted">Kullanıcı Adı</label>
                        <input name="username" className="input" value={form.username} onChange={onChange} required />
                    </div>
                    <div>
                        <label className="muted">Şifre {mode === "edit" && <small>(boş bırakılabilir)</small>}</label>
                        <input name="password" type="password" className="input" value={form.password} onChange={onChange} />
                    </div>
                    <div>
                        <label className="muted">Rol</label>
                        <select name="role" className="input" value={form.role} onChange={onChange}>
                            {roles.map((r) => <option key={r} value={r}>{r}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="muted">Email</label>
                        <input name="email" className="input" value={form.email} onChange={onChange} />
                    </div>
                    <div>
                        <label className="muted">Telefon</label>
                        <input name="phone" className="input" value={form.phone} onChange={onChange} />
                    </div>
                </div>
                <div className="hstack" style={{ marginTop: 12 }}>
                    {mode === "create" ? (
                        <button className="btn btn--primary" type="submit">Ekle</button>
                    ) : (
                        <>
                            <button className="btn btn--primary" type="submit">Güncelle</button>
                            <button className="btn btn--ghost" type="button" onClick={() => { setForm(emptyForm); setMode("create"); }}>Vazgeç</button>
                        </>
                    )}
                </div>
            </form>

            <h3 style={{ marginTop: 16, marginBottom: 10 }}>Mevcut Kullanıcılar</h3>
            {users.length === 0 ? (
                <div className="card section">Kayıt bulunamadı.</div>
            ) : (
                <div className="table-wrap card">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Id</th><th>Kullanıcı Adı</th><th>Rol</th><th>Email</th><th>Telefon</th><th>İşlem</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map((u) => (
                                <tr key={u.id}>
                                    <td>{u.id}</td>
                                    <td>{u.username ?? u.userName ?? u.name}</td>
                                    <td>{typeof u.role === "number" ? (["Admin", "Chief", "Manager", "Staff"][u.role] ?? u.role) : u.role}</td>
                                    <td>{u.email}</td>
                                    <td>{u.phone}</td>
                                    <td style={{ whiteSpace: "nowrap" }}>
                                        <button className="btn" onClick={() => editUser(u)}>Düzenle</button>{" "}
                                        <button className="btn btn--danger" onClick={() => deleteUser(u.id)}>Sil</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}