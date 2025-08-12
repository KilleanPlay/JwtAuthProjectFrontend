// src/App.js
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginForm from "./components/LoginForm"; // components (küçük)
import UsersPage from "./pages/UsersPage";
import AdminManage from "./pages/AdminManage";
import { isLoggedIn, getRole, logout } from "./auth";

function PrivateRoute({ children }) {
    return isLoggedIn() ? children : <Navigate to="/login" replace />;
}

function RoleRoute({ allowed, children }) {
    const r = getRole();
    return allowed.includes(r) ? children : <Navigate to="/users" replace />;
}

export default function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/login" element={<LoginForm />} />

                <Route
                    path="/users"
                    element={
                        <PrivateRoute>
                            <UsersPage />
                        </PrivateRoute>
                    }
                />

                <Route
                    path="/admin"
                    element={
                        <PrivateRoute>
                            <RoleRoute allowed={["Admin", "Manager"]}>
                                <AdminManage />
                            </RoleRoute>
                        </PrivateRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to={isLoggedIn() ? "/users" : "/login"} replace />}
                />
            </Routes>

            {isLoggedIn() && (
                <div style={{ position: "fixed", right: 16, bottom: 16 }}>
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = "/login";
                        }}
                    >
                        Çıkış Yap
                    </button>
                </div>
            )}
        </BrowserRouter>
    );
}
