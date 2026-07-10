import React from 'react';
import { useLocation } from 'react-router-dom';
import Product from './Product';
import Loading from '../../Shared/Loading';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

const AllProducts = () => {
    const { data: products, isLoading, isSuccess, isError, error } = useQuery({
        queryKey: ["products"],
        queryFn: () => {
            return axios.get("http://localhost:5000/products")
        }
    })
    let content;

    if (isLoading) {
        return <Loading></Loading>
    }

    if (isSuccess) {
        content = products.data.map(product => <Product key={product._id} product={product} />);
    }
    console.log(products)
    return (
        <div className='py-12 px-5 lg:px-24 md:px-8'>
            <div className='grid grid-cols-2 lg:grid-cols-6 md:grid-cols-4 gap-5'>
                {content}
            </div>

        </div>
    );
};

export default AllProducts;