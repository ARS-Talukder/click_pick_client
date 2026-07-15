import React, { useEffect } from 'react';
import SpecialProducts from '../SpecialProducts/SpecialProducts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../../Shared/Loading';
import CountdownTimer from '../../Shared/CountdownTimer';
import Product from '../Products/Product';
import API from '../../../api/api';

const Campaign = () => {
    const { data: specialCategories, isLoading, isSuccess } = useQuery({
        queryKey: ["specialCategories"],
        queryFn: () => API.get("/special_categories")
    });

    if (isLoading) return <Loading />;

    return (
        <div className="space-y-10 my-10 px-5 lg:px-24 md:px-8">
            <div className='bg-gray-100 p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Campaign</h2>
            </div>

            {isSuccess && specialCategories.data.map((category) => (
                <div key={category._id} className="border border-red-200 bg-red-50 px-1 lg:px-4 md:px-4 py-4 rounded-lg">

                    {/* Category Header */}
                    <div className="flex items-center mb-4 px-2">
                        <h2 className="text-lg md:text-xl lg:text-2xl font-bold text-gray-800 flex items-center gap-2 text-slate-700">
                            {category.name}
                        </h2>

                        {category.startTime && category.endTime && (
                            <div className="md:mt-0 mx-2 lg:mx-8">
                                <CountdownTimer
                                    startTime={category.startTime}
                                    endTime={category.endTime}
                                />
                            </div>
                        )}
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
                        <p className="text-gray-500 italic">No Campaigns are running right now</p>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Campaign;