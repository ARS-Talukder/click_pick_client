import React, { useEffect, useRef, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Order from './Order';
import DashboardButton from '../../DashboardButton';
import Loading from '../../../Shared/Loading';
import Pagination from '../../../Shared/Pagination';
import API, { SERVER_URL } from '../../../../api/api';

const AllOrders = () => {
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searchLoading, setSearchLoading] = useState(false);

    // Handling pagination with date
    const [page, setPage] = useState(1);
    const [selectedDate, setSelectedDate] = useState("");
    const limit = 20;

    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);

    const {
        data: orders,
        isLoading,
        isSuccess,
        refetch
    } = useQuery({
        queryKey: ["orders", page],
        queryFn: () => {
            return API.get(
                `/orders?page=${page}&limit=${limit}`
            );
        }
    });

    const { data: dateOrders, isLoading: dateLoading } = useQuery({
        queryKey: ["dateOrders", selectedDate, page],
        queryFn: () => {
            return API.get(
                `/orders_paginated?page=${page}&limit=${limit}&date=${selectedDate}`
            );
        },
        enabled: !!selectedDate
    });

    const handleDateChange = (e) => {
        const inputDate = e.target.value;

        if (!inputDate) {
            setSelectedDate("");
            setPage(1);
            return;
        }

        const formattedDate = new Date(
            `${inputDate}T00:00:00`
        ).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });

        setSelectedDate(formattedDate);
        setPage(1);
    };

    // handling search orders by phone
    useEffect(() => {
        if (!searchText.trim()) {
            setSearchResults([]);
            setShowDropdown(false);
            setSearchLoading(false);
            return;
        }

        const delaySearch = setTimeout(() => {
            setSearchLoading(true);

            fetch(`${SERVER_URL}/order_by_phone/${searchText}`)
                .then(res => res.json())
                .then(data => {
                    setSearchResults(data);
                    setShowDropdown(true);
                })
                .catch(error => {
                    setSearchResults([]);
                })
                .finally(() => {
                    setSearchLoading(false);
                });

        }, 500);

        return () => {
            clearTimeout(delaySearch);
        };

    }, [searchText]);

    // hiding the search dropdown when clicking outside of search bar
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (
                searchRef.current &&
                !searchRef.current.contains(e.target)
            ) {
                setShowDropdown(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // handling same numbers many orders will show only one time on the search dropdown
    const uniquePhoneResults = searchResults.filter(
        (order, index, self) =>
            index === self.findIndex(
                item => item.phone === order.phone
            )
    );

    let content;

    if (isLoading) {
        return <Loading />
    }

    if (isSuccess) {
        if (searchText) {
            if (searchLoading) {
                content = (
                    <tr>
                        <td colSpan="10" className="py-10">
                            <div className="flex justify-center items-center">
                                <span className="loading loading-spinner loading-md text-primary"></span>
                            </div>
                        </td>
                    </tr>
                );
            }
            else if (searchResults.length > 0) {
                content = [...searchResults].reverse().map((order, index) => (
                    <Order
                        index={index}
                        key={order._id}
                        order={order}
                        refetch={refetch}
                    />
                ));
            }
            else {
                content = (
                    <tr>
                        <td
                            colSpan="10"
                            className="text-center text-gray-500 py-8 font-medium"
                        >
                            No orders with this number.
                        </td>
                    </tr>
                );
            }
        }

        else if (selectedDate) {
            if (dateLoading) {
                content = (
                    <tr>
                        <td colSpan="10" className="py-10">
                            <div className="flex justify-center items-center">
                                <span className="loading loading-spinner loading-md text-primary"></span>
                            </div>
                        </td>
                    </tr>
                );
            }
            else if (dateOrders?.data?.orders?.length > 0) {
                content = dateOrders.data.orders.map((order, index) => (
                    <Order
                        index={(page - 1) * limit + index}
                        key={order._id}
                        order={order}
                        refetch={refetch}
                    />
                ));
            }
            else {
                content = (
                    <tr>
                        <td
                            colSpan="10"
                            className="text-center text-gray-500 py-8 font-medium"
                        >
                            No orders were placed on this date.
                        </td>
                    </tr>
                );
            }
        }

        else {
            // All orders with pagination
            content = orders?.data?.orders?.map((order, index) => (
                <Order
                    index={(page - 1) * limit + index}
                    key={order._id}
                    order={order}
                    refetch={refetch}
                />
            ));
        }
    }

    // Orders number counting
    const totalOrderCount = orders?.data?.totalOrders || 0;
    const selectedDateOrderCount = dateOrders?.data?.totalOrders || 0;
    const orderTitle = searchText
        ? searchText
        : selectedDate
            ? selectedDate
            : "All Orders";

    const orderCount = searchText
        ? searchResults.length
        : selectedDate
            ? selectedDateOrderCount
            : totalOrderCount;

    return (
        <div className='py-2'>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>

            {/* ---------- Search Bar ---------- */}
            <div className='bg-white p-5 my-4 rounded-xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                <h2 className='text-xl font-bold text-slate-600'>{orderTitle} <span className='text-green-600'>({orderCount})</span></h2>
                <div ref={searchRef} className="relative">
                    <input
                        type="text"
                        placeholder="Search by Phone Number"
                        value={searchText}
                        onChange={(e) => {
                            setSearchText(e.target.value);
                            setShowDropdown(true);
                        }}
                        onFocus={() => {
                            if (searchResults.length > 0) {
                                setShowDropdown(true);
                            }
                        }}
                        className="input input-bordered w-64"
                    />

                    {showDropdown && searchText && (
                        <div className="absolute top-full left-0 w-full bg-white shadow-xl rounded-lg mt-1 z-50 overflow-hidden">

                            {searchLoading ? (
                                <div className="flex justify-center items-center py-5">
                                    <span className="loading loading-spinner loading-sm text-primary"></span>
                                </div>
                            ) : uniquePhoneResults.length > 0 ? (
                                uniquePhoneResults.map(order => (
                                    <div
                                        key={order.phone}
                                        onClick={() => {
                                            setSearchText(order.phone);
                                            setShowDropdown(false);
                                            setSelectedDate("");
                                        }}
                                        className="px-4 py-3 hover:bg-gray-100 cursor-pointer border-b"
                                    >
                                        <p className="font-semibold text-slate-700">
                                            {order.phone}
                                        </p>

                                        <p className="text-sm text-gray-500">
                                            {order.customerName}
                                        </p>
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-sm text-gray-500">
                                    No matching phone number found.
                                </div>
                            )}

                        </div>
                    )}
                </div>
                <div className="flex gap-2 items-center">
                    <div className="flex items-center gap-2 bg-white border rounded-lg px-3 py-2 shadow-sm">
                        <span className="text-xl">📅</span>

                        <input
                            type="date"
                            onChange={handleDateChange}
                            className="outline-none bg-transparent w-32 text-sm"
                        />
                    </div>

                    <button
                        onClick={() => {
                            setSelectedDate("");
                            setPage(1);
                        }}
                        className="btn btn-sm btn-success text-white"
                    >
                        All Orders
                    </button>
                </div>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-xl my-6">
                <table className="table table border">
                    <thead className='bg-blue-700 text-white'>
                        <tr className='text-center'>
                            <th className='border'>SL</th>
                            <th className='border'>OrderID</th>
                            <th className='border'>Product</th>
                            <th className='border'>Price</th>
                            <th className='border'>Shipping</th>
                            <th className='border'>Total</th>
                            <th className='border'>Order Date</th>
                            <th className='border'>Information</th>
                            <th className='border'>Payment</th>
                            <th className='border'>State</th>
                        </tr>
                    </thead>
                    <tbody className='border'>
                        {content}
                    </tbody>
                </table>
            </div>
            {!searchText &&
                !dateLoading &&
                (
                    selectedDate
                        ? (dateOrders?.data?.totalOrders || 0) > limit
                        : (orders?.data?.totalOrders || 0) > limit
                ) && (
                    <Pagination
                        currentPage={page}
                        setCurrentPage={setPage}
                        totalPages={
                            selectedDate
                                ? Math.ceil(
                                    (dateOrders?.data?.totalOrders || 0) / limit
                                )
                                : Math.ceil(
                                    (orders?.data?.totalOrders || 0) / limit
                                )
                        }
                    />
                )}
        </div>
    );
};

export default AllOrders;