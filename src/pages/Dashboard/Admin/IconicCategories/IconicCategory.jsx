import React, { useEffect, useState } from 'react';
import DashboardButton from '../../DashboardButton';
import { useParams } from 'react-router-dom';
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const IconicCategory = () => {
    const { id } = useParams();
    const [iconicCategory, setIconicCategory] = useState({});
    const [allProducts, setAllProducts] = useState([]);

    // Fetch the special category
    useEffect(() => {
        fetch(`http://localhost:5000/iconic_category/${id}`)
            .then(res => res.json())
            .then(data => {
                setIconicCategory(data);
            });
    }, [id]);

    // Fetch all products
    useEffect(() => {
        fetch("http://localhost:5000/products")
            .then(res => res.json())
            .then(data => setAllProducts(data));
    }, []);

    const selectedProducts = iconicCategory?.products || [];

    // Filter out already selected products
    const availableProducts = allProducts.filter(
        (p) => !selectedProducts.some((sp) => sp._id === p._id)
    );

    // Add product to special category
    const handleAddProduct = (product) => {
        fetch(`http://localhost:5000/iconic_category/${id}/add-product`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        })
            .then(res => res.json())
            .then(() => {
                setIconicCategory(prev => ({
                    ...prev,
                    products: [...(prev.products || []), product]
                }));
            });
    };

    // Remove product from special category
    const handleRemoveProduct = (product) => {
        fetch(`http://localhost:5000/iconic_category/${id}/remove-product`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: product._id })
        })
            .then(res => res.json())
            .then(() => {
                setIconicCategory(prev => ({
                    ...prev,
                    products: prev.products.filter(p => p._id !== product._id)
                }));
            });
    };

    
    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton />

            {/* Category Header */}
            <div className='bg-white p-5 my-4 rounded-xl shadow-xl flex justify-between items-center'>
                <h2 className='text-xl font-bold text-slate-600'>
                    {iconicCategory?.name} – Iconic Category
                </h2>
            </div>

            {/* Selected Products */}
            <div className="mb-6">
                <div className='bg-white p-2 my-4 rounded-xl shadow-xl'>
                    <h2 className='font-bold text-slate-600'>Selected Products</h2>
                </div>
                {selectedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {selectedProducts.map((p) => (
                            <div
                                key={p._id}
                                className="bg-white p-4 rounded-lg shadow-md border relative"
                            >
                                <img
                                    src={p.images[0]?.url}
                                    alt="product_image"
                                    className="h-44 w-full object-cover rounded"
                                />
                                <h4 className="mt-2 font-bold"><small>{p.name}</small></h4>
                                <div className='flex items-center'>
                                    <p className="line-through text-gray-500 mr-4 font-bold">৳{p.price}</p>
                                    <p className="text-red-500 font-bold">
                                        ৳{p.price - ((p.discount * p.price) / 100)}
                                    </p>
                                </div>

                                <button
                                    onClick={() => handleRemoveProduct(p)}
                                    className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-500">No products selected yet.</p>
                )}
            </div>

            {/* Available Products */}
            <div>
                <div className='bg-white p-2 my-4 rounded-xl shadow-xl'>
                    <h2 className='font-bold text-slate-600'>Available Products</h2>
                </div>

                {availableProducts.length > 0 ? (
                    <div className="overflow-x-auto bg-white rounded-xl shadow-xl my-6">
                        <table className="table table border">
                            <thead className='bg-blue-700 text-white'>
                                <tr>
                                    <th className='border'>PRODUCT</th>
                                    <th className='border'>CATEGORY</th>
                                    <th className='border'>PRICE</th>
                                    <th className='border'>DISCOUNT</th>
                                    <th className='border'>Shipping</th>
                                    <th className='border'>ACTION</th>
                                </tr>
                            </thead>

                            <tbody className='border'>
                                {availableProducts.map((product) => (
                                    <tr key={product._id} className='text-slate-600 font-bold'>
                                        <td className='border'>
                                            <div className='flex items-center'>
                                                <span className='mr-4'>
                                                    <img
                                                        src={product.images[0]?.url}
                                                        alt="product_image"
                                                        className="h-12 w-12 object-cover rounded"
                                                    />
                                                </span>
                                                <span>{product.name} </span>
                                            </div>
                                        </td>
                                        <td className='border'>{product.category}</td>
                                        <td className='border'>
                                            <div>
                                                <p className='flex items-center line-through'>
                                                    <span className='text-xs'><small><FaBangladeshiTakaSign /></small></span>
                                                    <span>{product.price}</span>
                                                </p>
                                                <p className='flex items-center text-blue-700'>
                                                    <span className='text-xs'><small><FaBangladeshiTakaSign /></small></span>
                                                    <span className='block'>
                                                        {product.price - ((product.discount * product.price) / 100)}
                                                    </span>
                                                </p>
                                            </div>
                                        </td>
                                        <td className='border'>
                                            <div className='flex items-center'>
                                                <span>{product.discount + "%"}</span>
                                            </div>
                                        </td>
                                        <td className='border'>
                                            <div className={product.shippingCharge === 'free'
                                                ? 'flex items-center text-red-600 font-bold'
                                                : 'flex items-center text-blue-600'}>
                                                <span>{product.shippingCharge}</span>
                                            </div>
                                        </td>
                                        <td className="border">
                                            <button
                                                onClick={() => handleAddProduct(product)}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                            >
                                                ADD
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <p className="text-gray-500">All products are already selected.</p>
                )}
            </div>
        </div>
    );
};

export default IconicCategory;