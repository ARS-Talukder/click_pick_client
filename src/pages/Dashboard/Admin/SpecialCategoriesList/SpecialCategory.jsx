import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import DashboardButton from '../../DashboardButton';
import CountdownTimer from '../../../Shared/CountdownTimer';

const SpecialCategory = () => {
    const { id } = useParams();
    const [specialCategory, setSpecialCategory] = useState({});
    const [allProducts, setAllProducts] = useState([]);
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    // Fetch the special category
    useEffect(() => {
        fetch(`https://click-pick-server.onrender.com/special_category/${id}`)
            .then(res => res.json())
            .then(data => {
                setSpecialCategory(data);
                setStartTime(data.startTime || "");
                setEndTime(data.endTime || "");
            });
    }, [id]);

    // Fetch all products
    useEffect(() => {
        fetch("https://click-pick-server.onrender.com/products")
            .then(res => res.json())
            .then(data => setAllProducts(data));
    }, []);

    const selectedProducts = specialCategory?.products || [];

    // Filter out already selected products
    const availableProducts = allProducts.filter(
        (p) => !selectedProducts.some((sp) => sp._id === p._id)
    );

    // Add product to special category
    const handleAddProduct = (product) => {
        fetch(`https://click-pick-server.onrender.com/special_category/${id}/add-product`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(product)
        })
            .then(res => res.json())
            .then(() => {
                setSpecialCategory(prev => ({
                    ...prev,
                    products: [...(prev.products || []), product]
                }));
            });
    };

    // Remove product from special category
    const handleRemoveProduct = (product) => {
        fetch(`https://click-pick-server.onrender.com/special_category/${id}/remove-product`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ _id: product._id })
        })
            .then(res => res.json())
            .then(() => {
                setSpecialCategory(prev => ({
                    ...prev,
                    products: prev.products.filter(p => p._id !== product._id)
                }));
            });
    };

    // Update Timer
    const handleUpdateTimer = (e) => {
        e.preventDefault();
        fetch(`https://click-pick-server.onrender.com/special_category/${id}/update-timer`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ startTime, endTime })
        })
            .then(res => res.json())
            .then(() => {
                setSpecialCategory(prev => ({
                    ...prev,
                    startTime,
                    endTime
                }));
                alert("Timer updated successfully!");
            });
    };

    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton />

            {/* Category Header */}
            <div className='bg-white p-5 my-4 rounded-xl shadow-xl flex justify-between items-center'>
                <h2 className='text-xl font-bold text-slate-600'>
                    {specialCategory?.name} – Special Category
                </h2>

                {/* Countdown Timer */}
                {specialCategory?.startTime && specialCategory?.endTime && (
                    <CountdownTimer
                        startTime={specialCategory.startTime}
                        endTime={specialCategory.endTime}
                    />
                )}
            </div>

            {/* Timer Edit Form */}
            <form
                onSubmit={handleUpdateTimer}
                className="bg-white p-4 rounded-xl shadow-md my-4 flex gap-4 items-end"
            >
                <div>
                    <label className="block font-semibold text-slate-600 mb-1">Start Time</label>
                    <input
                        type="datetime-local"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                        required
                    />
                </div>
                <div>
                    <label className="block font-semibold text-slate-600 mb-1">End Time</label>
                    <input
                        type="datetime-local"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="border px-2 py-1 rounded w-full"
                        required
                    />
                </div>
                <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                >
                    Update Timer
                </button>
            </form>

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
                                        ৳{p.discount_price}
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
                                                        {product.discount_price}
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

export default SpecialCategory;
