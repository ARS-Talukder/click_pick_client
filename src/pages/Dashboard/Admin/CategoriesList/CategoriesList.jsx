import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import CategoryTable from './CategoryTable';
import DashboardButton from '../../DashboardButton';
import Loading from '../../../Shared/Loading';
import API from '../../../../api/api';
import Pagination from '../../../Shared/Pagination';

const CategoriesList = () => {
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data: categories, isLoading, isSuccess, isError, error, refetch } = useQuery({
        queryKey: ["categories", page],
        queryFn: () => {
            return API.get(`/categories_paginated?page=${page}&limit=${limit}`)
        }
    })
    let content;

    if (isLoading) {
        return <Loading />
    }

    if (isSuccess) {
        content = categories.data.categories.map((category, index) => <CategoryTable key={category._id} index={(page - 1) * limit + index} category={category} refetch={refetch}></CategoryTable>)
    }
    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>
            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Categories List <span className='text-green-600'>({categories?.data?.totalCategories || 0})</span></h2>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-xl my-6 pb-6">
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
                {categories?.data?.totalCategories > limit && (
                    <Pagination
                        currentPage={page}
                        setCurrentPage={setPage}
                        totalPages={Math.ceil(categories.data.totalCategories / limit)}
                    />
                )}
            </div>
        </div>
    );
};

export default CategoriesList;