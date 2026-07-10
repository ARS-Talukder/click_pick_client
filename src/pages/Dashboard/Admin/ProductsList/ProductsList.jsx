import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import ProductTable from './ProductTable';
import DashboardButton from '../../DashboardButton';
import Loading from '../../../Shared/Loading';
import Pagination from '../../../Shared/Pagination';

const ProductsList = () => {
    // Current page and products per page is to send for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    const { data: products, isLoading, isSuccess, isError, error, refetch } = useQuery({
        queryKey: ["products", currentPage],
        queryFn: () => {
            return axios.get(`http://localhost:5000/products_paginated?page=${currentPage}&limit=${productsPerPage}`)
        }
    })

    // Calculating the page number for pagination
    const totalProducts = products?.data?.totalProducts || 0;
    const totalPages = Math.ceil(totalProducts / productsPerPage);


    let content;

    if (isLoading) {
        return <Loading></Loading>
    }

    if (isSuccess) {
        content = products.data.products.map((product, index) => <ProductTable key={product._id} index={(currentPage - 1) * productsPerPage + index} product={product} refetch={refetch}></ProductTable>)
    }
    return (
        <div className='py-2'>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>
            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Products List</h2>
            </div>
            <div className="overflow-x-auto bg-white rounded-xl shadow-xl my-6 pb-6">
                <table className="table table border">
                    <thead className='bg-blue-700 text-white'>
                        <tr>
                            <th className='border'>SL</th>
                            <th className='border'>PRODUCT</th>
                            <th className='border'>CATEGORY</th>
                            <th className='border'>PRICE</th>
                            <th className='border'>DISCOUNT</th>
                            <th className='border'>Shipping</th>
                            <th className='border'>ACTION</th>
                        </tr>
                    </thead>
                    <tbody className='border'>
                        {content}
                    </tbody>
                </table>
                <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />
            </div>
        </div>
    );
};

export default ProductsList;