import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

// Komponen ini menangani dua alur: login dan registrasi berdasarkan prop `mode`.
export default function AuthForm({ mode }) {
    // Tentukan mode formulir sehingga label, field, dan aksi dapat disesuaikan.
    const isLogin = mode === 'login';
    // Ambil fungsi autentikasi dari AuthContext.
    const { login, register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    // Setelah login, arahkan kembali ke halaman asal; jika tidak ada, gunakan halaman utama.
    const from = location.state?.from?.pathname || '/';

    // Simpan nilai input, pesan error, dan status proses pengiriman formulir.
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    // Field Name hanya ditampilkan pada mode registrasi, sedangkan Email dan Password selalu ada.
    const fields = [
        ...(isLogin ? [] : [{ name: 'name', label: 'Name', type: 'text' }]),
        { name: 'email', label: 'Email', type: 'email' },
        { name: 'password', label: 'Password', type: 'password' },
    ];

    // Sinkronkan perubahan setiap input ke state `form` berdasarkan atribut `name`.
    const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    // Kirim data berdasarkan mode: login memanggil `login`, registrasi memanggil `register`.
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Bersihkan error lama dan aktifkan status loading sebelum pemrosesan.
        setErrors({});
        setSubmitting(true);
        const result = isLogin ? await login(form.email, form.password) : await register(form);
        setSubmitting(false);
        // Login berhasil diarahkan ke halaman asal; registrasi berhasil diarahkan ke login.
        if (result.success) navigate(isLogin ? from : '/login', { replace: true });
        // Jika gagal, tampilkan error yang dikembalikan oleh fungsi autentikasi.
        else setErrors(result.errors);
    };

    return (
        <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 my-12">
            <h1 className="text-2xl font-bold mb-6">{isLogin ? 'Login' : 'Register'}</h1>

            {errors._form && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">{errors._form.join(' ')}</div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {fields.map(({ name, label, type }) => (
                    <div key={name}>
                        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                        <input
                            id={name} name={name} type={type} value={form[name]} onChange={handleChange}
                            autoComplete={name === 'password' ? (isLogin ? 'current-password' : 'new-password') : name}
                            className={`w-full border rounded-lg px-3 py-2 ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors[name]?.map((m, i) => <p key={i} className="text-red-600 text-xs mt-1">{m}</p>)}
                    </div>
                ))}
                <button
                    type="submit" disabled={submitting}
                    className="w-full bg-amber-800 hover:bg-amber-900 disabled:opacity-60 text-white py-2.5 rounded-lg font-medium transition"
                >
                    {submitting ? 'Please wait...' : isLogin ? 'Login' : 'Create account'}
                </button>
            </form>

            <p className="text-sm text-gray-500 mt-4 text-center">
                {isLogin ? <>No account? <Link to="/register" className="text-amber-800 underline">Register</Link></>
                    : <>Already registered? <Link to="/login" className="text-amber-800 underline">Login</Link></>}
            </p>
        </div>
    );
}