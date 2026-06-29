import React, { useEffect } from 'react';
import Product from './Product';
import { useQuery } from '@tanstack/react-query';
import Loading from '../../Shared/Loading';
import { FaLongArrowAltRight } from "react-icons/fa";
import axios from 'axios';
import { Link } from 'react-router-dom';

const Products = () => {
    const { data: products, isLoading, isSuccess, isError, error } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return axios.get("https://click-pick-server.onrender.com/products")
        }
    })
    useEffect(() => {
        if (!isSuccess || !products?.data) return;

        // Track if already fired in this render cycle
        let hasPushed = false;

        if (!hasPushed) {
            window.dataLayer.push({ ecommerce: null });
            window.dataLayer.push({
                event: "view_item_list",
                ecommerce: {
                    currency: "BDT",
                    items: products.data,
                },
                pagePath: window.location.pathname,
            });
            hasPushed = true;
        }
    }, [isSuccess, products?.data]);

    let content;

    if (isLoading) {
        return <Loading></Loading>
    }

    if (isSuccess) {
        content = products.data.map(product => <Product key={product._id} product={product}></Product>)
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

        </div>
    );
};

export default Products;