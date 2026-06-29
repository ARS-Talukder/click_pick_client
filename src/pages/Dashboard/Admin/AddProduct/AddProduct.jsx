import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React, { useState } from 'react';
import Loading from '../../../Shared/Loading';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import DashboardButton from '../../DashboardButton';
import { AiFillDelete } from "react-icons/ai";
import { FaRegImages } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { FaCloudUploadAlt } from "react-icons/fa";


const AddProduct = () => {
    const [selectedCategory, setSelectedCategory] = useState('');

    const [shippingCharge, setShippingCharge] = useState('normal');

    // handling loading at the time of add product
    const [loading, setLoading] = useState(false);

    // Handling images upload state
    const [images, setImages] = useState([]);

    // Handling product color state?
    const [productColorText, setProductColorText] = useState('');
    const [productColor, setProductColor] = useState([]);

    // Handling size?
    const [sizeText, setSizeText] = useState('');
    const [size, setSize] = useState([]);

    const { data: categories, isLoading, isSuccess, isError } = useQuery({
        queryKey: ["categories"],
        queryFn: () => {
            return axios.get("http://localhost:5000/categories")
        }
    })

    const navigate = useNavigate();
    if (isLoading || loading) {
        return <Loading></Loading>
    }

    // Handling Shipping Charge
    const handleShippingCharge = (event) => {
        if (event.target.value === 'Default') {
            setShippingCharge('normal')
        }
        else {
            setShippingCharge(event.target.value);
        }
    }

    // Handling Categories Selection
    const handleCategorySelection = (event) => {
        if (event.target.value === 'Default') {
            return
        }
        else {
            setSelectedCategory(event.target.value);
        }
    }

    // Handling product color
    const handleProductColor = () => {
        if (productColorText.trim() === '') return;
        const newItem = {
            _id: Date.now(),
            text: productColorText
        };
        setProductColor(prev => [...prev, newItem]);
        setProductColorText('');
    }
    const handleDeleteProductColor = (id) => {
        setProductColor(prev => prev.filter(item => item._id !== id));
    };

    // Handling size
    const handleSize = () => {
        if (sizeText.trim() === '') return;
        const newItem = {
            _id: Date.now(),
            text: sizeText
        };
        setSize(prev => [...prev, newItem]);
        setSizeText('');
    }
    const handleDeleteSize = (id) => {
        setSize(prev => prev.filter(item => item._id !== id));
    };



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
            toast.success("Uploaded");
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


    // Handling Add Product to database
    const handleAddProduct = (e) => {
        e.preventDefault();

        // start loading
        setLoading(true);

        const name = e.target.name.value;
        const category = selectedCategory;
        if (category === "") {
            return toast.error("You must select a Category")
        }
        const price = e.target.price.value;

        const discount_price = e.target.discount_price.value;
        let discount;
        if (discount_price == "") {
            discount = 0;
        }
        else {
            discount = Math.floor(((price - discount_price) * 100) / price);
        }

        const subtitle = e.target.subtitle.value;
        const whyBest = e.target.whyBest.value;
        const description_title = e.target.description_title.value;
        const description_details = e.target.description_details.value;
        const specificDescription = e.target.specificDescription.value;
        const description = { description_title, description_details, specificDescription };
        const product = { name, category, shippingCharge, price, discount, discount_price, subtitle, whyBest, productColor, size, images: images, description };

        fetch('http://localhost:5000/products', {
            method: 'POST',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(product)
        })
            .then(res => res.json())
            .then(data => {
                toast.success(`Product added`);
                navigate('/dashboard/products_list')

            })
            .catch(err => {
                toast.error("Failed");
                console.error(err);
            })
            .finally(() => {
                setLoading(false); // Stop loading
            });

    }
    return (
        <div className='py-2'>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>

            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Product Upload</h2>
            </div>
            <div className='overflow-x-auto my-6'>
                <form onSubmit={handleAddProduct} action="">
                    {/* Basic Information */}
                    <section className='bg-white p-5 rounded-xl'>
                        <h2 className='text-2xl'>Basic information</h2>
                        {/* Product name */}
                        <div className="form-control w-full my-2">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">PRODUCT NAME</span>
                            </label>
                            <input type="text" name="name" className="input input-bordered input-sm w-full h-14 bg-slate-50" required />
                        </div>
                        {/* Price & Discount */}
                        <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 lg:gap-10 md:gap-4'>
                            <div className="form-control w-full my-2">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">PRICE</span>
                                </label>
                                <input type="number" name="price" className="input input-bordered input-sm w-full h-14 bg-slate-50" required />
                            </div>
                            <div className="form-control w-full my-2">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">DISCOUNT (price)</span>
                                </label>
                                <input type="number" name="discount_price" className="input input-bordered input-sm w-full h-14 bg-slate-50" />
                            </div>
                            <div className="form-control w-full my-2">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">Shipping Charge</span>
                                </label>
                                <select defaultValue={'Default'} onChange={handleShippingCharge} name='shipping_charge' className="input input-bordered input-sm w-full h-14 bg-slate-50" required>
                                    <option value="Default" disabled>SELECT SHIPPING</option>
                                    <option value='normal' >Normal</option>
                                    <option value='free' >Free</option>
                                </select>
                            </div>
                        </div>
                        {/* Subtitle & Category */}
                        <div className='grid grid-cols-1 lg:grid-cols-2 md:grid-cols-2 lg:gap-10 md:gap-4'>
                            <div className="form-control w-full my-2">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">SUBTITLE</span>
                                </label>
                                <input type="text" name="subtitle" className="input input-bordered input-sm w-full h-14 bg-slate-50" />
                            </div>
                            <div className="form-control w-full my-2">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">SELECT CATEGORY</span>
                                </label>
                                <select defaultValue={'Default'} onChange={handleCategorySelection} name='appointment_service' className="input input-bordered input-sm w-full h-14 bg-slate-50" required>
                                    <option value="Default" disabled>SELECT CATEGORY</option>
                                    {
                                        categories.data?.map(c => <option key={c._id} value={c.name} >{c.name}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Product Color */}
                    <section className='bg-white p-5 rounded-xl my-4'>
                        <h2 className='text-slate-500 font-bold mb-2'>Product Color</h2>
                        <ul>
                            {
                                productColor.map((p) =>
                                    <li key={p._id} className='px-2 my-2 flex items-center'>
                                        <span>✅</span>
                                        <span className='mx-2'>{p.text}</span>
                                        <button className='bg-red-100' title="Delete" onClick={() => handleDeleteProductColor(p._id)}>
                                            <AiFillDelete className="text-xl text-red-500"></AiFillDelete>
                                        </button>
                                    </li>)
                            }
                        </ul>
                        <div className='flex justify-between my-2'>
                            <div className="w-5/6 my-2 mr-2">
                                <input type="text" className="input input-bordered input-sm w-full h-14 bg-slate-50" value={productColorText}
                                    onChange={(e) => setProductColorText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleProductColor();
                                        }
                                    }} />
                            </div>
                            <div className="w-1/6 my-2">
                                <button type="button" onClick={handleProductColor} className='w-full btn btn-success h-14 text-white'>Add</button>
                            </div>
                        </div>
                    </section>

                    {/* Size */}
                    <section className='bg-white p-5 rounded-xl my-4'>
                        <h2 className='text-slate-500 font-bold mb-2'>Size</h2>
                        <ul>
                            {
                                size.map((s) =>
                                    <li key={s._id} className='px-2 my-2 flex items-center'>
                                        <span>✅</span>
                                        <span className='mx-2'>{s.text}</span>
                                        <button className='bg-red-100' title="Delete" onClick={() => handleDeleteSize(s._id)}>
                                            <AiFillDelete className="text-xl text-red-500"></AiFillDelete>
                                        </button>
                                    </li>)
                            }
                        </ul>
                        <div className='flex justify-between my-2'>
                            <div className="w-5/6 my-2 mr-2">
                                <input type="text" className="input input-bordered input-sm w-full h-14 bg-slate-50" value={sizeText}
                                    onChange={(e) => setSizeText(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            e.preventDefault();
                                            handleSize();
                                        }
                                    }} />
                            </div>
                            <div className="w-1/6 my-2">
                                <button type="button" onClick={handleSize} className='w-full btn btn-success h-14 text-white'>Add</button>
                            </div>
                        </div>
                    </section>


                    {/* Why our products are the best */}
                    <section className='bg-white p-5 rounded-xl my-4'>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Specification</span>
                            </label>
                            <textarea name="whyBest" className="textarea textarea-bordered textarea-sm w-full h-24 bg-slate-50"></textarea>

                        </div>
                    </section>


                    {/* Description */}
                    <section className='bg-white p-5 rounded-xl my-4'>
                        <h2 className='text-2xl'>Description</h2>
                        <div className="form-control w-full my-2">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Description Title</span>
                            </label>
                            <input type="text" name="description_title" className="input input-bordered input-sm w-full h-14 bg-slate-50" />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Description</span>
                            </label>
                            <textarea name="description_details" className="textarea textarea-bordered textarea-sm w-full h-24 bg-slate-50"></textarea>

                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Specific Description</span>
                            </label>
                            <textarea name="specificDescription" className="textarea textarea-bordered textarea-sm w-full h-24 bg-slate-50"></textarea>

                        </div>
                    </section>


                    {/* Product images */}
                    <section className='bg-white p-5 rounded-xl my-4'>
                        <h2 className='text-slate-500 font-bold mb-4'>Product Images</h2>
                        <div className='flex justify-center items-center'>
                            <div className='grid grid-cols-2 lg:grid-cols-6 md:grid-cols-4 gap-4'>
                                {
                                    images.map(i =>
                                        <div key={i._id} className='relative w-32 h-32 lg:w-40 lg:h-40 md:w-40 md:h-40 rounded-xl border'>
                                            <img className="w-full h-full object-cover rounded-xl" src={i.url} alt="Uploaded" style={{ width: '200px' }} />
                                            <button type='button' onClick={() => handleDeleteImage(i._id, i.url)} className="bg-red-600 p-0.5 text-white absolute -right-1 -top-1 rounded-full">
                                                <span className=''><RxCross2 /></span>
                                            </button>
                                        </div>
                                    )
                                }
                                <div className='w-32 h-32 lg:w-40 lg:h-40 border border-slate-400 border-dashed rounded-xl flex justify-center items-center'>
                                    <span className='text-6xl text-slate-300'><FaRegImages />
                                    </span>
                                    <input type="file" onChange={handleImageChange} className="absolute w-40 h-40 opacity-0 cursor-pointer" accept="image/*" />
                                </div>

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

export default AddProduct;