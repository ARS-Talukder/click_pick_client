import React, { useState } from 'react';
import DashboardButton from '../DashboardButton';
import OrderProduct from './OrderProduct';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const OrderTrack = () => {
    const [orders, setOrders] = useState([]);
    const [noOrder, setNoOrder] = useState("");
    const [expandedOrder, setExpandedOrder] = useState(null); // Track expanded order

    const handleMyOrder = (e) => {
        e.preventDefault();
        const phone = e.target.phone.value;

        fetch(`http://localhost:5000/order_by_phone/${phone}`, {
            method: 'GET',
            headers: { 'content-type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                if (data.length === 0) {
                    setNoOrder("This number has no Orders");
                } else {
                    setOrders(data);
                    setNoOrder("");
                }
            });
    };

    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton />

            {orders.length === 0 ? (
                noOrder === "" ? (
                    <div className='flex justify-center mb-8 lg:mb-0 lg:my-4'>
                        <form onSubmit={handleMyOrder}>
                            <p className='my-1 font-bold text-gray-700'>
                                <small>Enter Your Mobile Number to see the order status</small>
                            </p>
                            <input
                                type="number"
                                name="phone"
                                placeholder="Enter Mobile Number"
                                className="input input-bordered input-md w-full max-w-xs"
                                required
                            />
                            <input
                                type="submit"
                                value="Submit"
                                className='w-full btn btn-md max-w-xs text-white bg-blue-500 hover:bg-blue-600 my-1'
                            />
                        </form>
                    </div>
                ) : (
                    <div className='flex justify-center mb-8 lg:mb-0 lg:my-4'>
                        <form onSubmit={handleMyOrder}>
                            <p className='my-1 font-bold text-gray-700'>
                                <small>Enter Your Mobile Number to see the order status</small>
                            </p>
                            <input
                                type="number"
                                name="phone"
                                placeholder="Enter Mobile Number"
                                className="input input-bordered input-md w-full max-w-xs"
                                onChange={() => setNoOrder("")}
                                required
                            />
                            <input
                                type="submit"
                                value="Submit"
                                className='w-full btn btn-md max-w-xs text-white bg-blue-500 hover:bg-blue-600 my-1'
                            />
                            <p className='font-bold text-red-500'>
                                <small>Sorry!! {noOrder}</small>
                            </p>
                        </form>
                    </div>
                )
            ) : (
                <div className="max-w-xl mx-auto lg:p-4">
                    <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                        <h2 className='text-xl font-bold text-slate-600'>All Orders</h2>
                    </div>

                    {[...orders].reverse().map((order) => (
                        <div key={order.orderID} className="bg-white shadow-md rounded-lg mb-4 overflow-hidden">
                            {/* Header (Order ID + Date + Arrow) */}
                            <div
                                className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
                                onClick={() =>
                                    setExpandedOrder(expandedOrder === order.orderID ? null : order.orderID)
                                }
                            >
                                <div>
                                    <p className="text-gray-700">OrderID: <span className='text-gray-600 font-bold'>{order.orderID}</span></p>
                                </div>
                                <div className="text-gray-600 text-lg">
                                    {expandedOrder === order.orderID ? <button className='btn btn-sm btn-info'>hide <FaChevronUp/></button> : <button className='btn btn-sm btn-accent'>view <FaChevronDown/></button>}
                                </div>
                            </div>

                            {/* Expanded details */}
                            {expandedOrder === order.orderID && (
                                <div className="border-t p-4">
                                    <OrderProduct order={order} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderTrack;