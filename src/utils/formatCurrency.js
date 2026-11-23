const idr = new Intl.NumberFormat('id-ID', {
    currency: 'IDR',
    style: 'currency',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
})

export const formatRupiah = (value) => idr.format(Number(value) || 0)
