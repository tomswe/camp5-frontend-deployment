import axios from "axios";

export const api = axios.create({
    baseURL: `https://camp5-backend-deployment.vercel.app/api`,
    withCredentials: true,
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
})

// Simpan promise refresh token untuk beberapa request 401
// Biar bisa bagi proses untuk refresh token saja
let refreshing = null

// Interceptor
// Suatu middleware id AXIOS
// kita bisa melakukan sesuatu sebelum kita hit ke API tersebut.
// Ada sebelum kita hit api ke backend kita bisa hit apinya ke auth
// Sesudah kita melakukan request utama kita bisa melakukan request lainnya.
api.interceptors.response.use(
    (res) => res,
    async (error) => {
        // Simpan konfigurasi request asli/request utama untuk dikirim ulang setelah refresh berhasil
        const original = error.config

        // Periksa apakah URL asli termasuk endpoint auth
        const isAuthCall = original?.url?.startsWith('/auth/')

        // Cek refresh ketika error 401
        if (error.response?.status === 401 && original && !original._retry && !isAuthCall) {

            original._retry = true

            // Percobaan untuk kita kirim ulang requestnya
            try {
                // Kita pakai refresh yang sedang berjalan jika ada.
                // Klo gada kita buat req ke /auth/refresh
                // terus kita hapus isinya setelah selesai
                refreshing ??= api.post('/auth/refresh').finally(() => { refreshing = null; });

                await refreshing

                return api(original)

            } catch (error) {

            }
        }
        return Promise.reject(error)
    }
)