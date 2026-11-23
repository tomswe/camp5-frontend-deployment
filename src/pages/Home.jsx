import React from 'react';
import { Link, useLoaderData, useRevalidator } from 'react-router-dom';
import { useCoffee } from '../context/CoffeeContext.jsx';
import { formatRupiah } from '../utils/formatCurrency.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Home() {
    const { products } = useLoaderData();
    const { deleteProduct } = useCoffee();
    const revalidator = useRevalidator();

    const { user } = useAuth()
    const isAdmin = user?.role === 'admin'

    const handleDelete = async (p) => {
        if (!window.confirm(`Delete "${p.product_name}"?`)) return;
        const ok = await deleteProduct(p.id);
        if (ok) revalidator.revalidate(); // re-runs homeLoader so the list updates
    };

    return (
        <div className="max-w-7xl mx-auto px-6 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-extrabold text-gray-800">Coffee Menu Catalog</h1>
                <Link to="/products/new" className="bg-amber-800 hover:bg-amber-900 text-white px-5 py-2 rounded-lg font-medium transition">
                    + Add Product
                </Link>
            </div>

            {products.length === 0 && <p className="text-gray-500">No products yet.</p>}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {products.map((p) => (
                    <div key={p.id} className="bg-white rounded-xl shadow-md p-6 border border-gray-100 flex flex-col justify-between">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900">{p.product_name}</h3>
                                <span className="bg-amber-100 text-amber-800 text-xs px-2.5 py-1 rounded-full font-semibold">Stock: {p.stock}</span>
                            </div>
                            <p className="text-gray-500 text-sm mb-4">Slug: {p.product_slug}</p>
                            <p className="text-2xl font-black text-amber-900 mb-4">{formatRupiah(p.price)}</p>
                        </div>
                        <div className="flex space-x-2 pt-4 border-t border-gray-100">
                            <Link to={`/products/${p.product_slug}`} className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 text-center py-2 rounded-lg text-sm font-medium transition">
                                View
                            </Link>

                            {isAdmin && (
                                <>
                                    <Link to={`/products/${p.product_slug}/edit`} className="flex-1 bg-amber-50 hover:bg-amber-100 text-amber-800 text-center py-2 rounded-lg text-sm font-medium transition">
                                        Edit
                                    </Link>

                                    <button
                                        onClick={() => handleDelete(p)}
                                        className="flex-1 bg-red-50 hover:bg-red-100 text-red-600 text-center py-2 rounded-lg text-sm font-medium transition"
                                    >
                                        Delete
                                    </button>
                                </>
                            )}

                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}