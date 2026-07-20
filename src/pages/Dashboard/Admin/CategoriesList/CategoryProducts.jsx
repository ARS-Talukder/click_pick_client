import React from 'react';
import DashboardButton from '../../DashboardButton';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import API from '../../../../api/api';
import CategoryProduct from './CategoryProduct';
import Loading from '../../../Shared/Loading';

const CategoryProducts = () => {
    const { name } = useParams();

    const { data: products = [], isLoading: productsLoading, refetch } = useQuery({
        queryKey: ["category-products", name],
        queryFn: async () => {
            const res = await API.get(`/category/${name}`);
            return res.data;
        }
    });

    const { data: categories, isLoading: categoryLoading, isSuccess } = useQuery({
        queryKey: ["categories"],
        queryFn: () => API.get("/categories")
    });


    if (productsLoading || categoryLoading) {
        return <Loading />
    }

    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>
            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Category <span className='text-green-600'>({name})</span></h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                {products.map(product => (
                    <CategoryProduct
                        key={product._id}
                        product={product}
                        categories={categories}
                        refetch={refetch}
                    />
                ))}
            </div>
        </div>
    );
};

export default CategoryProducts;