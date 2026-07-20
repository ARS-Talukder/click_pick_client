import { useQuery } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react';
import API, { SERVER_URL } from '../../../../api/api';
import toast from 'react-hot-toast';
import Loading from '../../../Shared/Loading';

const CategoryProduct = ({ product, refetch, categories }) => {
    const { _id, name, category, price, discount_price, images, } = product;

    const [selectedCategory, setSelectedCategory] = useState("");
    useEffect(() => {
        if (category) {
            setSelectedCategory(category);
        }
    }, [category]);

    // Update category of a product
    const handleUpdateCategory = () => {
        if (selectedCategory === category) {
            return toast("No changes made.");
        }

        fetch(`${SERVER_URL}/product_category/${_id}`, {
            method: "PATCH",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify({
                category: selectedCategory,
            }),
        })
            .then((res) => res.json())
            .then(() => {
                toast.success("Category updated.");
                refetch();
            });
    };

    // Delete Product
    const handleDelete = () => {
        const proceed = window.confirm(
            "Do you want to delete this product?"
        );

        if (!proceed) return;

        fetch(`${SERVER_URL}/product-delete/${_id}`, {
            method: "DELETE",
        })
            .then((res) => res.json())
            .then(() => {
                toast.success("Product deleted.");
                refetch();
            });
    };
    return (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">

            <img
                src={images?.[0]?.url}
                alt={name}
                className="w-full h-56 object-cover p-2"
            />

            <div className="p-4">

                <h2 className="text-lg font-bold text-slate-700">
                    {name}
                </h2>

                <p className="text-red-600 font-bold mt-1">
                    ৳ {discount_price || price}
                </p>

                <div className="mt-4">
                    <label className="text-sm text-slate-500 font-semibold">
                        Category
                    </label>

                    <select
                        className="select select-bordered w-full mt-1"
                        value={selectedCategory}
                        onChange={(e) =>
                            setSelectedCategory(e.target.value)
                        }
                    >
                        {categories?.data?.map((cat) => (
                            <option
                                key={cat._id}
                                value={cat.name}
                            >
                                {cat.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="flex gap-2 mt-5">

                    <button
                        onClick={handleUpdateCategory}
                        className="btn btn-primary flex-1 btn-sm"
                    >
                        Update
                    </button>

                    <button
                        onClick={handleDelete}
                        className="btn btn-error flex-1 text-white btn-sm"
                    >
                        Delete
                    </button>

                </div>

            </div>
        </div>
    );
};

export default CategoryProduct;