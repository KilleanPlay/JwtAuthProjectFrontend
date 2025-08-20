// src/App.js   (ROTA eklenmiş tam sürüm)
import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import LoginForm from "./components/LoginForm";
import UsersPage from "./pages/UsersPage";
import AdminManage from "./pages/AdminManage";
import HealthPage from "./pages/HealthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { clearToken, getRoleFromToken, isLoggedIn } from "./auth";
import "./App.css";

function Nav() {
    const logged = isLoggedIn();
    const role = getRoleFromToken();
    return (
        <div style={{ display: "flex", gap: 16, padding: "12px 20px", borderBottom: "1px solid #eee" }}>
            <Link to="/">Home</Link>
            <Link to="/users">Users</Link>
            {(role === "Admin" || role === "Manager") && <Link to="/health">Health</Link>}
            <div style={{ marginLeft: "auto" }}>
                {logged ? (
                    <button onClick={() => { clearToken(); window.location.href = "/login"; }}>Logout</button>
                ) : <Link to="/login">Login</Link>}
            </div>
        </div>
    );
}

export default function App() {
    return (
        <>
            <Nav />
            <Routes>
                <Route path="/" element={<div style={{ padding: 20 }}>Hoş geldin</div>} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/users" element={<UsersPage />} />
                <Route path="/admin" element={<AdminManage />} />
                <Route
                    path="/health"
                    element={
                        <ProtectedRoute allowed={["Admin", "Manager"]}>
                            <HealthPage />
                        </ProtectedRoute>
                    }
                />
            </Routes>
        </>
    );
}
