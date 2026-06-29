import React, { useState } from 'react';
import { useCart, useDispatchCart } from '../../../../ContextReducer';
import CartDrawerSingle from './CartDrawerSingle';
import { Link } from 'react-router-dom';
import { BsCartCheck } from "react-icons/bs";


const CartDrawer = ({ isOpen, setIsOpen }) => {
    let data = useCart();
    let subTotal = 0;

    let content;
    if (data.length > 0) {
        content = data.map((product, index) =>
            <CartDrawerSingle key={product.product_id} product={product} index={index}></CartDrawerSingle>
        )
        //This loop is for counting SubTotal of all cart products
        for (let i = 0; i < data.length; i++) {
            const discountPrice = data[i].discount_price;
            const quantity = data[i].quantity;
            const multiplication = discountPrice * quantity;
            subTotal = subTotal + multiplication;
        }
    }
    else {
        content = <div className='text-center py-4'>
            <div className='flex justify-center'>
                <p className='text-7xl text-slate-200'><BsCartCheck /></p>
            </div>
            <h1 className='font-bold text-slate-500 my-4'>No products in the cart</h1>

            <Link to='/' className='btn px-6 rounded text-white bg-blue-500 hover:bg-blue-600 rounded-lg my-2'>Return to shop</Link>
        </div>
    }
    return (
        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl z-50 transition-transform duration-300 ease-in-out text-black font-normal
            ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
            <div className="p-4 flex justify-between items-center border-b">
                <h2 className="text-xl font-semibold">Shopping cart</h2>
                <button onClick={() => setIsOpen(false)} className="font-normal hover:text-gray-400">✕ Close</button>
            </div>

            <div className="p-4 overflow-y-auto h-[calc(100%-60px)]">
                <div>
                    {content}
                </div>

                {data.length > 0 && <div className='py-4'>
                    <div className='text-lg flex justify-between'>
                        <p>Subtotal:</p>
                        <p className='font-bold text-red-600'>৳{subTotal}</p>
                    </div>
                    <Link to='/cart' className='w-full h-10 flex justify-center items-center bg-blue-100 hover:bg-blue-400 text-blue-600 hover:text-white rounded my-4 inline-block'>
                        <span>VIEW CART</span>
                    </Link>

                    <Link to='/checkout' className='w-full h-10 flex justify-center items-center bg-red-600 hover:bg-red-700 text-white rounded inline-block'>
                        <span>CHECKOUT</span>
                    </Link>

                </div>}
            </div>


        </div>
    );
};

export default CartDrawer;