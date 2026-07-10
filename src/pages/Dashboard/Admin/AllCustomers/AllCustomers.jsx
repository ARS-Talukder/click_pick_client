import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import Customer from './Customer';
import Loading from '../../../Shared/Loading';
import DashboardButton from '../../DashboardButton';

const AllCustomers = () => {
    const { data: customers, isLoading, isSuccess, isError, error, refetch } = useQuery({
        queryKey: ["customers"],
        queryFn: () => {
            return axios.get("http://localhost:5000/customers")
        }
    })

    let content;

    if (isLoading) {
        return <Loading></Loading>
    }

    if (isSuccess) {
        content = customers.data.map((customer, index) => <Customer index={index} key={customer._id} customer={customer} refetch={refetch}></Customer>)
    }

    return (
        <div className='py-2'>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>
            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>All Customers</h2>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-xl my-6">
                <table className="table table border">
                    <thead className='bg-blue-700 text-white'>
                        <tr className='text-center'>
                            <th className='border'>SL</th>
                            <th className='border'>Name</th>
                            <th className='border'>Email</th>
                            <th className='border'>Phone</th>
                            <th className='border'>Action</th>
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

export default AllCustomers;