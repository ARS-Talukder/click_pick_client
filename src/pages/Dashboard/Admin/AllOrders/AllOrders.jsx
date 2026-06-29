import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Order from './Order';
import DashboardButton from '../../DashboardButton';
import Loading from '../../../Shared/Loading';

const AllOrders = () => {
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);

    const { data: orders, isLoading, isSuccess, isError, error, refetch } = useQuery({
        queryKey: ["orders"],
        queryFn: () => {
            return axios.get("http://localhost:5000/orders")
        }
    })

    const handleSearch = () => {
        fetch(`http://localhost:5000/order_by_phone/${searchText}`)
            .then(res => res.json())
            .then(data => setSearchResults(data))
    };

    console.log(searchResults)

    let content;

    // const displayedOrders = searchText ? searchResults : (orders?.data || []);

    if (isLoading) {
        return <Loading></Loading>
    }

    if (isSuccess) {
        if (searchText) { // user has typed something in search
            if (searchResults.length > 0) {
                content = [...searchResults].reverse().map((order, index) => (
                    <Order index={index} key={order._id} order={order} />
                ));
            } else {
                content = (
                    <div className="text-center text-red-600 py-4">
                        <p>This phone number has no order</p>
                    </div>
                );
            }
        } else { // no search performed, show all orders
            content = [...orders.data].reverse().map((order, index) => (
                <Order index={index} key={order._id} order={order} refetch={refetch} />
            ));
        }
    }

    return (
        <div className='py-2'>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>

            {/* ---------- Search Bar ---------- */}
            <div className='bg-white p-5 my-4 rounded-xl shadow-xl flex flex-col md:flex-row md:items-center md:justify-between gap-2'>
                <h2 className='text-xl font-bold text-slate-600'>All Orders</h2>
                <div className="flex gap-2">
                    <input
                        type="text"
                        placeholder="Search by Phone Number"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSearch();
                        }}
                        className="input input-bordered w-64"
                    />
                    <button onClick={handleSearch} className="btn btn-primary">Search</button>
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
                            <th className='border'>ACTION</th>
                        </tr>
                    </thead>
                    <tbody className='border'>
                        {content}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AllOrders;