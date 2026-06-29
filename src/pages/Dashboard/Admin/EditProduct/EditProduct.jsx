import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../../../Shared/Loading';
import DashboardButton from '../../DashboardButton';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaCloudUploadAlt } from "react-icons/fa";
import toast from 'react-hot-toast';
import { FaRegImages } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";

const EditProduct = () => {
    const param = useParams();
    const id = param.id;
    const [product, setProduct] = useState({});
    useEffect(() => {
        fetch(`http://localhost:5000/product/${id}`)
            .then(res => res.json())
            .then(data => setProduct(data))

    }, [id])
    const { name, category, images, price, discount, discount_price, shippingCharge, subtitle, description, whyBest } = product;

    // handling loading at the time of add product
    const [loading, setLoading] = useState(false);

    // Handling images upload state
    const [editImages, setEditImages] = useState([]);
    useEffect(() => {
        fetch(`http://localhost:5000/product/${id}`)
            .then(res => res.json())
            .then(data => setEditImages(data?.images))
    }, [id])

    const [editShippingCharge, setEditShippingCharge] = useState(shippingCharge);

    const [selectedCategory, setSelectedCategory] = useState('');
    const { data: categories, isLoading, isSuccess, isError } = useQuery({
        queryKey: ["categories"],
        queryFn: () => {
            return axios.get("http://localhost:5000/categories")
        }
    })

    const navigate = useNavigate();

    if (Object.keys(product).length === 0) {
        return <Loading />;
    }

    if (loading || isLoading) {
        return <Loading></Loading>
    }

    const handleShippingCharge = (event) => {
        if (event.target.value === 'Default') {
            setEditShippingCharge(shippingCharge)
        }
        else {
            setEditShippingCharge(event.target.value);
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
            const updatedImages = [...editImages, newImage];
            setEditImages(updatedImages);
            toast.success("Uploaded");

            //Add image to the database
            fetch(`http://localhost:5000/product_image/${id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(updatedImages)
            })
        } catch (err) {
            console.error("Error uploading or publishing image:", err);
            toast.error("Failed");
        }
    };
    const handleDeleteImage = async (imageId, imageUrl) => {
        try {
            await axios.delete("http://localhost:5000/delete", {
                data: { imageUrl }
            });

            // Prepare new array after deletion
            const updatedImages = editImages.filter(img => img._id !== imageId);

            // Update state immediately
            setEditImages(updatedImages);
            toast.success("Deleted!");

            //Remove image from the database
            fetch(`http://localhost:5000/product_image/${id}`, {
                method: 'PATCH',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(updatedImages)
            })
        } catch (err) {
            console.error("Error removing or deleting image:", err);
            toast.error("Failed");
        }
    };

    const handleEditProduct = (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;

        const name = form.name.value || product.name;
        const category = selectedCategory || product.category;
        const price = parseFloat(form.price.value) || product.price;

        // Discount handling
        const discount_price_input = form.discount_price.value;
        let discount;
        if (discount_price_input === "") {
            discount = product.discount;
        } else {
            const discount_price = parseFloat(discount_price_input);
            discount = Math.floor(((price - discount_price) * 100) / price); // percentage without fractions
        }

        // Shipping charge handling
        const shippingCharge = editShippingCharge || product.shippingCharge;

        const subtitle = form.subtitle.value || product.subtitle;
        const whyBest = form.whyBest.value || product.whyBest;
        const description_title = form.description_title.value || product.description?.description_title;
        const description_details = form.description_details.value || product.description?.description_details;
        const specificDescription = form.specificDescription.value || product.description?.specificDescription;

        const description = {
            description_title,
            description_details,
            specificDescription
        };

        const updatedProduct = {
            name,
            category,
            price,
            discount,
            discount_price: discount_price_input,
            shippingCharge,
            subtitle,
            whyBest,
            images: editImages,
            description
        };
        fetch(`http://localhost:5000/edit_product/${id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(updatedProduct)
        })
            .then(res => res.json())
            .then(data => {
                toast.success(`Done`);
                navigate('/dashboard/products_list')
                setLoading(false)

            })
    };
    return (
        <div className='py-2'>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>

            <div className='bg-white p-5 my-4 rounded-xl shadow-xl'>
                <h2 className='text-xl font-bold text-slate-600'>Edit Product</h2>
            </div>
            <div className='overflow-x-auto my-6'>
                <form onSubmit={handleEditProduct} action="">
                    {/* Basic Information */}
                    <section className='bg-white p-5 rounded-xl'>
                        <h2 className='text-2xl'>Basic information</h2>
                        {/* Product name */}
                        <div className="form-control w-full my-2">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">PRODUCT NAME</span>
                            </label>
                            <input type="text" name="name" placeholder={name} className="input input-bordered input-sm w-full h-14 bg-slate-50" />
                        </div>
                        {/* Price & Discount */}
                        <div className='grid grid-cols-1 lg:grid-cols-3 md:grid-cols-3 lg:gap-10 md:gap-4'>
                            <div className="form-control w-full my-2">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">PRICE</span>
                                </label>
                                <input type="number" name="price" placeholder={price} className="input input-bordered input-sm w-full h-14 bg-slate-50" />
                            </div>
                            <div className="form-control w-full my-2">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">DISCOUNT (price)</span>
                                </label>
                                <input type="number" name="discount_price" placeholder={discount_price == "" ? price - ((discount * price) / 100) : discount_price} className="input input-bordered input-sm w-full h-14 bg-slate-50" />
                            </div>
                            <div className="form-control w-full my-2">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">Shipping Charge</span>
                                </label>
                                <select defaultValue={'Default'} onChange={handleShippingCharge} name='shipping_charge' className="input input-bordered input-sm w-full h-14 bg-slate-50">
                                    <option value="Default" disabled>{shippingCharge}</option>
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
                                <input type="text" name="subtitle" placeholder={subtitle} className="input input-bordered input-sm w-full h-14 bg-slate-50" />
                            </div>
                            <div className="form-control w-full my-2">
                                <label className="label">
                                    <span className="label-text text-slate-500 font-bold">SELECT CATEGORY</span>
                                </label>
                                <select defaultValue={'Default'} onChange={handleCategorySelection} name='appointment_service' className="input input-bordered input-sm w-full h-14 bg-slate-50" required>
                                    <option value="Default" disabled>{category}</option>
                                    {
                                        categories?.data?.map(c => <option key={c._id} value={c.name} >{c.name}</option>)
                                    }
                                </select>
                            </div>
                        </div>
                    </section>

                    {/* Product Color */}
                    {/* <section className='bg-white p-5 rounded-xl my-4'>
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
                    </section> */}

                    {/* Size */}
                    {/* <section className='bg-white p-5 rounded-xl my-4'>
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
                    </section> */}


                    {/* Why our products are the best */}
                    <section className='bg-white p-5 rounded-xl my-4'>
                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Specification</span>
                            </label>
                            <textarea name="whyBest" placeholder={whyBest} className="textarea textarea-bordered textarea-sm w-full h-24 bg-slate-50"></textarea>

                        </div>
                    </section>


                    {/* Description */}
                    <section className='bg-white p-5 rounded-xl my-4'>
                        <h2 className='text-2xl'>Description</h2>
                        <div className="form-control w-full my-2">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Description Title</span>
                            </label>
                            <input type="text" name="description_title" placeholder={description?.description_title} className="input input-bordered input-sm w-full h-14 bg-slate-50" />
                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Description</span>
                            </label>
                            <textarea name="description_details" placeholder={description?.description_details} className="textarea textarea-bordered textarea-sm w-full h-24 bg-slate-50"></textarea>

                        </div>

                        <div className="form-control w-full">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Specific Description</span>
                            </label>
                            <textarea name="specificDescription" placeholder={description?.specificDescription} className="textarea textarea-bordered textarea-sm w-full h-24 bg-slate-50"></textarea>

                        </div>
                    </section>


                    {/* Product images */}
                    <section className='bg-white p-5 rounded-xl my-4'>
                        <h2 className='text-slate-500 font-bold mb-4'>Product Images</h2>
                        <div className='flex justify-center items-center'>
                            <div className='grid grid-cols-2 lg:grid-cols-6 md:grid-cols-4 gap-4'>
                                {
                                    editImages.map(i =>
                                        <div key={i._id} className='relative w-32 h-32 lg:w-40 lg:h-40 md:w-40 md:h-40 rounded-xl border'>
                                            <img className="w-full h-full object-cover rounded-xl" src={i.url} alt="Uploaded" style={{ width: '200px' }} />
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
                                        <p className='text-slate-300'>1200x800</p>
                                    </div>
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

export default EditProduct;