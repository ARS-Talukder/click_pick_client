import React, { useEffect, useState } from 'react';
import DashboardButton from '../../DashboardButton';
import { useNavigate, useParams } from 'react-router-dom';
import { useFormStatus } from 'react-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { RxCross2 } from "react-icons/rx";
import { FaRegImages } from "react-icons/fa";
import { FaCloudUploadAlt } from "react-icons/fa";
import Loading from '../../../Shared/Loading';




const EditCategory = () => {
    const param = useParams();
    const id = param.id;
    const [category, setCategory] = useState({});
    useEffect(() => {
        fetch(`http://localhost:5000/category_by_id/${id}`)
            .then(res => res.json())
            .then(data => setCategory(data))

    }, [id])
    const { name, img } = category;

    // handling loading at the time of add product
    const [loading, setLoading] = useState(false);


    // Handling images upload state
    const [editImage, setEditImage] = useState('');
    useEffect(() => {
        fetch(`http://localhost:5000/category_by_id/${id}`)
            .then(res => res.json())
            .then(data => setEditImage(data?.img))
    }, [id])

    const navigate = useNavigate();
    if (loading) {
        return <Loading></Loading>
    }

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

            const imageUrl = `http://localhost:5000/${response.data.filePath}`;
            const newImage = { _id: Date.now(), url: imageUrl };

            // Add new image to the local state
            const updatedImage = `${newImage?.url}`;
            setEditImage(updatedImage);
            toast.success("Uploaded");

            //Add image to the database
            fetch(`http://localhost:5000/category_image/${id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ img: updatedImage })
            })
        } catch (err) {
            console.error("Error uploading or publishing image:", err);
            toast.error("Failed");
        }
    };
    const handleDeleteImage = async (imageUrl) => {
        try {
            await axios.delete("http://localhost:5000/delete", {
                data: { imageUrl }
            });


            // Update state immediately
            setEditImage('');
            toast.success("Deleted!");

            //Remove image from the database
            fetch(`http://localhost:5000/category_image/${id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify({ img: '' })
            })
        } catch (err) {
            console.error("Error removing or deleting image:", err);
            toast.error("Failed");
        }
    };

    const handleEditCategory = (e) => {
        e.preventDefault();

        // start loading
        setLoading(true);

        const form = e.target;

        const name = form.name.value || category.name;

        const updatedCategory = {
            name,
            img: editImage,
        };

        fetch(`http://localhost:5000/edit_category/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedCategory)
        })
            .then(res => res.json())
            .then(data => {
                toast.success(`Category added`);
                navigate('/dashboard/categories_list')
                setLoading(false)

            })




    };
    return (
        <div className='py-2'>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>

            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Category Upload</h2>
            </div>
            <div className='overflow-x-auto my-6'>
                <form onSubmit={handleEditCategory} action="">
                    {/* Basic Information */}
                    <section className='bg-white p-5 rounded-xl'>
                        <h2 className='text-2xl'>Basic information</h2>
                        {/* Product name */}
                        <div className="form-control w-full my-2">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">CATEGORY NAME</span>
                            </label>
                            <input type="text" name="name" className="input input-bordered input-sm w-full h-14 bg-slate-50" placeholder={name} />
                        </div>

                    </section>

                    {/* Category images */}
                    <section className='bg-white p-5 rounded-xl my-4'>
                        <h2 className='text-slate-500 font-bold mb-4'>Category Image</h2>
                        <div className='flex justify-center items-center'>
                            <div className='grid grid-cols-2 lg:grid-cols-6 md:grid-cols-4 gap-4'>
                                {
                                    editImage == '' || <div className='relative w-32 h-32 lg:w-40 lg:h-40 md:w-40 md:h-40 rounded-xl'>
                                        <img className="w-full h-full object-cover rounded-xl" src={editImage} alt="Uploaded" style={{ width: '200px' }} />
                                        <button type='button' onClick={() => handleDeleteImage(editImage)} className="bg-red-600 p-0.5 text-white absolute -right-1 -top-1 rounded-full">
                                            <span className=''><RxCross2 /></span>
                                        </button>
                                    </div>
                                }

                                {
                                    editImage == '' && <div className='w-32 h-32 lg:w-40 lg:h-40 border border-slate-400 border-dashed rounded-xl flex justify-center items-center'>
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

export default EditCategory;