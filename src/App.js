import React from "react";
import { Routes, Route, NavLink, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import LoginForm from "./components/LoginForm";
import UsersPage from "./pages/UsersPage";
import AdminManage from "./pages/AdminManage";
import HealthPage from "./pages/HealthPage";
import ProtectedRoute from "./components/ProtectedRoute";
import { clearToken, getRoleFromToken, isLoggedIn } from "./auth";
import "./App.css";
import Home from "./pages/Home";

function Nav() {
    const logged = isLoggedIn();
    const role = getRoleFromToken();
    return (
        <div className="nav">
            <div className="nav-inner container">
                <div className="brand">HealthCheck+</div>
                <NavLink to="/" className={({ isActive }) => isActive ? "is-active" : ""}>Home</NavLink>
                <NavLink to="/users" className={({ isActive }) => isActive ? "is-active" : ""}>Users</NavLink>
                {(role === "Admin" || role === "Manager") && (
                    <NavLink to="/health" className={({ isActive }) => isActive ? "is-active" : ""}>Health</NavLink>
                )}
                <div className="nav-spacer" />
                {logged ? (
                    <button className="btn btn--ghost" onClick={() => { clearToken(); window.location.href = "/login"; }}>Logout</button>
                ) : (
                    <NavLink to="/login" className={({ isActive }) => isActive ? "is-active" : ""}>Login</NavLink>
                )}
            </div>
        </div>
    );
}

// Tek noktadan sayfa animasyonu
const Page = ({ children }) => (
    <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
    >
        {children}
    </motion.div>
);

export default function App() {
    const location = useLocation();
    return (
        <>
            <Nav />
            <AnimatePresence mode="wait">
                <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Page><Home /></Page>} />
                    <Route path="/login" element={<Page><LoginForm /></Page>} />

                    {/* Users -> GİRİŞ ZORUNLU (her rol erişebilir) */}
                    <Route
                        path="/users"
                        element={
                            <ProtectedRoute allowed={["Admin", "Chief", "Manager", "Staff"]}>
                                <Page><UsersPage /></Page>
                            </ProtectedRoute>
                        }
                    />

                    {/* Admin -> GİRİŞ + YETKİ (Admin/Manager) */}
                    <Route
                        path="/admin"
                        element={
                            <ProtectedRoute allowed={["Admin", "Manager"]}>
                                <Page><AdminManage /></Page>
                            </ProtectedRoute>
                        }
                    />

                    {/* Health zaten korunuyordu */}
                    <Route
                        path="/health"
                        element={
                            <ProtectedRoute allowed={["Admin", "Manager"]}>
                                <Page><HealthPage /></Page>
                            </ProtectedRoute>
                        }
                    />
                </Routes>
            </AnimatePresence>
        </>
    );
}