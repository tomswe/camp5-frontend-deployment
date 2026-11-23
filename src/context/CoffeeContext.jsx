import React, { createContext, useContext, useCallback, useMemo } from 'react';
import { api } from '../services/api.js';

const CoffeeContext = createContext(null)

const toErrors = (err) => err.response?.data?.errrors ?? { _form: [err.response?.data?.message || "Could not reach the server"] }

export const CoffeeProvider = ({ children }) => {

    const addProduct = useCallback(async (data) => {
        try {
            const res = await api.post('/products', data);
            return { success: true, data: res.data.data };
        } catch (err) {
            return { success: false, errors: toErrors(err) };
        }
    }, []);

    const updateProduct = useCallback(async (id, data) => {
        try {
            const res = await api.put(`/products/${id}`, data);
            return { success: true, data: res.data.data };
        } catch (err) {
            return { success: false, errors: toErrors(err) };
        }
    }, []);

    const deleteProduct = useCallback(async (id) => {
        try {
            await api.delete(`/products/${id}`);
            return true;
        } catch (err) {
            console.error('Failed to delete product', err);
            return false;
        }
    }, []);

    const value = useMemo(
        () => ({ addProduct, updateProduct, deleteProduct }),
        [addProduct, updateProduct, deleteProduct]
    );

    return <CoffeeContext.Provider value={value}>{children}</CoffeeContext.Provider>;
};

// export const Gallery({props}) {
// return <Photo data={data}/>

// }

// export const Photo({props}) {
//     return <img src={props.img_url} alt="" />
// }

// custom hooks
// ditandai dengan penamaanya
// diikuti dengan keyword use: useUser, useProduct, usePayment
export const useCoffee = () => {
  const ctx = useContext(CoffeeContext);
  if (!ctx) throw new Error('useCoffee must be used inside <CoffeeProvider>');
  return ctx;
};