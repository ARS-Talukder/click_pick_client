import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import ProductSlider from './ProductSlider/ProductSlider';
import ProductDescription from './ProductDescription/ProductDescription';
import ProductOthers from './ProductOthers/ProductOthers';
import MoreProducts from './MoreProducts/MoreProducts';

const ProductDetails = () => {
    const { state } = useLocation();
    const product = state;
    const { name, price, discount, category, images, description, productColor, size, whyBest } = product;

    return (
        <div className='lg:px-48'>
            <section className='lg:flex md:flex bg-gray-50 p-4'>
                <ProductSlider images={images}></ProductSlider>
                <ProductDescription product={product}></ProductDescription>
            </section>

            <section className='my-6 bg-gray-50'>
                <ProductOthers product={product}></ProductOthers>
            </section>

        </div>
    );
};

export default ProductDetails;