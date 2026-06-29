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
    useEffect(() => {
        if (product) {
            // Clear previous ecommerce data before pushing the new product
            window.dataLayer.push({ ecommerce: null });

            // Pushing Data to the Data Layer for Google data manager(GTM)
            window.dataLayer.push({
                event: 'view_item',
                gtm: {
                    uniqueEventId: new Date().getTime(), // Ensure unique event ID
                    historyChangeSource: "pushState",
                    oldHistoryState: null, // Reset old history state
                    newHistoryState: { usr: null, key: "new_key", idx: 2 }, // Keep new state
                },
                ecommerce: {
                    currency: 'BDT',
                    value: parseFloat(price),
                    items: [product]
                },
                pagePath: window.location.pathname,
            });
        }
    }, [product, price]);
    console.log(product)

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