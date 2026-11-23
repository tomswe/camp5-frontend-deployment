import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api.js';

const AuthContext = createContext(null)

// Pake Error dari server untuk pengecekan
const toErrors = (err) =>
    err.response?.data?.errors ?? {
        _form: [err.response?.data?.message || 'Could not reach the server.'],
    };

export function AuthProvider({ children }) {
    // simpan user
    const [user, setUser] = useState(null)

    // loading
    const [loading, setLoading] = useState(true)

    // fungsi pengecekan auth
    const checkAuth = useCallback(async () => {
        try {
            // cek apakah user sudah memiliki sesi
            const res = await api.post('/auth/me')
            setUser(res?.data?.data ?? null)

        } catch (error) {
            // hanya ketika refresh error 401
            if (error?.response?.status !== 401) return

            // coba untuk refresh sesinya sekali
            try {
                // coba refresh
                const res = await api.post('/auth/refresh')
                setUser(res?.data?.data ?? null)
            } catch (refreshError) {
                if (refreshError?.response?.status === 401) {
                    setUser(null)
                }
            }
        }
    }, [])

    useEffect(() => {
        checkAuth().finally(() => setLoading(false))
    }, [checkAuth])

    const login = useCallback(async (email, password) => {
        try {
            const res = await api.post('/auth/login', { email, password });
            // Sukses login memperbarui context sehingga seluruh komponen dapat langsung mengetahui pengguna aktif.
            setUser(res?.data?.data);
            return { success: true };
        } catch (err) {
            // Kegagalan dikembalikan sebagai objek agar form dapat menampilkan pesan error.
            return { success: false, errors: toErrors(err) };
        }
    }, []);

    const register = useCallback(async (data) => {
        try {
            await api.post('/auth/register', data);
            return { success: true };
        } catch (err) {
            return { success: false, errors: toErrors(err) };
        }
    }, []);

    const logout = useCallback(async () => {
        // Tetap hapus pengguna lokal meskipun permintaan logout ke server gagal.
        try { await api.post('/auth/logout'); } finally { setUser(null); }
    }, []);

    // Memoisasi nilai context agar provider tidak membuat object baru kecuali state atau fungsi berubah.
    const value = useMemo(
        () => ({ user, loading, login, register, logout }),
        [user, loading, login, register, logout]
    );

    // Provider membagikan data dan aksi autentikasi ke semua komponen turunannya.
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>');
    return ctx;
}