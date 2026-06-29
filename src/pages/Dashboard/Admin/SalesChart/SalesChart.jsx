import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    BarChart, Bar, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend,
} from 'recharts';
import DashboardButton from '../../DashboardButton';


const SalesChart = () => {
    const [totalSalesData, setTotalSalesData] = useState({ totalSales: 0, totalOrders: 0 });
    const [monthlySalesData, setMonthlySalesData] = useState([]);
    const [lastMonthSalesData, setLastMontSalesData] = useState([]);
    const [thisMonthSalesData, setThisMonthSalesData] = useState([]);
    const [lastSevenDaysData, setLastSevenDaysData] = useState([]);
    const [todaySalesData, setTodaySalesData] = useState({ totalSales: 0, count: 0 });

    useEffect(() => {
        axios.get('http://localhost:5000/api/sales/total')
            .then(res => setTotalSalesData(res.data))
            .catch(err => console.error("Error fetching total sales:", err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/api/sales/today')
            .then(res => setTodaySalesData(res.data))
            .catch(err => console.error("Error fetching today's sales:", err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/api/sales/monthly-summary')
            .then(res => setMonthlySalesData(res.data))
            .catch(err => console.error(err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/api/sales/last-month')
            .then(res => setLastMontSalesData(res.data))
            .catch(err => console.error("Last month chart error:", err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/api/sales/this-month')
            .then(res => setThisMonthSalesData(res.data))
            .catch(err => console.error("Error fetching this month sales:", err));
    }, []);

    useEffect(() => {
        axios.get('http://localhost:5000/api/sales/last-7-days')
            .then(res => setLastSevenDaysData(res.data))
            .catch(err => console.error("Error fetching last 7 days sales:", err));
    }, []);


    console.log(lastMonthSalesData)
    console.log(thisMonthSalesData)
    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>

            <section className='grid grid-cols-2 gap-4 mb-6 mt-0 lg:mt-6'>
                {/* Total Sales Overview */}
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-lg font-bold text-indigo-600 mb-2 underline">Total Sales</h2>
                    <p className="text-2xl font-extrabold text-indigo-600">৳ {totalSalesData.totalSales.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{totalSalesData.totalOrders} total order(s)</p>
                </div>

                {/* Today Sales */}
                <div className="bg-white rounded-xl shadow-md p-6 text-center">
                    <h2 className="text-lg font-bold text-green-600 mb-2 underline">Today’s Sales</h2>
                    <p className="text-2xl font-extrabold text-green-600">৳ {todaySalesData.totalSales.toLocaleString()}</p>
                    <p className="text-sm text-gray-500 mt-1">{todaySalesData.count} order(s)</p>
                </div>
            </section>

            <section className='lg:grid grid-cols-2 gap-6 my-8'>
                {/* Monthly Sales Overview */}
                <div className='bg-white p-6 rounded-xl shadow-xl'>
                    <h2 className="text-xl font-bold mb-4">Monthly Sales Overview</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={monthlySalesData}>
                            <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Last Month Daily Sales */}
                <div className='bg-white p-6 rounded-xl shadow-xl mt-6 lg:mt-0'>
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Last Month’s Daily Sales</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={lastMonthSalesData}>
                            <CartesianGrid stroke="#ccc" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totalSales" fill="#4F46E5" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* This Month Daily Sales */}
                <div className="bg-white p-6 rounded-xl shadow-xl mt-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">This Month’s Daily Sales</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={thisMonthSalesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totalSales" fill="#16A34A" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Last 7 Days Sales */}
                <div className="bg-white p-6 rounded-xl shadow-xl mt-6">
                    <h2 className="text-xl font-bold mb-4 text-gray-700">Last 7 Days Daily Sales</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={lastSevenDaysData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="_id" />
                            <YAxis />
                            <Tooltip formatter={(value) => value.toLocaleString()} />
                            <Bar dataKey="totalSales" fill="#2563EB" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </section>

        </div>
    );
};

export default SalesChart;