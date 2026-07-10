import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import toast from 'react-hot-toast';
import { FaCloudUploadAlt } from "react-icons/fa";
import Loading from '../../../Shared/Loading';
import DashboardButton from '../../DashboardButton';
import { AiFillDelete } from "react-icons/ai";

const Coupon = () => {
    const { data: coupons, isLoading, isSuccess, isError, error, refetch } = useQuery({
        queryKey: ["coupons"],
        queryFn: () => {
            return axios.get("http://localhost:5000/coupons")
        }
    })

    let content;

    if (isLoading) {
        return <Loading></Loading>
    }

    if (isSuccess) {
        if (coupons?.data.length > 0) {
            content = coupons?.data.map((c, index) => (
                <tr key={c._id} className='text-slate-600 font-bold'>
                    <th className='border text-center'>{index + 1}</th>
                    <th className='border text-center'>{c.coupon_code}</th>
                    <th className='border text-center'>{c.coupon_discount} tk</th>
                    <td className='border text-center'>
                        <button onClick={() => handleDelete(c._id)} className='p-1 bg-red-100 rounded hover:bg-red-200' title="Delete">
                            <AiFillDelete className="text-2xl text-red-500"></AiFillDelete>
                        </button>
                    </td>
                </tr>
            ));
        }
        else {
            content = <p>No coupons right now</p>
        }
    }

    const handleDelete = (id) => {
        const proceed = window.confirm('Want to delete?');
        if (proceed) {
            fetch(`http://localhost:5000/coupon/${id}`, {
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

    const handleAddCoupon = (e) => {
        e.preventDefault();

        const coupon_code = e.target.coupon_code.value;
        const coupon_discount = e.target.coupon_discount.value;

        const coupon = { coupon_code, coupon_discount };
        console.log(coupon)

        fetch('http://localhost:5000/coupon', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(coupon)
        })
            .then(res => res.json())
            .then(data => {
                toast.success(`Coupon added`);
                refetch();
                e.target.reset();

            })
            .catch(err => {
                toast.error("Failed");
                console.error(err);
            })
    }
    return (
        <div className='py-2'>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>

            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Coupon Code</h2>
            </div>

            <div className="overflow-x-auto bg-white rounded-xl shadow-xl my-6">
                <table className="table table border">
                    <thead className='bg-blue-700 text-white'>
                        <tr className='text-center'>
                            <th className='border'>SL</th>
                            <th className='border'>Coupon Code</th>
                            <th className='border'>Discount</th>
                            <th className='border'>ACTION</th>
                        </tr>
                    </thead>
                    <tbody className='border'>
                        {content}
                    </tbody>
                </table>
            </div>

            <form onSubmit={handleAddCoupon} action="" className='grid grid-cols-5 gap-1'>
                <label className='block block col-span-2'>
                    <span className='text-sm font-semibold'>Coupon code</span>
                    <input type="text" name="coupon_code" placeholder="code" className='input input-md input-bordered w-full rounded-none' required />
                </label>
                <label className='block block col-span-2'>
                    <span className='text-sm font-semibold'>Discount (BDT)</span>
                    <input type="number" name="coupon_discount" placeholder="discount" className='input input-md input-bordered w-full rounded-none' required />
                </label>

                {/* Submit button */}
                <label className='block block col-span-1'>
                    <span className='text-sm font-semibold'>Add</span>
                    <button className='btn w-full text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 rounded-none' type="submit">
                        <span className='text-2xl'><FaCloudUploadAlt /></span>
                        <span className='font-bold'>ADD</span>
                    </button>
                </label>
            </form>
        </div>
    );
};

export default Coupon;