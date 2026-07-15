import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Loading from '../../Shared/Loading';
import Product from '../Products/Product';
import Pagination from '../../Shared/Pagination';
import API from '../../../api/api';

const SearchProducts = () => {
    const [searchParams] = useSearchParams();
    const search = searchParams.get("q") || "";

    const [page, setPage] = React.useState(1);
    const limit = 30;
    const {
        data: products = [],
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ["search-products", search, page],
        enabled: !!search,
        queryFn: async () => {
            const res = await API.get(
                `/products/search?q=${search}&page=${page}&limit=${limit}`
            );
            return res.data;
        },
    });
    if (isLoading) {
        return <Loading />;
    }
    if (isError) {
        return (
            <h2 className="text-red-500 text-center">
                {error.message}
            </h2>
        );
    }

    return (
        <div className='px-5 lg:px-16 md:px-8 py-6'>
            <h2>
                <Link to="/" className='text-blue-800'>Home</Link>
                <span>{" > Search Results"}</span>
            </h2>

            <div className='my-8'><hr /></div>

            <div className='my-4'>
                <h1 className='text-xl font-bold'>{search}</h1>
                <p className='text-gray-500'>{products?.totalProducts || 0} items found for {`"${search}"`}</p>
            </div>

            {products?.products.length ? (
                <>
                    <div className='grid grid-cols-2 lg:grid-cols-6 md:grid-cols-4 gap-5 mb-8'>
                        {products?.products.map(product => (
                            <Product
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>

                    {/* PAGINATION HERE */}
                    {
                        products?.totalProducts > limit && (
                            <Pagination
                                currentPage={page}
                                setCurrentPage={setPage}
                                totalPages={Math.ceil(products?.totalProducts / limit)}
                            />
                        )
                    }

                </>
            ) : (
                <h2 className='text-xl font-bold text-red-500 text-center py-32'>
                    {products?.totalProducts} items found for {"{search}"}
                </h2>
            )}
        </div>
    );
};

export default SearchProducts;