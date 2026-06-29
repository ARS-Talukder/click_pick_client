import React, { useState } from 'react';
import CartProduct from './CartProduct';
import { Link } from 'react-router-dom';
import { useCart } from '../../../ContextReducer';
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const Cart = () => {
    let data = useCart();
    let subTotal = 0;

    let content;
    if (data.length === 0) {
        return (
            <div className='h-80 flex justify-center items-center'>
                <h2 className='text-xl font-bold text-blue-500'>Your Cart is Empty!!</h2>
            </div>
        )
    }
    else {
        content = data.map((product, index) =>
            <CartProduct index={index} key={product.product_id} product={product}></CartProduct>
        )
        //This loop is for counting SubTotal of all cart products
        for (let i = 0; i < data.length; i++) {
            const discountPrice = data[i].discount_price;
            const quantity = data[i].quantity;
            const multiplication = discountPrice * quantity;
            subTotal = subTotal + multiplication;
        }

        // Clear previous ecommerce data before pushing the new product
        window.dataLayer.push({ ecommerce: null });

        // Pushing Data to the Data Layer for Google data manager(GTM)
        window.dataLayer.push({
            event: 'view_cart',
            gtm: {
                uniqueEventId: new Date().getTime(), // Ensure unique event ID
                historyChangeSource: "pushState",
                oldHistoryState: null, // Reset old history state
                newHistoryState: { usr: null, key: "new_key", idx: 2 }, // Keep new state
            },
            ecommerce: {
                currency: 'BDT',
                items: data
            },
            pagePath: window.location.pathname,
        });


    }

    console.log(data)
    return (
        <div className='lg:flex md:flex justify-center px-6 py-4 lg:px-20 md:px-4 lg:py-10'>
            {/* ------Products Section------ */}
            <div className='lg:w-2/3 md:w-2/3 my-8 lg:my-0 md:my-0'>
                <div className="overflow-x-auto">
                    <table className="table border">
                        <thead>
                            <tr className='bg-base-200'>
                                <th className='text-center font-bold' colSpan={4}>Your Orders</th>
                            </tr>
                            <tr className=''>
                                <th className='text-center'>Product</th>
                                <th>Price</th>
                                <th>Sub Total</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                content
                            }

                        </tbody>
                    </table>
                </div>

                <div className='flex justify-end'>
                    <div className='w-full lg:w-1/2 border py-1 px-8 my-4'>
                        <div className='flex justify-between my-4'>
                            <p className='font-bold'><small>Subtotal</small></p>
                            <p className='font-bold flex justify-center items-center'>
                                <span className='text-xs'><FaBangladeshiTakaSign /></span>
                                <span><small>{subTotal}</small></span>
                            </p>
                        </div>
                        <hr />
                        <div className='flex justify-between my-6'>
                            <p className='font-bold'><small>Shipping</small></p>
                            <p className='text-slate-500 w-2/3 text-right'><small>Shipping options will be updated during checkout</small></p>
                        </div>
                        <hr />
                        <div className='flex justify-between my-4'>
                            <p className='font-bold text-red-600'><small>Total</small></p>
                            <p className='font-bold text-red-600 flex justify-center items-center'>
                                <span className='text-xs'><FaBangladeshiTakaSign /></span>
                                <span>{subTotal}</span>
                            </p>

                        </div>

                        <div className='flex justify-center mt-6 mb-4'>
                            <Link to='/checkout' className='w-full btn text-white bg-blue-500 hover:bg-blue-600'>Proceed to checkout</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Cart;