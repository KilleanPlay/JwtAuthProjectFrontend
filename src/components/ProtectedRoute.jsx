// src/components/ProtectedRoute.jsx   (YENÝ)
import React from "react";
import { Navigate } from "react-router-dom";
import { getRoleFromToken, isLoggedIn } from "../auth";

export default function ProtectedRoute({ allowed, children }) {
    if (!isLoggedIn()) return <Navigate to="/login" replace />;
    const role = getRoleFromToken();
    if (!role || !allowed.includes(role)) return <Navigate to="/" replace />;
    return children;
}
