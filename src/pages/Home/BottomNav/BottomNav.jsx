import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import React from 'react';
import { useState } from "react";
import { FaShoppingCart, FaUser, FaBars, FaTimes } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdCampaign } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useCart, useDispatchCart } from '../../ContextReducer';
import CartDrawer from '../Products/Cart/CartDrawer/CartDrawer';
import { useAuthState } from 'react-firebase-hooks/auth';
import useAdmin from '../../hooks/useAdmin';
import auth from '../../../firebase.init';
import Loading from '../../Shared/Loading';
import { signOut } from 'firebase/auth';
import API from '../../../api/api';

const BottomNav = () => {
    // Cart Drawer open and close handling
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const data = useCart();

    const navigate = useNavigate();

    const [drawerOpen, setDrawerOpen] = useState(false);
    const [user, loading, error] = useAuthState(auth);
    const [admin, adminLoading] = useAdmin(user);
    const dispatch = useDispatchCart();

    const { data: categories, isLoading, isSuccess } = useQuery({
        queryKey: ["categories"],
        queryFn: () => API.get("/categories")
    });

    if (isLoading || loading || adminLoading) {
        return <Loading />
    }

    const handleSignOut = () => {
        signOut(auth);
    };
    const signOutConfirmation = () => {
        const proceed = window.confirm("Signing Out");
        if (proceed) {
            handleSignOut();
            dispatch({ type: "CLEAR" });
            navigate('/');
        }
        else {
            return;
        }

    }


    const navigateToInventory = name => {
        navigate(`/${name}`);
    }
    return (
        <div>
            {/* Overlay. It creates darker the cart page when drawer opens */}
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
                    <h2 className="text-lg font-bold">Categories</h2>
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

            {/* Bottom Navigation */}
            <div className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t z-30">
                <div className="flex justify-around items-center py-2 text-xs text-gray-700">
                    <div
                        className="flex flex-col items-center cursor-pointer"
                        onClick={() => setDrawerOpen(true)}
                    >
                        <FaBars className="text-xl mb-1" />
                        <span>Category</span>
                    </div>

                    <Link to='campaign' className="flex flex-col items-center cursor-pointer">
                        <MdCampaign className="text-2xl mb-1" />
                        <span>Campaign</span>
                    </Link>

                    <button onClick={() => setIsDrawerOpen(true)}>
                        <div className="flex flex-col items-center cursor-pointer" >
                            <FaShoppingCart className="text-xl mb-1" />
                            <span>({data.length})</span>
                        </div>
                    </button>

                    {
                        user ?

                            <button onClick={signOutConfirmation} className="flex flex-col items-center cursor-pointer">
                                <FiLogOut className="text-xl mb-1" />
                                <span>Sign Out</span>
                            </button>

                            :

                            <Link to='sign' className="flex flex-col items-center cursor-pointer">
                                <FaUser className="text-xl mb-1" />
                                <span>Login</span>
                            </Link>

                    }
                </div>
            </div>

            <CartDrawer isOpen={isDrawerOpen} setIsOpen={setIsDrawerOpen} />
        </div>
    );
};

export default BottomNav;