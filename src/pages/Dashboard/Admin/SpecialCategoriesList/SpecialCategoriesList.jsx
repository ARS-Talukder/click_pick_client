import React, { useState } from 'react';
import DashboardButton from '../../DashboardButton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Loading from '../../../Shared/Loading';
import { Link } from 'react-router-dom';
import { AiOutlineClose } from "react-icons/ai";
import toast from 'react-hot-toast';

const SpecialCategoriesList = () => {
    const { data: specialCategories, isLoading, isSuccess, refetch } = useQuery({
        queryKey: ["specialCategories"],
        queryFn: () => axios.get("http://localhost:5000/special_categories")
    });

    const [deletingId, setDeletingId] = useState(null); // track deleting category

    if (isLoading) return <Loading />;

    // Delete category
    const handleDelete = async (id) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this category?");
        if (!confirmDelete) return;

        try {
            setDeletingId(id); // start loading
            await axios.delete(`http://localhost:5000/special_category_delete/${id}`);
            toast.success("Category deleted successfully!");
            refetch(); // refresh list
        } catch (error) {
            toast.error("Failed to delete category!");
            console.error(error);
        } finally {
            setDeletingId(null); // stop loading
        }
    };

    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton />
            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Special Categories List</h2>
            </div>

            <div className="overflow-x-auto bg-white grid lg:grid-cols-5 grid-cols-2 gap-4 rounded-xl shadow-xl my-6 p-4">
                {isSuccess && specialCategories.data.map((category) => (
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
                            to={`/dashboard/special_categories_list/${category._id}`}
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
        </div>
    );
};

export default SpecialCategoriesList;
