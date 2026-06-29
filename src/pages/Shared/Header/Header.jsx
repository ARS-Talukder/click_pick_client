import React, { useState } from 'react';
import './Header.css'
import { VscAccount } from "react-icons/vsc";
import { FaBars, FaTimes } from "react-icons/fa";
import { Link, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.init';
import Loading from '../Loading';
import { BsCart } from "react-icons/bs";
import { signOut } from 'firebase/auth';
import { useCart } from '../../ContextReducer';
import useAdmin from '../../hooks/useAdmin';
import CartDrawer from '../../Home/Products/Cart/CartDrawer/CartDrawer';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';


const Header = () => {
    const [user, loading, error] = useAuthState(auth);
    const [admin, adminLoading] = useAdmin(user);

    const { data: categories, isLoading, isSuccess } = useQuery({
        queryKey: ["categories"],
        queryFn: () => axios.get("https://click-pick-server.onrender.com/categories")
    });

    // Category Drawer open and close handling
    const [drawerOpen, setDrawerOpen] = useState(false);

    // Cart Drawer open and close handling
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const navigate = useNavigate();
    const data = useCart();

    const navigateToInventory = name => {
        navigate(`/${name}`);

        // Pushing Data to the Data Layer for Google data manager(GTM)
        window.dataLayer.push({
            event: 'category_button',
            ecommerce: {
                categoryName: { name }
            },
            buttonText: 'Category Button',
            buttonClick: 'Clicked',
            pagePath: window.location.pathname,
        });
    }

    if (isLoading || loading || adminLoading) {
        <Loading></Loading>
    }

    const handleSignOut = () => {
        signOut(auth);
    };
    const signOutConfirmation = () => {
        const proceed = window.confirm("Signing Out");
        if (proceed) {
            handleSignOut();
            navigate('/');
        }
        else {
            return;
        }

    }
    return (
        <header className='header_container'>
            {/* Overlay. It creates darker the page when drawer opens */}
            {isDrawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity duration-300"
                    onClick={() => setIsDrawerOpen(false)}
                ></div>
            )}

            {/* Overlay when drawer is open */}
            {drawerOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40"
                    onClick={() => setDrawerOpen(false)}
                ></div>
            )}

            {/* Drawer (slides from left) */}
            <div
                className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-50 transform transition-transform duration-300 ${drawerOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="flex justify-between items-center p-4 border-b">
                    <h2 className="text-lg text-black font-bold">Categories</h2>
                    <FaTimes
                        className="cursor-pointer text-gray-500 hover:text-black"
                        onClick={() => setDrawerOpen(false)}
                    />
                </div>

                {/* Category dropdown list */}
                <ul className="p-4 space-y-3 text-gray-700 overflow-y-auto h-[calc(100vh-64px)]">
                    {
                        categories?.data.map(c => <li key={c._id} className="cursor-pointer hover:text-blue-600 flex items-center" onClick={() => navigateToInventory(c.name)}>
                            <div className='avatar mr-4 my-0.5'>
                                <div className="w-8 shadow-lg shadow-black hover:shadow-xl transition-shadow duration-300 rounded-3xl">
                                    <img className='w-full text-center' src={c.img} alt='category_img' />
                                </div>
                            </div>
                            <span>{c.name}</span>
                        </li>)
                    }

                </ul>
            </div>


            <div className='header_left'>
                <div className="cursor-pointer hover:text-blue-800 hidden lg:block"
                    onClick={() => setDrawerOpen(true)}
                >
                    <FaBars className="text-2xl mb-1" />
                </div>
                <Link className='ml-6' to='/'><img src="https://i.ibb.co.com/gb91DzSb/header-logo.png" alt="logo" width={80} /></Link>
            </div>

            <div className='header_center'>
                <label className="input input-bordered flex items-center gap-2 w-full text-gray-500">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                        className="h-4 w-4 opacity-70">
                        <path
                            fillRule="evenodd"
                            d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                            clipRule="evenodd" />
                    </svg>
                    <input type="text" className="grow text-black" placeholder="Search here..." />
                </label>
            </div>

            <div className='header_right'>
                {
                    user ?

                        <div className='header_right_sign'>
                            <button className='btn btn-active border-0 btn-xs lg:btn-sm md:btn-sm bg-red-600 hover:bg-red-800 font-bold mr-3 lg:mr-0 md:mr-0' onClick={signOutConfirmation}><small>Sign Out</small></button>
                            <div className="register_btn w-0.5 h-4 bg-white rounded-xl mx-4"></div>
                            <Link className='btn btn-xs lg:btn-sm md:btn-sm btn-accent font-bold text-white' to='dashboard'><small>Dashboard</small></Link>
                        </div>

                        :

                        <div className='header_right_sign'>
                            <p className='text-2xl mx-2'><VscAccount /></p>
                            <Link className='font-bold' to='sign'><small>Sign In</small></Link>
                            <div className="register_btn w-0.5 h-4 bg-white rounded-xl mx-4"></div>
                            <Link className='font-bold register_btn' to='register'><small>Register</small></Link>
                        </div>

                }


                <div>
                    <div className="w-px h-12 bg-white rounded-xl mx-2"></div>
                </div>

                <div className='header_right_cart'>
                    <button onClick={() => setIsDrawerOpen(true)}>
                        <div className='flex'>
                            <div className='bg-blue-400 p-3 rounded-full relative'>
                                <p className='text-3xl'><BsCart /></p>
                                <p className='w-4 h-4 font-bold bg-blue-200 text-black rounded-full p-2 flex justify-center items-center absolute top-0 right-0'>{data.length}</p>
                            </div>
                        </div>
                    </button>

                </div>
            </div>

            <CartDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />

        </header>
    );
};

export default Header;