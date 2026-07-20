import React, { useEffect, useRef, useState } from 'react';
import DashboardButton from '../DashboardButton';
import OrderProduct from './OrderProduct';
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { SERVER_URL } from '../../../api/api';
import Loading from '../../Shared/Loading';

const OrderTrack = () => {
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [expandedOrder, setExpandedOrder] = useState(null);

    const searchRef = useRef(null);

    useEffect(() => {
        if (searchText.length !== 11) {
            setSearchResults([]);
            setShowDropdown(false);
            setSearchLoading(false);
            return;
        }

        // Start loading immediately
        setSearchLoading(true);

        const timeout = setTimeout(async () => {
            try {
                const res = await fetch(
                    `${SERVER_URL}/order_by_phone/${searchText}`
                );

                const data = await res.json();

                setSearchResults(data);
                setShowDropdown(true);
            } catch (err) {
                console.error(err);
                setSearchResults([]);
            } finally {
                setSearchLoading(false);
            }
        }, 500);

        return () => clearTimeout(timeout);
    }, [searchText]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(event.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener(
                "mousedown",
                handleClickOutside
            );
        };
    }, []);

    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton />

            <div className='bg-white p-5 my-4 rounded-xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                <h2 className='text-xl font-bold text-slate-600'>Order Track</h2>

                <div className="relative w-full max-w-md" ref={searchRef}>
                    <input
                        type="text"
                        inputMode="numeric"
                        maxLength={11}
                        placeholder="Enter your phone number (Minimum 11 digit)"
                        className="input input-bordered w-full border-green-400"
                        value={searchText}
                        onChange={(e) => {
                            const value = e.target.value.replace(/\D/g, "");
                            setSearchText(value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => {
                            if (searchResults.length > 0) {
                                setShowDropdown(true);
                            }
                        }}
                    />

                    {searchLoading && (
                        <div className="absolute w-full bg-white border rounded-lg mt-1 p-3 shadow z-50">
                            Loading...
                        </div>
                    )}

                    {showDropdown && (
                        <div className="absolute w-full bg-white border rounded-lg mt-1 shadow-lg z-50">

                            {searchText.length === 0 ? (
                                <div className="p-3 text-gray-500">
                                    Enter your phone number.
                                </div>
                            ) : searchText.length < 11 ? (
                                <div className="p-3 text-gray-500">
                                    Enter minimum 11-digit phone number.
                                </div>
                            ) : searchLoading ? (
                                <div className="p-3">
                                    Loading...
                                </div>
                            ) : searchResults.length > 0 ? (
                                <div
                                    className="p-3 cursor-pointer hover:bg-gray-100"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    {searchText}
                                    <span className="text-green-600 ml-2">
                                        ({searchResults.length})
                                    </span>
                                </div>
                            ) : (
                                <div className="p-3 text-red-500">
                                    No orders found.
                                </div>
                            )}

                        </div>
                    )}
                </div>
            </div>

            {/* Orders */}
            {searchText && (
                <div className="mt-6">

                    {searchText.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-16 text-center">
                            <h2 className="text-2xl font-bold text-slate-600">
                                Enter your phone number
                            </h2>
                            <p className="text-slate-500 mt-2">
                                Enter your 11-digit mobile number to view your orders.
                            </p>
                        </div>
                    ) : searchText.length < 11 ? (
                        <div className="bg-white rounded-xl shadow p-16 text-center">
                            <h2 className="text-xl font-bold text-slate-600">
                                Incomplete phone number
                            </h2>
                            <p className="text-slate-500 mt-2">
                                Please enter all 11 digits.
                            </p>
                        </div>
                    ) : searchLoading ? (
                        <div className="flex justify-center py-20">
                            <Loading />
                        </div>
                    ) : searchResults.length === 0 ? (
                        <div className="bg-white rounded-xl shadow p-16 text-center">
                            <h2 className="text-xl font-bold text-red-500">
                                No orders found
                            </h2>
                            <p className="text-slate-500 mt-2">
                                We could not find any orders for this phone number.
                            </p>
                        </div>
                    ) : (
                        <div className="max-w-xl mx-auto lg:p-4">
                            <div className="bg-white p-5 my-4 rounded-xl shadow-xl">
                                <h2 className="text-xl font-bold text-slate-600">
                                    All Orders ({searchResults.length})
                                </h2>
                            </div>

                            {[...searchResults].reverse().map((order) => (
                                <div
                                    key={order.orderID}
                                    className="bg-white shadow-md rounded-lg mb-4 overflow-hidden"
                                >
                                    <div
                                        className="flex justify-between items-center p-4 cursor-pointer hover:bg-gray-100"
                                        onClick={() =>
                                            setExpandedOrder(
                                                expandedOrder === order.orderID
                                                    ? null
                                                    : order.orderID
                                            )
                                        }
                                    >
                                        <div>
                                            <p className="text-gray-700">
                                                Order ID:{" "}
                                                <span className="font-bold">
                                                    {order.orderID}
                                                </span>
                                            </p>
                                        </div>

                                        <div>
                                            {expandedOrder === order.orderID ? (
                                                <button className="btn btn-sm btn-info">
                                                    Hide <FaChevronUp />
                                                </button>
                                            ) : (
                                                <button className="btn btn-sm btn-accent">
                                                    View <FaChevronDown />
                                                </button>
                                            )}
                                        </div>
                                    </div>

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
            )}


        </div>
    );
};

export default OrderTrack;