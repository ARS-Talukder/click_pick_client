import React, { useEffect, useState } from 'react';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { useCart, useDispatchCart } from '../../ContextReducer';
import toast from 'react-hot-toast';
import { FaTruckFast } from "react-icons/fa6";
import { Link, useNavigate } from 'react-router-dom';
import { dataLayer } from 'react-gtm-module';
import CartDrawer from './Cart/CartDrawer/CartDrawer';

const Product = ({ product }) => {
    const { _id, name, category, images, price, discount, discount_price, shippingCharge, size, productColor } = product;
    const navigate = useNavigate();
    const img = images[0]?.url;

    // Cart Drawer open and close handling
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const navigateToProductsDetails = () => {
        navigate(`/product/${_id}`, { state: product })
    }

    const handleOrderNow = async () => {
        if (size.length > 0 || productColor.length > 0) {
            navigate(`/product/${_id}`, { state: product })
            return
        }
        await dispatch({ type: "ADD", product_id: _id, name: name, category: category, img: img, price: price, discount: discount, discount_price: discount_price, size: size, productColor: productColor, shippingCharge: shippingCharge, quantity: 1 });
        toast.success('Added')
        navigate('/checkout', { state: product })

        // Clear previous ecommerce data before pushing the new product
        window.dataLayer.push({ ecommerce: null });

        // Pushing Data to the Data Layer for Google data manager(GTM)
        window.dataLayer.push({
            event: 'begin_checkout',
            gtm: {
                uniqueEventId: new Date().getTime(), // Ensure unique event ID
                historyChangeSource: "pushState",
                oldHistoryState: null, // Reset old history state
                newHistoryState: { usr: null, key: "new_key", idx: 2 }, // Keep new state
            },
            ecommerce: {
                currency: 'BDT',
                value: parseFloat(price),
                items: [{ product_id: _id, name: name, category: category, img: img, price: price, discount: discount, discount_price: discount_price, size: size, productColor: productColor, shippingCharge: shippingCharge, quantity: 1 }]
            },
            buttonText: 'Order Now',
            buttonClick: 'Clicked',
            pagePath: window.location.pathname,
        });
    }

    let productAdded = false;
    let dispatch = useDispatchCart();
    let data = useCart();

    const handleAddToCart = async () => {
        if (size.length > 0 || productColor.length > 0) {
            navigate(`/product/${_id}`, { state: product })
            return
        }
        await dispatch({ type: "ADD", product_id: _id, name: name, category: category, img: img, price: price, discount: discount, discount_price: discount_price, shippingCharge: shippingCharge, quantity: 1 });
        setIsDrawerOpen(true);

        // Clear previous ecommerce data before pushing the new product
        window.dataLayer.push({ ecommerce: null });

        // Pushing Data to the Data Layer for Google data manager(GTM)
        window.dataLayer.push({
            event: 'add_to_cart',
            gtm: {
                uniqueEventId: new Date().getTime(), // Ensure unique event ID
                historyChangeSource: "pushState",
                oldHistoryState: null, // Reset old history state
                newHistoryState: { usr: null, key: "new_key", idx: 2 }, // Keep new state
            },
            ecommerce: {
                currency: 'BDT',
                value: parseFloat(price),
                items: [{ product_id: _id, name: name, category: category, img: img, price: price, discount: discount, discount_price: discount_price, shippingCharge: shippingCharge, quantity: 1 }]
            },
            buttonText: 'Add To Cart',
            buttonClick: 'Clicked',
            pagePath: window.location.pathname,
        });
    }

    if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
            const data_id = data[i].product_id;
            if (data_id === _id) {
                productAdded = true
            }
        }
    }

    return (
        <div className='text-slate-700 font-sans border-2 rounded-lg hover:border-blue-500 pt-1 relative bg-white shadow-sm hover:shadow-md transition-shadow'>
            {/* Overlay. It creates darker the page when drawer opens */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
                    onClick={() => setIsDrawerOpen(false)}
                ></div>
            )}
            <div>
                <div onClick={navigateToProductsDetails} className="cursor-pointer">
                    <div className='h-48 px-1 flex items-center justify-center bg-white'>
                        <img className='max-h-full max-w-full object-contain' src={img} alt={name} />
                    </div>
                    <div className="px-3 mt-2">
                        <h3
                            className="font-semibold text-sm mb-2 leading-5"
                            style={{
                                display: "-webkit-box",
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: "vertical",
                                overflow: "hidden",
                                lineHeight: "1.4em",
                                maxHeight: "2.8em",
                                minHeight: "2.8em"
                            }}
                        >
                            {name}
                        </h3>
                        <div className='mb-2 min-h-[72px]'>
                            <p className={price == discount_price ? 'hidden' : 'flex items-center text-xl font-bold text-red-600'}>
                                <span className='text-xs mr-0.5'><FaBangladeshiTakaSign /></span>
                                <span>{discount_price}</span>
                            </p>
                            <div className="flex items-center justify-start gap-2">
                                <p className={price == discount_price ? 'flex items-center text-xl font-bold text-red-600' : 'flex items-center font-medium line-through text-gray-500 text-sm'}>
                                    <span className='text-xs mr-0.5'><FaBangladeshiTakaSign /></span>
                                    <span>{price.toLocaleString('en-IN')}</span>
                                </p>
                                {discount > 0 && (
                                    <span className="text-xs font-medium bg-red-600 text-white px-1.5 py-0.5 rounded">
                                        {discount}% OFF
                                    </span>
                                )}
                            </div>
                            {discount > 0 && (
                                <p className="text-xs text-green-600 font-medium mt-1">
                                    You saved BDT <span className='border px-1'>{(price - discount_price).toLocaleString('en-IN')}</span>
                                </p>
                            )}
                        </div>
                    </div>
                </div>
                <div className='px-3 pb-3'>
                    <button onClick={handleOrderNow} className='mt-1 flex justify-center items-center w-full h-9 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md text-sm'><span>ORDER NOW</span></button>
                    {
                        productAdded === false ?
                            <button onClick={handleAddToCart} className='my-1 flex justify-center items-center w-full h-9 bg-red-600 hover:bg-red-700 text-white font-medium rounded-md text-sm'><span>Add To Cart</span></button>
                            :
                            <button className='my-1 flex justify-center items-center w-full h-9 bg-red-300 text-white rounded-md text-sm' disabled><span>Added</span></button>
                    }
                </div>
            </div>

            {/* Free Shipping Badge */}
            {
                shippingCharge !== 'normal' && (
                    <div className='bg-green-600 px-2 flex items-center text-white rounded-full py-1 absolute top-2 left-2'>
                        <p className='text-sm'><FaTruckFast /></p>
                        <p className='mx-1 text-xs'><small>FREE DELIVERY</small></p>
                    </div>
                )
            }

            <CartDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
        </div>
    );
};

export default Product;