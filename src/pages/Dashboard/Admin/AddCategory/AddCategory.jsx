import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DashboardButton from '../../DashboardButton';
import axios from 'axios';
import { FaRegImages } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddCategory = () => {
    // Handling images upload state
    const [images, setImages] = useState([]);

    // handling loading at the time of add product
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    // Handling image upload and delete from hosting
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            handleUpload(file);
        }
    };
    const handleUpload = async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        try {
            const response = await axios.post("http://localhost:5000/upload", formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });

            setImages([...images, { _id: Date.now(), url: `http://localhost:5000/${response.data.filePath}` }]);
            toast.success("Done");
        } catch (err) {
            console.error("Error uploading image:", err);
            toast.error("Failed");
        }
    };
    const handleDeleteImage = async (id, imageUrl) => {
        try {
            await axios.delete("http://localhost:5000/delete", {
                data: { imageUrl }
            });

            // Remove image from state
            setImages(images.filter(img => img._id !== id));
            toast.success("Deleted!");
        } catch (err) {
            console.error("Error deleting image:", err);
            toast.error("Failed");
        }
    };
    const handleAddCategory = (e) => {
        e.preventDefault();

        // start loading
        setLoading(true);

        const name = e.target.name.value;
        const img = images[0]?.url;
        const category = { name, img };

        if (img != undefined) {
            fetch('http://localhost:5000/categories', {
                method: 'POST',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(category)
            })
                .then(res => res.json())
                .then(data => {
                    toast.success(`Done`);
                    navigate('/dashboard/categories_list')

                })
                .catch(err => {
                    toast.error("Failed");
                    console.error(err);
                })
                .finally(() => {
                    setLoading(false); // Stop loading
                });
        }
        else {
            toast.error(`Done`);
        }
    }
    return (
        <div className='py-2'>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>

            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Category Upload</h2>
            </div>
            <div className='overflow-x-auto my-6'>
                <form onSubmit={handleAddCategory} action="">
                    {/* Basic Information */}
                    <section className='bg-white p-5 rounded-xl'>
                        <h2 className='text-2xl'>Basic information</h2>
                        {/* Product name */}
                        <div className="form-control w-full my-2">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">CATEGORY NAME</span>
                            </label>
                            <input type="text" name="name" className="input input-bordered input-sm w-full h-14 bg-slate-50" required />
                        </div>

                    </section>

                    {/* Category images */}
                    <section className='bg-white p-5 rounded-xl my-4'>
                        <h2 className='text-slate-500 font-bold mb-4'>Category Images</h2>
                        <div className='flex justify-center items-center'>
                            <div className='grid grid-cols-2 lg:grid-cols-6 md:grid-cols-4 gap-4'>
                                {
                                    images.map(i =>
                                        <div key={i._id} className='relative w-32 h-32 lg:w-40 lg:h-40 md:w-40 md:h-40 rounded-xl'>
                                            <img className="w-full h-full object-cover rounded-xl" src={i.url} alt="Uploaded" style={{ width: '200px' }} />
                                            <button type='button' onClick={() => handleDeleteImage(i._id, i.url)} className="bg-red-600 p-0.5 text-white absolute -right-1 -top-1 rounded-full">
                                                <span className=''><RxCross2 /></span>
                                            </button>
                                        </div>
                                    )
                                }

                                {
                                    images[0]?.url == undefined && <div className='w-32 h-32 lg:w-40 lg:h-40 border border-slate-400 border-dashed rounded-xl flex justify-center items-center'>
                                        <span className='text-6xl text-slate-300'><FaRegImages />
                                        </span>
                                        <input type="file" onChange={handleImageChange} className="absolute w-40 h-40 opacity-0 cursor-pointer" accept="image/*" />
                                    </div>
                                }

                            </div>
                        </div>
                    </section>

                    {/* Submit button */}
                    <button className='btn w-full mt-4 text-white bg-blue-600 hover:bg-blue-700 flex items-center justify-center gap-2' type="submit">
                        <span className='text-2xl'><FaCloudUploadAlt /></span>
                        <span className='font-bold'>PUBLISH</span>
                    </button>

                </form>
            </div>
        </div >
    );
};

export default AddCategory;