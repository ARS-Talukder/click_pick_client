import React, { useEffect, useState } from 'react';
import Product from './Product';
import Pagination from '../../Shared/Pagination';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../Shared/Loading';
import { FaLongArrowAltRight } from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';
import API from '../../../api/api';

const Products = () => {
    // Current page and products per page is to send for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 10;

    const { data: products, isLoading, isSuccess, isError, error } = useQuery({
        queryKey: ["products", currentPage],
        queryFn: () => {
            return API.get(`/products_paginated?page=${currentPage}&limit=${productsPerPage}`)
        }
    })


    // Calculating the page number for pagination
    const totalProducts = products?.data?.totalProducts || 0;
    const totalPages = Math.ceil(totalProducts / productsPerPage);

    let content;

    if (isLoading) {
        return <Loading />
    }

    if (isSuccess) {
        content = products.data.products.map(product => <Product key={product._id} product={product}></Product>)
    }


    return (
        <div className='mb-6'>
            <div className='flex justify-between mb-2'>
                <h2 className='text-2xl font-bold text-slate-600 mb-2 underline'>Products</h2>
                <Link to="/all_products" className='btn btn-accent btn-xs'>
                    <p>See all</p>
                    <span><FaLongArrowAltRight /></span>
                </Link>
            </div>
            <div className='grid grid-cols-2 lg:grid-cols-6 md:grid-cols-4 gap-5'>
                {content}
            </div>

            <Pagination currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages} />

        </div>
    );
};

export default Products;