import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function AuthNav() {
    // Ambil status autentikasi dan fungsi logout dari AuthContext
    const { user, loading, logout } = useAuth();

    // Sembunyikan navigasi sementara status autentikasi sedang dimuat
    if (loading) return null;

    // Jika pengguna belum login, tampilkan tautan untuk login dan registrasi
    if (!user) {
        return (
            <div className="flex items-center gap-4 text-sm">
                <Link to="/login" className="hover:underline">Login</Link>
                <Link to="/register" className="hover:underline">Register</Link>
            </div>
        );
    }
    return (
        <div className="flex items-center gap-4 text-sm">
            <span>{user.name} ({user.role})</span>
            <button onClick={logout} className="text-red-600 hover:underline">Logout</button>
        </div>
    );
}