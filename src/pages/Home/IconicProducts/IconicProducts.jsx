import React, { useEffect } from 'react';
import Product from '../Products/Product';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../../Shared/Loading';
import API from '../../../api/api';

const IconicProducts = () => {
    const { data: iconicCategories, isLoading, isSuccess } = useQuery({
        queryKey: ["iconicCategories"],
        queryFn: () => API.get("/iconic_categories")
    });

    if (isLoading) return <Loading />;
    return (
        <div className="space-y-10 mb-10">
            {isSuccess && iconicCategories.data.map((category) => (
                <div key={category._id} className="border border-red-200 bg-red-50 px-1 lg:px-4 md:px-4 py-4 rounded-lg">

                    {/* Category Header */}
                    <div className="flex items-center mb-4 px-2">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 text-slate-700">
                            {category.name}
                        </h2>
                    </div>

                    {/* Products Grid */}
                    {category.products?.length > 0 ? (
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-5">
                            {category.products.map((product) => (
                                <div key={product._id} className="bg-white rounded-lg shadow">
                                    <Product product={product} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 italic">No products added yet.</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default IconicProducts;