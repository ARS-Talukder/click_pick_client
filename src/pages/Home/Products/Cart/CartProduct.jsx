import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { AiFillDelete } from "react-icons/ai";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useDispatchCart } from '../../../ContextReducer';

const CartProduct = ({ product, index }) => {
    const { product_id, name, price, img, discount, discount_price, quantity, color, size } = product;
    const [newQuantity, setNewQuantity] = useState(quantity);
    let dispatch = useDispatchCart();

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
        <tr>
            <td className='flex items-center'>
                <button className='btn btn-error btn-xs text-white font-bold' onClick={() => { dispatch({ type: "REMOVE", index: index }) }}>
                    {/* <AiFillDelete className="text-xl text-red-500"></AiFillDelete> */}
                    <small>Delete</small>
                </button>
                <img className='ml-4 mr-1' width={55} src={img} alt="product_image" />
                <div>
                    <p>{name}</p>
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
                </div>

            </td>
            <td>{discount_price}</td>

            <td>{discount_price * newQuantity}</td>
        </tr>
    );
};

export default CartProduct;