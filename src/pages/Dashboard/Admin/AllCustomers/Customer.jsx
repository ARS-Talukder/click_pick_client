import React from 'react';
import toast from 'react-hot-toast';
import { AiFillDelete } from "react-icons/ai";

const Customer = ({ customer, index, refetch }) => {
    const { _id, name, email, phone, role } = customer;
    const handleDelete = (id) => {
        const proceed = window.confirm('Do You Want to remove this order information from database?');
        if (proceed) {
            fetch(`http://localhost:5000/customer-delete/${_id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    toast.success("Removed");
                    refetch();
                })
        }
        else {
            return;
        }
    }
    return (
        <tr className='text-slate-600 font-bold'>
            <th className='border'>{index + 1}</th>
            <td className='border flex items-center'>
                <div className="avatar">
                    <div className="w-8 rounded-full ring ring-primary">
                        <img src="https://i.ibb.co/ctFS6Qt/login-Avatar.png" />
                    </div>
                </div>
                <p className='ml-4'>{name}</p>
            </td>
            <td className='border'>{email === 'No Email' ? <span className='text-red-500'>N/A</span> : <span>{email}</span>}</td>
            <td className='border'>{phone === 'No Mobile Number' ? <span className='text-red-500'>N/A</span> : <span>{phone}</span>}</td>
            <td className='border'>
                {
                    role == 'admin' ?
                        <p className='font-bold text-green-600'>ADMIN</p> :
                        <button onClick={() => handleDelete(_id)} className='p-1 bg-red-100 rounded hover:bg-red-200' title="Delete">
                            <AiFillDelete className="text-2xl text-red-500"></AiFillDelete>
                        </button>
                }
            </td>
        </tr>
    );
};

export default Customer;