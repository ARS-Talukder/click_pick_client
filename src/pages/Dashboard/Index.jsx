import React from 'react';
import { FaProductHunt } from "react-icons/fa6";
import { TbCategoryFilled } from "react-icons/tb";
import { FaCartArrowDown } from "react-icons/fa";
import { FaPeopleGroup } from "react-icons/fa6";
import DashboardButton from './DashboardButton';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import Loading from '../Shared/Loading';
import useAdmin from '../hooks/useAdmin';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';

const fetchAllData = async () => {
    const [products, categories, orders, customers] = await Promise.all([
        axios.get("http://localhost:5000/products"),
        axios.get("http://localhost:5000/categories"),
        axios.get("http://localhost:5000/orders"),
        axios.get("http://localhost:5000/customers")
    ]);

    return {
        products: products.data,
        categories: categories.data,
        orders: orders.data,
        customers: customers.data
    };
};

const Index = () => {
    const [user, loading] = useAuthState(auth);
    const [admin, adminLoading] = useAdmin(user);
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["dashboardData"],
        queryFn: fetchAllData
    });

    if (isLoading || loading || adminLoading) {
        <Loading></Loading>
    }
    if (isError) return <p>Error: {error.message}</p>;
    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>
            <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:py-4 px-2 md:px-20'>
                <div className='h-48 bg-green-600 rounded-xl p-8 flex justify-between'>
                    <div>
                        <h2 className='text-2xl font-bold text-white'>Total Products</h2>
                        <h3 className='text-4xl text-white font-bold my-2'>{data?.products?.length}</h3>
                    </div>
                    <span className='text-6xl text-yellow-700'><FaProductHunt /></span>
                </div>

                <div className='h-48 bg-purple-600 rounded-xl p-8 flex justify-between'>
                    <div>
                        <h2 className='text-2xl font-bold text-white'>Total Categories</h2>
                        <h3 className='text-4xl text-white font-bold my-2'>{data?.categories.length}</h3>
                    </div>
                    <span className='text-6xl text-purple-100'><TbCategoryFilled /></span>
                </div>

                {
                    admin &&
                    <div className='h-48 bg-sky-600 rounded-xl p-8 flex justify-between'>
                        <div>
                            <h2 className='text-2xl font-bold text-white'>Total Orders</h2>
                            <h3 className='text-4xl text-white font-bold my-2'>{data?.orders.length}</h3>
                        </div>
                        <span className='text-6xl text-sky-100'><FaCartArrowDown /></span>
                    </div>
                }

                {
                    admin &&
                    <div className='h-48 bg-yellow-600 rounded-xl p-8 flex justify-between'>
                        <div>
                            <h2 className='text-2xl font-bold text-white'>Customers</h2>
                            <h3 className='text-4xl text-white font-bold my-2'>{data?.customers.length}</h3>
                        </div>
                        <span className='text-6xl text-purple-100'><FaPeopleGroup /></span>
                    </div>
                }
            </div>
        </div>
    );
};

export default Index;