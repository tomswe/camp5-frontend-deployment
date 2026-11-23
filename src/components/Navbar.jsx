import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
    // Ambil data pengguna, status pengecekan autentikasi, dan fungsi logout dari AuthContext.
    const { user, loading, logout } = useAuth();
    // Gunakan useNavigate untuk mengarahkan pengguna setelah proses logout selesai.
    const navigate = useNavigate();

    // Jalankan logout terlebih dahulu, lalu ganti rute aktif ke halaman login.
    const handleLogout = async () => {
        await logout();
        navigate('/login', { replace: true });
    };

    const linkClass = ({ isActive }) =>
        `px-3 py-1.5 rounded-lg text-sm font-medium transition ${isActive ? 'bg-amber-100 text-amber-900' : 'text-gray-700 hover:bg-gray-100'
        }`;

    return (
        <header className="bg-white border-b border-gray-200 shadow-sm">
            <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                <Link to="/" className="text-xl font-extrabold text-amber-900">
                    ☕ Coffee Menu
                </Link>

                <div className="flex items-center gap-2">
                    <NavLink to="/" end className={linkClass}>Home</NavLink>

                    {/* Saat status login masih dicek, jangan tampilkan tombol apa pun agar tidak berkedip */}
                    {!loading && !user && (
                        <>
                            <NavLink to="/login" className={linkClass}>Login</NavLink>
                            <Link
                                to="/register"
                                className="bg-amber-800 hover:bg-amber-900 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition"
                            >
                                Register
                            </Link>
                        </>
                    )}

                    {!loading && user && (
                        <>
                            <span className="hidden sm:inline text-sm text-gray-500 ml-2">
                                {user.name} <span className="text-xs text-gray-400">({user.role})</span>
                            </span>
                            <button
                                onClick={handleLogout}
                                className="bg-red-50 hover:bg-red-100 text-red-600 px-4 py-1.5 rounded-lg text-sm font-medium transition"
                            >
                                Logout
                            </button>
                        </>
                    )}
                </div>
            </nav>
        </header>
    );
}