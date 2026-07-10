import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import CategoryTable from './CategoryTable';
import DashboardButton from '../../DashboardButton';
import Loading from '../../../Shared/Loading';

const CategoriesList = () => {
    const { data: categories, isLoading, isSuccess, isError, error, refetch } = useQuery({
        queryKey: ["categories"],
        queryFn: () => {
            return axios.get("http://localhost:5000/categories")
        }
    })
    let content;

    if (isLoading) {
        return <Loading></Loading>
    }

    if (isSuccess) {
        content = categories.data.map((category, index) => <CategoryTable key={category._id} index={index} category={category} refetch={refetch}></CategoryTable>)
    }
    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>
            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Categories List</h2>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-xl my-6">
                <table className="table table border">
                    <thead className='bg-blue-700 text-white'>
                        <tr>
                            <th className='border'>SL</th>
                            <th className='border'>CATEGORY</th>
                            <th className='border'>IMAGE</th>
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

export default CategoriesList;