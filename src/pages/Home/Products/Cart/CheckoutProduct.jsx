import React, { useState } from 'react';
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useDispatchCart } from '../../../ContextReducer';
import { MdDelete } from "react-icons/md";
import { FaBangladeshiTakaSign } from "react-icons/fa6";

const CheckoutProduct = ({ product, index }) => {
    const { product_id, name, price, img, discount, discount_price, quantity, color, size } = product;
    const [newQuantity, setNewQuantity] = useState(quantity);
    let dispatch = useDispatchCart();

    // Function to truncate name after 30 characters
    const truncateName = (text, maxLength = 30) => {
        if (text.length > maxLength) {
            return text.substring(0, maxLength) + '...';
        }
        return text;
    };

    const decrementQuantity = async () => {
        if (newQuantity > 1) {
            setNewQuantity(newQuantity - 1);
            await dispatch({ type: "UPDATE", product_id: product_id, quantity: newQuantity - 1 })
            return
        }
    }
    const incrementQuantity = async () => {
        setNewQuantity(newQuantity + 1);
        await dispatch({ type: "UPDATE", product_id: product_id, quantity: newQuantity + 1 })
    }

    return (
        <div className='flex justify-between items-center py-4 border-b'>
            <div className='flex items-center flex-1'>
                <p className='mr-2 text-red-600 p-0.5 hover:bg-red-300 hover:cursor-pointer rounded-full' onClick={() => { dispatch({ type: "REMOVE", index: index }) }}>
                    <MdDelete />
                </p>

                <img className='mr-2 rounded-xl' width={60} src={img} alt="product_image" />

                <div className='flex flex-col mr-2'>
                    <p className='font-medium'><small>{truncateName(name)}</small></p>
                    <div className='flex items-center mt-2'>
                        <div className='flex items-center'>
                            <button
                                className='w-6 h-6 flex items-center justify-center border border-gray-300 bg-gray-50 rounded-l'
                                onClick={decrementQuantity}
                            >
                                <FaMinus className="text-xs text-blue-500" />
                            </button>
                            <div className='w-8 h-6 flex items-center justify-center border-t border-b border-gray-300'>
                                <span className='text-sm'>{newQuantity}</span>
                            </div>
                            <button
                                className='w-6 h-6 flex items-center justify-center border border-gray-300 bg-gray-50 rounded-r'
                                onClick={incrementQuantity}
                            >
                                <FaPlus className="text-xs text-blue-500" />
                            </button>
                        </div>

                        <div className='flex ml-4 space-x-2'>
                            {color?.length > 0 && (
                                <span className='px-2 py-1 bg-gray-400 text-white text-xs font-bold rounded'>
                                    {color}
                                </span>
                            )}
                            {size?.length > 0 && (
                                <span className='px-2 py-1 bg-gray-400 text-white text-xs font-bold rounded'>
                                    {size}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className='font-semibold'>
                <span className='flex items-center'><FaBangladeshiTakaSign className='text-xs' />{(discount_price * newQuantity)}</span>
            </div>
        </div>
    );
};

export default CheckoutProduct;