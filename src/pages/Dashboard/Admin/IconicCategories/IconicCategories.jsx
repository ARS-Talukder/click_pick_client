import React, { useState } from 'react';
import DashboardButton from '../../DashboardButton';
import { AiOutlineClose } from "react-icons/ai";
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../../../Shared/Loading';
import { FaCloudUploadAlt } from "react-icons/fa";
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const IconicCategories = () => {
    const { data: iconicCategories, isLoading, isSuccess, refetch } = useQuery({
        queryKey: ["iconicCategories"],
        queryFn: () => axios.get("http://localhost:5000/iconic_categories")
    });

    const [deletingId, setDeletingId] = useState(null); // track deleting category

    if (isLoading) return <Loading />;

    // Delete category
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this category?");
        if (!confirmDelete) return;

        try {
            setDeletingId(id); // start loading
            await axios.delete(`http://localhost:5000/iconic_category_delete/${id}`);
            toast.success("Category deleted successfully!");
            refetch(); // refresh list
        } catch (error) {
            toast.error("Failed to delete category!");
            console.error(error);
        } finally {
            setDeletingId(null); // stop loading
        }
    };

    const handleAddIconicCategory = (e) => {
        e.preventDefault();
        const name = e.target.name.value;

        const category = {
            name,
            products: []
        };

        fetch('http://localhost:5000/iconic_categories', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(category)
        })
            .then(res => res.json())
            .then(data => {
                toast.success(`Special category "${name}" added!`);
                refetch()
                e.target.reset();
            })
            .catch(err => {
                console.error(err);
                toast.error("Something went wrong!");
            });
    };

    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton />


            {/* ---------------List Section------------- */}
            <section>
                <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                    <h2 className='text-xl font-bold text-slate-600'>Iconic Categories List</h2>
                </div>
                <div className="overflow-x-auto bg-white grid lg:grid-cols-5 grid-cols-2 gap-4 rounded-xl shadow-xl my-6 p-4">
                    {isSuccess && iconicCategories.data.map((category) => (
                        <div
                            key={category._id}
                            className="relative bg-accent text-white p-6 rounded-lg flex items-center justify-center"
                        >
                            {/* Delete Icon */}
                            <button
                                onClick={() => handleDelete(category._id)}
                                className="absolute top-2 right-2 text-white hover:text-red-500"
                                disabled={deletingId === category._id} // disable button while deleting
                            >
                                <AiOutlineClose size={20} />
                            </button>

                            {/* Category Button */}
                            <Link
                                to={`/dashboard/iconic_categories/${category._id}`}
                                className="w-full h-full flex justify-center items-center"
                            >
                                {deletingId === category._id ? (
                                    <p className="font-bold text-lg animate-pulse">Deleting...</p>
                                ) : (
                                    <h2 className='font-bold text-lg'>{category.name}</h2>
                                )}
                            </Link>
                        </div>
                    ))}
                </div>
            </section>


            {/* ---------------Add Section------------- */}
            <section>
                <div className="overflow-x-auto my-6">
                    <form onSubmit={handleAddIconicCategory}>
                        {/* Basic Information */}
                        <section className="bg-white p-5 rounded-xl space-y-4">
                            <h2 className="text-xl mb-4 font-bold text-slate-700">Upload</h2>

                            {/* Category Name */}
                            <div className="form-control w-full">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">CATEGORY NAME</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    placeholder="Ex: New Arrival, Trending"
                                    className="input input-bordered w-full h-14 bg-slate-50"
                                    required
                                />
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

            </section>

        </div>
    );
};

export default IconicCategories;