import React from 'react'
import { useRouteError, Link } from 'react-router-dom'

export default function ErrorBoundary() {
    const error = useRouteError()
    const message = error?.response?.data?.message || error?.statusText || error?.message || 'Something went wrong.'
    return (
        <div className='max-w-xl mx-auto text-center p-10'>
            <h1 className='text-2xl font-bold mb-2'>Oops! There is an error</h1>
            <p className='text-gray-600 mb-6'>{message}</p>
            <Link to={"/"} className='text-amber-800 underline'></Link>
        </div>
    )
}
