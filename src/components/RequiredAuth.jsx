import React from 'react';
import { Navigate, replace, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';


export default function RequiredAuth({ role, children }) {
    const { user, loading } = useAuth()
    const location = useLocation()
    // Alur 1
    // Cek auth sedang berjalan
    // set loading screen
    if (loading) return <div className="p-6 text-center">Loading...</div>;

    // alur 2 paksa user tidak bisa kehalaman sebelumnya yang perlu login terlebih dahulu
    if (!user) return <Navigate to={'/login'} state={{ form: location }} replace />

    // Cek rolenya
    if (role && user.role !== role) {
        return (
            <div className="max-w-xl mx-auto text-center p-10">
                <h1 className="text-2xl font-bold mb-2">403 Forbidden</h1>
                <p className="text-gray-600">You don't have access to this page.</p>
            </div>
        );
    }

    // alur 4 berhasil login
    return children
}
