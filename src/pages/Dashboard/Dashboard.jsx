import React, { useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { TbLayoutDashboardFilled } from "react-icons/tb";
import { FaSearch } from "react-icons/fa";
import { FaProductHunt } from "react-icons/fa6";
import { FaListOl } from "react-icons/fa";
import { IoMdAddCircle } from "react-icons/io";
import { TbCategoryFilled } from "react-icons/tb";
import { FaCartArrowDown } from "react-icons/fa";
import { FaRegImages } from "react-icons/fa";
import { FcSalesPerformance } from "react-icons/fc";
import { FaPeopleGroup } from "react-icons/fa6";
import { ImProfile } from "react-icons/im";
import { MdFolderSpecial } from "react-icons/md";
import { BsBorderStyle } from "react-icons/bs";
import { RiCoupon5Fill } from "react-icons/ri";
import { SiNiconico } from "react-icons/si";
import { useAuthState } from 'react-firebase-hooks/auth';
import useAdmin from '../hooks/useAdmin';
import auth from '../../firebase.init';
import Loading from '../Shared/Loading';



const Dashboard = () => {
    const [user, loading, error] = useAuthState(auth);
    const [admin, adminLoading] = useAdmin(user);
    const location = useLocation();

    if (loading || adminLoading) {
        return <Loading></Loading>
    }

    return (
        <div className='bg-white'>

            <div className="drawer lg:drawer-open bg-gray-200">
                <input id="dashboard-side-drawer" type="checkbox" className="drawer-toggle" />
                <div className="drawer-content">
                    {/* Page content here */}
                    <div className='w-full h-full dashboard-default-content py-2 px-6'>
                        {/* Outlet is the Part of Nested Routes */}
                        <Outlet></Outlet>

                    </div>
                </div>
                <div className="drawer-side">
                    <label htmlFor="dashboard-side-drawer" className="drawer-overlay"></label>
                    <ul className="menu pb-4 pt-40 lg:pt-4 md:pt-24 px-2 overflow-y-auto w-1/2 lg:w-60 md:w-1/3 min-h-screen bg-white">
                        {/* Sidebar content */}
                        {/* Dashboard index button */}
                        <li>
                            <Link
                                to="/dashboard"
                                className={`w-full btn mb-3 border-0 flex justify-start text-slate-600 ${location.pathname === "/dashboard" ? "bg-gray-200" : "bg-white"
                                    }`}
                            >
                                <span className='text-xl text-blue-700'><TbLayoutDashboardFilled /></span>
                                <span>Dashboard</span>
                            </Link>
                        </li>
                        {/* My Profile button */}
                        {
                            admin ||
                            <li>
                                <Link
                                    to="/dashboard/my_profile"
                                    className={`w-full btn mb-3 border-0 flex justify-start text-slate-600 ${location.pathname === "/dashboard/my_profile" ? "bg-gray-200" : "bg-white"
                                        }`}
                                >
                                    <span className='text-xl text-green-500'><ImProfile /></span>
                                    <span>My Profile</span>
                                </Link>
                            </li>
                        }
                        {/* Order Track button */}
                        <li>
                            <Link
                                to="/dashboard/order_track"
                                className={`w-full btn mb-3 border-0 flex justify-start text-slate-600 ${location.pathname === "/dashboard/order_track" ? "bg-gray-200" : "bg-white"
                                    }`}
                            >
                                <span className='text-xl text-blue-500'><FaSearch /></span>
                                <span>Order Track</span>
                            </Link>
                        </li>

                        {/* Sales button */}
                        {
                            admin &&
                            <li>
                                <Link
                                    to="/dashboard/sales"
                                    className={`w-full btn mb-3 border-0 flex justify-start text-slate-600 ${location.pathname === "/dashboard/sales" ? "bg-gray-200" : "bg-white"
                                        }`}
                                >
                                    <span className='text-xl'><FcSalesPerformance /></span>
                                    <span>Sales Report</span>
                                </Link>
                            </li>
                        }

                        {/* Products button */}
                        {
                            admin &&
                            <li>
                                <details className="dropdown">
                                    <summary
                                        className={`w-full btn mb-3 border-0 flex items-center justify-between text-slate-600 ${(location.pathname === '/dashboard/products_list' || location.pathname === '/dashboard/add_product') ? "bg-gray-200" : "bg-white"
                                            }`}
                                    >
                                        <span className='flex justify-center items-center'>
                                            <span className='text-xl text-yellow-600 mr-2'><FaProductHunt /></span>
                                            <span>Products</span>
                                        </span>
                                    </summary>
                                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                        <li>
                                            <Link
                                                to="/dashboard/products_list"
                                                className="w-full btn mb-3 border-0 bg-gray-200"
                                            >
                                                <span className='text-xl text-blue-700'><FaListOl /></span>
                                                <span>Products List</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/dashboard/add_product"
                                                className="w-full btn mb-3 border-0 bg-gray-200"
                                            >
                                                <span className='text-xl'><IoMdAddCircle /></span>
                                                <span>Add Product</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </details>
                            </li>
                        }

                        {/* Categories button */}
                        {
                            admin &&
                            <li>
                                <details className="dropdown">
                                    <summary
                                        className={`w-full btn mb-3 border-0 flex items-center justify-between text-slate-600 ${(location.pathname === '/dashboard/categories_list' || location.pathname === '/dashboard/add_category') ? "bg-gray-200" : "bg-white"
                                            }`}
                                    >
                                        <span className='flex justify-center items-center'>
                                            <span className='text-xl text-purple-600 mr-2'><TbCategoryFilled /></span>
                                            <span>Categories</span>
                                        </span>
                                    </summary>
                                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                        <li>
                                            <Link
                                                to="/dashboard/categories_list"
                                                className="w-full btn mb-3 border-0 bg-gray-200"
                                            >
                                                <span className='text-xl text-blue-700'><FaListOl /></span>
                                                <span>Categories List</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/dashboard/add_category"
                                                className="w-full btn mb-3 border-0 bg-gray-200"
                                            >
                                                <span className='text-xl'><IoMdAddCircle /></span>
                                                <span>Add Category</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </details>
                            </li>
                        }

                        {/* Special Categories button */}
                        {
                            admin &&
                            <li>
                                <details className="dropdown">
                                    <summary
                                        className={`w-full btn mb-3 border-0 flex items-center justify-between text-slate-600 ${(location.pathname === '/dashboard/special_categories_list' || location.pathname === '/dashboard/special_categories_list') ? "bg-gray-200" : "bg-white"
                                            }`}
                                    >
                                        <span className='flex justify-center items-center'>
                                            <span className='text-xl text-orange-600 mr-2'><MdFolderSpecial />
                                            </span>
                                            <span>Special Categories</span>
                                        </span>
                                    </summary>
                                    <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow">
                                        <li>
                                            <Link
                                                to="/dashboard/special_categories_list"
                                                className="w-full btn mb-3 border-0 bg-gray-200"
                                            >
                                                <span className='text-xl text-orange-700'><FaListOl /></span>
                                                <span>Special List</span>
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to="/dashboard/add_special_category"
                                                className="w-full btn mb-3 border-0 bg-gray-200"
                                            >
                                                <span className='text-xl text-orange-700'><IoMdAddCircle /></span>
                                                <span>Add Special</span>
                                            </Link>
                                        </li>
                                    </ul>
                                </details>
                            </li>
                        }

                        {/* Iconic Categories button */}
                        {
                            admin &&
                            <li>
                                <Link
                                    to="/dashboard/iconic_categories"
                                    className={`w-full btn mb-3 border-0 flex justify-start text-slate-600 ${location.pathname === "/dashboard/iconic_categories" ? "bg-gray-200" : "bg-white"}`}>
                                    <span className='text-xl text-green-600'><SiNiconico /></span>
                                    <span>Iconic Categories</span>
                                </Link>
                            </li>
                        }


                        {/* Coupon button */}
                        {
                            admin &&
                            <li>
                                <Link
                                    to="/dashboard/coupon"
                                    className={`w-full btn mb-3 border-0 flex justify-start text-slate-600 ${location.pathname === "/dashboard/coupon" ? "bg-gray-200" : "bg-white"}`}>
                                    <span className='text-xl text-red-600'><RiCoupon5Fill /></span>
                                    <span>Coupon</span>
                                </Link>
                            </li>
                        }

                        {/* Banner button */}
                        {
                            admin &&
                            <li>
                                <Link
                                    to="/dashboard/banner"
                                    className={`w-full btn mb-3 border-0 flex justify-start text-slate-600 ${location.pathname === "/dashboard/banner" ? "bg-gray-200" : "bg-white"}`}>
                                    <span className='text-xl text-blue-600'><FaRegImages /></span>
                                    <span>Banner</span>
                                </Link>
                            </li>
                        }


                        {/* Orders button */}
                        {
                            admin &&
                            <li>
                                <Link
                                    to="/dashboard/all_orders"
                                    className={`w-full btn mb-3 border-0 flex justify-start text-slate-600 ${location.pathname === "/dashboard/all_orders" ? "bg-gray-200" : "bg-white"
                                        }`}
                                >
                                    <span className='text-xl text-green-600'><FaCartArrowDown /></span>
                                    <span>Orders</span>
                                </Link>
                            </li>
                        }
                        {/* Customers button */}

                        {
                            admin &&
                            <li>
                                <Link
                                    to="/dashboard/all_customers"
                                    className={`w-full btn mb-3 border-0 flex justify-start text-slate-600 ${location.pathname === "/dashboard/all_customers" ? "bg-gray-200" : "bg-white"}`}>
                                    <span className='text-xl text-orange-600'><FaPeopleGroup /></span>
                                    <span>Customers</span>
                                </Link>
                            </li>
                        }

                    </ul>
                </div>
            </div>
            {/* {
                barber && <li><Link to='/dashboard/mycustomersreviews' className='btn btn-success mb-3'>My Customers Review</Link></li>
            } */}

        </div>
    );
};

export default Dashboard;