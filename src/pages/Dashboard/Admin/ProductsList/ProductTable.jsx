import React from 'react';
import toast from 'react-hot-toast';
import { AiFillDelete } from "react-icons/ai";
import { TiEdit } from "react-icons/ti";
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { MdEdit } from "react-icons/md";
import { GrView } from "react-icons/gr";
import { useNavigate } from 'react-router-dom';


const ProductTable = ({ index, product, refetch }) => {
    const { _id, name, category, images, price, discount, discount_price, shippingCharge } = product;
    const img = images[0]?.url;

    const navigate = useNavigate();

    const handleDelete = (id) => {
        const proceed = window.confirm('Do You Want to delete this product?');
        if (proceed) {
            fetch(`http://localhost:5000/product-delete/${id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    toast.success("Deleted");
                    refetch();
                })
        }
        else {
            return;
        }
    }
    const handleEdit = (id) => {
        navigate(`/dashboard/edit_product/${id}`)
    }
    return (
        <tr className='text-slate-600 font-bold'>
            <th className='border'>{index + 1}</th>
            <td className='border'>
                <div className='flex items-center'>
                    <span className='mr-4'><img src={img} width={40} alt="product_img" /></span>
                    <span>{name}</span>
                </div>
            </td>
            <td className='border'>
                {category}
            </td>
            <td className='border'>
                <div className=''>
                    <p className='flex items-center line-through'>
                        <span className='text-xs'><small><FaBangladeshiTakaSign /></small></span>
                        <span>{price}</span>
                    </p>
                    <p className='flex items-center text-blue-700'>
                        <span className='text-xs'><small><FaBangladeshiTakaSign /></small></span>
                        <span className='block'>{discount_price == "" ? price - ((discount * price) / 100) : discount_price}</span>
                    </p>
                </div>
            </td>
            <td className='border'>
                <div className='flex items-center'>
                    <span>{discount + "%"}</span>
                </div>
            </td>
            <td className='border'>
                <div className={shippingCharge == 'free' ? 'flex items-center text-red-600 font-bold' : 'flex items-center text-blue-600'
                }>
                    <span>{shippingCharge}</span>
                </div>
            </td>
            <td className='flex'>
                <button onClick={() => handleEdit(_id)} className='p-1 bg-green-100 rounded hover:bg-green-200 mx-2' title="Edit">
                    <MdEdit className="text-2xl text-green-500"></MdEdit>
                </button>

                <button onClick={() => handleDelete(_id)} className='p-1 bg-red-100 rounded hover:bg-red-200' title="Delete">
                    <AiFillDelete className="text-2xl text-red-500"></AiFillDelete>
                </button>
            </td>
        </tr>
    );
};

export default ProductTable;