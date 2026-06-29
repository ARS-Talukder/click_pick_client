import React, { useState } from 'react';
import DashboardButton from '../../DashboardButton';
import { FaCloudUploadAlt } from "react-icons/fa";
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AddSpecialCategory = () => {
    const navigate = useNavigate();

    const handleAddSpecialCategory = (e) => {
        e.preventDefault();
        const name = e.target.name.value;
        const startTime = e.target.startTime.value;
        const endTime = e.target.endTime.value;

        const category = {
            name,
            startTime,
            endTime,
            products: []
        };

        fetch('http://localhost:5000/special_categories', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(category)
        })
            .then(res => res.json())
            .then(data => {
                toast.success(`Special category "${name}" added!`);
                navigate('/dashboard/special_categories_list');
            })
            .catch(err => {
                console.error(err);
                toast.error("Something went wrong!");
            });
    };
    return (
        <div className="py-2">
            {/* Dashboard Button */}
            <DashboardButton />

            <div className="bg-white p-5 my-4 rounded-xl shadow-xl">
                <h2 className="text-xl font-bold text-slate-600">Special Category Upload</h2>
            </div>

            <div className="overflow-x-auto my-6">
                <form onSubmit={handleAddSpecialCategory}>
                    {/* Basic Information */}
                    <section className="bg-white p-5 rounded-xl space-y-4">
                        <h2 className="text-2xl mb-4 font-semibold text-slate-700">Information</h2>

                        {/* Category Name */}
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">CATEGORY NAME</span>
                            </label>
                            <input
                                type="text"
                                name="name"
                                placeholder="Ex: Flash Sale, Hot Sale"
                                className="input input-bordered w-full h-14 bg-slate-50"
                                required
                            />
                        </div>

                        <div className='lg:flex'>
                            {/* Start Time */}
                            <div className="form-control w-full lg:mr-8">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">START TIME</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    className="input input-bordered w-full h-14 bg-slate-50"
                                    required
                                />
                            </div>

                            {/* End Time */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">END TIME</span>
                                </label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    className="input input-bordered w-full h-14 bg-slate-50"
                                    required
                                />
                            </div>
                        </div>
                    </section>

                    {/* Submit button */}
                    <button
                        className="btn w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2 h-14"
                        type="submit"
                    >
                        <span className="text-2xl"><FaCloudUploadAlt /></span>
                        <span className="font-bold">PUBLISH</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AddSpecialCategory;