import React from 'react';
import { AiOutlineCheck } from 'react-icons/ai';
import { Link } from 'react-router-dom';
import { FaAddressCard } from "react-icons/fa";

const OrderProduct = ({ order }) => {
    const { orderID, orderSteps, products, customerName, phone, address, date, time, subTotal, shipping, total } = order;

    const lastStatus = orderSteps?.length ? orderSteps[orderSteps.length - 1]?.title : "Pending";

    console.log(orderSteps)
    return (
        <div className="relative">
            {/* Status Section */}
            <section className='bg-white rounded-xl shadow-md p-4 my-2'>
                <h2 className='text-center text-slate-600 font-bold mb-6'><span className='border border-slate-300 p-1 rounded'>OrderID: {orderID}</span></h2>
                {orderSteps.map((step, index) => (
                    <div className="flex items-start mb-8 relative my-2" key={index}>
                        {/* Time */}
                        <div className="w-20 text-sm text-gray-500 whitespace-pre-line text-right pr-2">
                            {step.time}
                        </div>

                        {/* Line + Circle */}
                        <div className="relative">
                            {/* Circle */}
                            <div className="w-5 h-5 rounded-full bg-teal-500 text-white flex items-center justify-center z-10">
                                <AiOutlineCheck className="text-xs" />
                            </div>

                            {/* Vertical Line */}
                            {index !== orderSteps.length - 1 && (
                                <div className="absolute top-5 left-1/2 transform -translate-x-1/2 h-full bg-teal-500 w-px z-0 my-4"></div>
                            )}
                        </div>

                        {/* Content */}
                        <div className="ml-4 flex-1">
                            <h3 className="font-semibold">{step.title}</h3>
                            <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        </div>

                    </div>

                ))}

                <hr />

                <div className='text-center'>
                    <p className='text-slate-400'><small>If You Have Any Query,</small></p>
                    <p className='text-slate-500 font-bold'>
                        <span>Call Us On </span>
                        <span className='text-teal-500'>01814728277</span>
                    </p>
                </div>
            </section>

            {/* Products Section */}
            <section className='bg-white rounded-xl shadow-md p-4 my-2'>
                {
                    products.map(p => (<div key={p.product_id} className="flex gap-3 items-start border-b pb-4 pt-4">
                        <img
                            src={p.img}
                            alt={p.name}
                            className="w-16 h-16 object-contain rounded border"
                        />
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold leading-snug">{p.name}</h4>
                            <p className="text-sm text-gray-600 mb-1">Quantity: {p.quantity}</p>
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs text-gray-400 line-through">৳{p.price}</span>
                                {
                                    p.discount_price && <span className="text-sm font-medium text-gray-800">৳{p.discount_price}</span>
                                }

                            </div>
                            <div className="flex items-center gap-2">
                                <span className={lastStatus === 'Canceled' ? "bg-red-700 text-white text-xs font-medium border border-red-600 px-2 py-0.5 rounded" : "bg-green-700 text-white text-xs font-medium border border-green-600 px-2 py-0.5 rounded"}>
                                    {lastStatus}
                                </span>
                            </div>
                        </div>
                    </div>))
                }

                <div className='flex justify-center mt-3'>
                    <Link to='/' className='btn btn-sm btn-outline btn-success'>Create Another Order</Link>
                </div>
            </section>

            {/* Address Section */}
            <section className='bg-white rounded-xl shadow-md p-4 my-2'>
                <h2 className='text-slate-400 font-bold'>Address Shipping</h2>

                <hr className='my-2' />

                <div className='text-slate-500 flex'>
                    <p className='text-4xl mr-4 mt-2'><FaAddressCard /></p>

                    <div>
                        <p>{customerName}</p>
                        <p>{phone}</p>
                        <p><span className='underline'>Street:</span> {address.street}</p>
                        <p><span className='underline'>Thana:</span> {address.thana}</p>
                        <p><span className='underline'>District:</span> {address.district}</p>
                    </div>
                </div>

            </section>

            {/* Order Information Section */}
            <section className='bg-white rounded-xl shadow-md p-4 my-2 font-bold'>
                <p className='flex justify-between my-1'>
                    <span>Order ID</span>
                    <span>{orderID}</span>
                </p>
                <p className='flex justify-between my-1'>
                    <span>Order At</span>
                    <span>{date}, {time}</span>
                </p>
                <p className='flex justify-between my-1'>
                    <span>Subtotal(MRP)</span>
                    <span>{subTotal}</span>
                </p>
                <p className='flex justify-between my-1'>
                    <span>Delivery Charge</span>
                    <span>{shipping}</span>
                </p>
                <p className='flex justify-between my-1'>
                    <span>Total</span>
                    <span>{total}</span>
                </p>

            </section>
        </div>
    );
};

export default OrderProduct;