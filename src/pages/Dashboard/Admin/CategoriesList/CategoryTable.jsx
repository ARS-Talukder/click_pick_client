import React from 'react';
import toast from 'react-hot-toast';
import { AiFillDelete } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { MdEdit } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { SERVER_URL } from '../../../../api/api';

const CategoryTable = ({ index, category, refetch }) => {
    const navigate = useNavigate();
    const { _id, name, img, totalProducts } = category;
    const handleDelete = (id) => {
        const proceed = window.confirm(
            "Do you want to delete this category?"
        );

        if (!proceed) return;

        fetch(`${SERVER_URL}/category-delete/${id}`, {
            method: "DELETE",
        })
            .then(res => res.json())
            .then(data => {

                if (data.success) {
                    toast.success("Category deleted.");
                    refetch();
                } else {
                    toast.error(data.message);
                }

            })
            .catch(err => {
                toast.error("Something went wrong.");
            });
    };

    const handleEdit = (id) => {
        navigate(`/dashboard/edit_category/${id}`)
    }

    const handleView = (name) => {
        navigate(`/dashboard/category_products/${name}`)
    }
    return (
        <tr className='text-slate-600 font-bold'>
            <th className='border'>{index + 1}</th>
            <td className='border'>
                <div className='flex items-center'>
                    <span>{name} ({totalProducts})</span>
                </div>
            </td>

            <td className='border'>
                <div className='flex items-center'>
                    <span className='mr-4'><img src={img} width={40} alt="product_img" /></span>
                </div>
            </td>

            <td className='border'>
                <button className='p-1 bg-green-100 rounded hover:bg-green-200' title="Edit">
                    <MdEdit onClick={() => handleEdit(_id)} className="text-2xl text-green-500"></MdEdit>
                </button>

                <button onClick={() => handleDelete(_id)} className='p-1 bg-red-100 rounded hover:bg-red-200 mx-2' title="Delete">
                    <AiFillDelete className="text-2xl text-red-500"></AiFillDelete>
                </button>

                <button onClick={() => handleView(name)} className='p-1 bg-blue-100 rounded hover:bg-blue-200' title="Delete">
                    <GrView className="text-2xl text-blue-500"></GrView>
                </button>
            </td>
        </tr>
    );
};

export default CategoryTable;