import { useQuery } from '@tanstack/react-query';
import React from 'react';
import Loading from '../../../../Shared/Loading';
import Product from '../../Product';
import API from '../../../../../api/api';
import { Link, useNavigate } from 'react-router-dom';
import { FaLongArrowAltRight } from "react-icons/fa";

const RelatedProducts = ({ category, currentProductId }) => {
    const navigate = useNavigate();

    const {
        data: products = [],
        isLoading,
    } = useQuery({
        queryKey: ["related-products", category],
        queryFn: async () => {
            const res = await API.get(`/category/${category}`);
            return res.data;
        },
    });

    if (isLoading) {
        return <Loading />;
    }


    // Remove current product
    const relatedProducts = products
        .filter(product => product._id !== currentProductId)
        .slice(0, 6);

    if (relatedProducts.length === 0) {
        return null;
    }

     const navigateToInventory = name => {
        navigate(`/${name}`);
    }
    return (
        <div>

            <div className="flex justify-between items-center mb-6">

                <h2 className="text-xl font-bold">
                    Related Products
                </h2>

                <button to="/all_products" className='btn btn-accent btn-xs' onClick={() => navigateToInventory(category)}>
                    <p>See all</p>
                    <span><FaLongArrowAltRight /></span>
                </button>

            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">

                {relatedProducts.map(product => (
                    <Product
                        key={product._id}
                        product={product}
                    />
                ))}

            </div>

        </div>
    );
};

export default RelatedProducts;