import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useCoffee } from '../context/CoffeeContext.jsx'

const FIELDS = [
    { name: 'product_name', label: 'Product Name', type: 'text' },
    { name: 'product_slug', label: 'Slug', type: 'text' },
    { name: 'stock', label: 'Stock', type: 'number' },
    { name: 'price', label: 'Price', type: 'number', step: '0.01' },
];

export default function ProductForm({ isEdit = false, product = null, ...props }) {
    const { addProduct, updateProduct } = useCoffee()
    const navigate = useNavigate()
    const [form, setForm] = useState({
        product_name: product?.product_name ?? '',
        product_slug: product?.product_slug ?? '',
        stock: product?.stock ?? '',
        price: product?.price ?? '',
    });
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);

    const handleChange = (e) =>
        setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);

        const result = isEdit
            ? await updateProduct(product.id, form)
            : await addProduct(form);

        setSubmitting(false);

        if (result.success) {
            navigate(isEdit ? `/products/${result.data.product_slug}` : '/');
        } else {
            setErrors(result.errors);
        }
    };

    return (
        <div className="max-w-xl mx-auto bg-white p-8 rounded-xl shadow-md border border-gray-100 my-12">
            <h1 className="text-2xl font-bold mb-6">{isEdit ? 'Edit Product' : 'Add Product'}</h1>

            {errors._form && (
                <div className="bg-red-50 text-red-700 text-sm p-3 rounded-lg mb-4">
                    {errors._form.join(' ')}
                </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {FIELDS.map(({ name, label, type, step }) => (
                    <div key={name}>
                        <label htmlFor={name} className="block text-sm font-medium text-gray-700 mb-1">
                            {label}
                        </label>
                        <input
                            id={name}
                            name={name}
                            type={type}
                            step={step}
                            value={form[name]}
                            onChange={handleChange}
                            className={`w-full border rounded-lg px-3 py-2 ${errors[name] ? 'border-red-400' : 'border-gray-300'}`}
                        />
                        {errors[name]?.map((msg, i) => (
                            <p key={i} className="text-red-600 text-xs mt-1">{msg}</p>
                        ))}
                    </div>
                ))}

                <div className="flex gap-3 pt-2">
                    <button
                        type="submit"
                        disabled={submitting}
                        className="bg-amber-800 hover:bg-amber-900 disabled:opacity-60 text-white px-6 py-2.5 rounded-lg font-medium transition"
                    >
                        {submitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}
                    </button>
                    <Link to="/" className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2.5 rounded-lg font-medium transition">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    );
}
