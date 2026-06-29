import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { BsCartCheck } from "react-icons/bs";


const Confirmed = () => {
    const location = useLocation();
    const orderID = location.state;

    return (
        <div className='text-center py-32'>
            <div className='flex justify-center my-4'>
                <p className='text-6xl text-blue-600'><BsCartCheck /></p>
            </div>
            <h1 className='text-blue-600 font-bold my-4'>Thank you for shopping with PeakyOnline!</h1>
            <p>Order placed successfully</p>
            <p className='text-slate-500 my-4'>Your order number is: <span className='font-bold'>{orderID}</span></p>

            <Link to='/' className='btn px-16 rounded text-white bg-blue-500 hover:bg-blue-600'>Continue Shopping</Link>
        </div>
    );
};

export default Confirmed;