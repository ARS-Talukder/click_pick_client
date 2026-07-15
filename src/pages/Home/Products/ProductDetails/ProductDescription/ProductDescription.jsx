import React, { useState } from 'react';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { FaWhatsapp } from "react-icons/fa";
import { FaPhone } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useCart, useDispatchCart } from '../../../../ContextReducer';
import toast from 'react-hot-toast';
import CartDrawer from '../../Cart/CartDrawer/CartDrawer';

const ProductDescription = ({ product }) => {
    const { _id, name, price, discount, discount_price, category, images, description, productColor, shippingCharge, subtitle, size, whyBest } = product;
    const img = images[0]?.url;


    // Cart Drawer open and close handling
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    // Size Selection by customer
    const [selectedSize, setSelectedSize] = useState(size[0]?._id)
    // finding the size name from the _id
    const selectedSizeObj = size.find(s => s._id === selectedSize);
    const selectedSizeName = selectedSizeObj?.text;

    // Color Selection by customer
    const [selectedColor, setSelectedColor] = useState(productColor[0]?._id)
    // finding the color name from the _id
    const selectedColorObj = productColor.find(s => s._id === selectedColor);
    const selectedColorName = selectedColorObj?.text;

    const handleOrderNow = async () => {
        await dispatch({ type: "ADD", product_id: _id, name: name, category: category, img: img, price: price, discount: discount, discount_price: discount_price, size: selectedSizeName, color: selectedColorName, shippingCharge: shippingCharge, quantity: 1 });
        toast.success('Added to the cart')
        navigate('/checkout', { state: product })

    }

    let productAdded = false;
    const navigate = useNavigate();
    let dispatch = useDispatchCart();
    let data = useCart();

    const handleAddToCart = async () => {
        await dispatch({ type: "ADD", product_id: _id, name: name, category: category, img: img, price: price, discount: discount, discount_price: discount_price, size: selectedSizeName, color: selectedColorName, shippingCharge: shippingCharge, quantity: 1 });
        setIsDrawerOpen(true);

    }

    if (data.length !== 0) {
        for (let i = 0; i < data.length; i++) {
            const data_id = data[i].product_id;
            if (data_id === _id) {
                productAdded = true
            }
        }
    }


    return (
        <div>
            {/* Overlay. It creates darker the page when drawer opens */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
                    onClick={() => setIsDrawerOpen(false)}
                ></div>
            )}
            <h2 className='text-3xl font-bold'>{name}</h2>
            <div className='flex text-2xl font-bold my-2'>
                <p className={price == discount_price ? 'flex items-center justify-center decoration-2 mr-2 text-blue-700' : 'flex items-center justify-center font-normal line-through decoration-2 mr-2 text-slate-400'}>
                    <span className='text-xs'><small><FaBangladeshiTakaSign /></small></span>
                    <span>{price}</span>
                </p>
                <p className={price == discount_price ? 'hidden' : 'flex justify-center items-center text-blue-700'}>
                    <span className='text-xs'><small><FaBangladeshiTakaSign /></small></span>
                    <span>{discount_price}</span>
                </p>
            </div>

            <h2 className='font-bold'>{subtitle}</h2>

            <div className={whyBest?.length === 0 ? 'hidden' : ''}>
                <h3 className='font-bold'>
                    Why This Product?
                </h3>
                <div className='pt-2 pb-4'>
                    {whyBest?.map(w => <div key={w._id} className="whitespace-pre-wrap break-words my-1">✅ <span className='text-gray-500 text-sm font-bold'>{w.text}</span></div>)}
                </div>

            </div>

            <div className='flex'>
                {
                    size.length > 0 &&
                    size.map(s => <button key={s._id} onClick={() => setSelectedSize(s._id)} className={`mx-2 px-4 py-1 border rounded 
                        transition duration-200
                        ${selectedSize === s._id
                            ? 'bg-blue-600 text-white font-semibold border-blue-700 shadow-lg'
                            : 'bg-white text-black border-gray-300 hover:bg-gray-100'}
                    `}><small>{s.text}</small></button>)
                }
            </div>

            <div className='flex mt-4'>
                {
                    productColor.length > 0 &&
                    productColor.map(s => <button key={s._id} onClick={() => setSelectedColor(s._id)} className={`mx-2 px-4 py-1 border rounded 
                        transition duration-200
                        ${selectedColor === s._id
                            ? 'bg-blue-600 text-white font-semibold border-blue-700 shadow-lg'
                            : 'bg-white text-black border-gray-300 hover:bg-gray-100'}
                    `}><small>{s.text}</small></button>)
                }
            </div>

            <div className='hidden lg:flex mt-6 font-bold'>
                {
                    productAdded === false ?
                        <button onClick={handleAddToCart} className='flex justify-center items-center w-full h-9 bg-red-500 hover:bg-red-600 text-white rounded'><span>Add To Cart</span></button>
                        :
                        <button className='flex justify-center items-center w-full h-9 bg-red-200 text-white rounded' disabled><span>Added</span></button>
                }
                <button onClick={handleOrderNow} className='flex justify-center items-center w-full h-9 bg-blue-500 hover:bg-blue-600 text-white ml-4 rounded'><span>ORDER NOW</span></button>
            </div>

            {/* Mobile Bottom Action Bar */}
            <div className='fixed bottom-0 left-0 w-full bg-white shadow-md border-t z-30 lg:hidden'>
                <div className='flex mt-6 font-bold'>
                    {
                        productAdded === false ?
                            <button onClick={handleAddToCart} className='flex justify-center items-center w-full h-9 bg-red-500 hover:bg-red-600 text-white rounded'><span>Add To Cart</span></button>
                            :
                            <button className='flex justify-center items-center w-full h-9 bg-red-200 text-white rounded' disabled><span>Added</span></button>
                    }
                    <button onClick={handleOrderNow} className='flex justify-center items-center w-full h-9 bg-blue-500 hover:bg-blue-600 text-white ml-4 rounded'><span>ORDER NOW</span></button>
                </div>
            </div>

            <div className='w-full h-0.5 bg-slate-200 my-6'></div>

            <div className='flex'>
                <a href="https://api.whatsapp.com/send?phone=8801629396785" target='_blank' className='flex justify-center items-center w-full h-9 bg-green-200 hover:bg-green-600 text-green-600 hover:text-white border border-green-600 rounded' rel="noreferrer">
                    <span className='mx-1'><small><FaWhatsapp /></small></span>
                    <span>WHATSAPP</span>
                </a>

                <a href="tel:+8801629396785" className='flex justify-center items-center w-full h-9 bg-blue-100 hover:bg-blue-600 text-blue-600 hover:text-white border border-blue-600 rounded ml-4'>
                    <span className='mx-1'><small><FaPhone /></small></span>
                    <span>01629396785</span>
                </a>
            </div>

            <CartDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
        </div>
    );
};

export default ProductDescription;