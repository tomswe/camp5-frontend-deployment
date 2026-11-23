import React from 'react';
import { useLoaderData } from 'react-router-dom';
import ProductForm from '../components/ProductForm';

export default function EditProduct() {
    const { product } = useLoaderData();
    return <ProductForm key={product.id} isEdit={true} product={product} />;
}