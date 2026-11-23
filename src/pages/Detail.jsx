import React from 'react';
import { useLoaderData, Link } from 'react-router-dom';
import { formatRupiah } from '../utils/formatCurrency';
import { useAuth } from '../context/AuthContext';

export default function Detail() {
    const { product } = useLoaderData();
    const { user } = useAuth()

    return (
        <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 my-12">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.product_name}</h1>
            <p className="text-gray-500 text-sm mb-6">Slug: {product.product_slug}</p>

            <div className="grid grid-cols-2 gap-4 bg-amber-50 p-6 rounded-lg mb-6">
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Price</p>
                    <p className="text-2xl font-black text-amber-900">{formatRupiah(product.price)}</p>
                </div>
                <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Stock Quantity</p>
                    <p className="text-2xl font-black text-amber-900">{product.stock}</p>
                </div>
            </div>

            <div className="flex space-x-4">
                <Link to="/" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition">
                    Back to List
                </Link>
                {user?.role === 'admin' && (
                    <Link to={`/products/${product.product_slug}/edit`} className="bg-amber-800 hover:bg-amber-900 text-white px-6 py-2.5 rounded-lg font-medium transition">
                        Edit
                    </Link>
                )}
            </div>
        </div>
    );
}