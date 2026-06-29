import React, { useEffect, useState } from 'react';
import DashboardButton from '../../DashboardButton';
import { FaRegImages } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FaCloudUploadAlt } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import '../../../Home/Slider/Slider.css';

const Banner = () => {
    // Handling images upload state
    const [images, setImages] = useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/banner")
            .then(res => res.json())
            .then(data => setImages(data))
    }, [])

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

            const imageUrl = `http://localhost:5000/${response.data.filePath}`;
            const newImage = { _id: Date.now(), url: imageUrl };

            // Add new image to the local state
            const updatedImages = [...images, newImage];
            setImages(updatedImages);
            toast.success("Uploaded");

            //Add banner to the database
            await fetch('http://localhost:5000/banner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedImages),
            });

        } catch (err) {
            console.error("Error uploading or publishing image:", err);
            toast.error("Failed");
        }
    };
    const handleDeleteImage = async (id, imageUrl) => {
        try {
            await axios.delete("http://localhost:5000/delete", {
                data: { imageUrl }
            });

            // Prepare new array after deletion
            const updatedImages = images.filter(img => img._id !== id);

            // Update state immediately
            setImages(updatedImages);
            toast.success("Deleted!");

            // Remove from database
            fetch('http://localhost:5000/banner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedImages),
            })
                .then(res => res.json())
                .then(data => {
                    console.log('Banner updated successfully:', data);
                })
                .catch(error => {
                    console.error('Error updating banner:', error);
                    toast.error("Error");
                });

        } catch (err) {
            console.error("Error deleting image:", err);
            toast.error("Failed");
        }
    };
    
    return (
        <div className='py-2'>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>

            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Banner Image Upload</h2>
            </div>
            <section className='bg-white p-5 rounded-xl my-4'>
                <h2 className='text-slate-500 font-bold mb-4'>Banner Images</h2>
                <div className='flex justify-center items-center'>
                    <div className='grid grid-cols-1 gap-4'>
                        {
                            images.map(i =>
                                <div key={i._id} className='relative w-full h-auto rounded-xl'>
                                    <img className="w-full h-full block object-cover rounded-xl" src={i.url} alt="Uploaded" style={{ width: '200px' }} />
                                    <button type='button' onClick={() => handleDeleteImage(i._id, i.url)} className="bg-red-600 p-0.5 text-white absolute -right-1 -top-1 rounded-full">
                                        <span className=''><RxCross2 /></span>
                                    </button>
                                </div>
                            )
                        }
                        <div className='w-full h-auto border border-slate-400 border-dashed rounded-xl flex justify-center items-center'>
                            <div>
                                <span className='text-6xl text-slate-300'><FaRegImages />
                                </span>
                                <p className='text-slate-300'>1920x600</p>
                            </div>
                            <input type="file" onChange={handleImageChange} className="absolute w-40 h-40 opacity-0 cursor-pointer" accept="image/*" />
                        </div>

                    </div>
                </div>
            </section>
        </div >
    );
};

export default Banner;