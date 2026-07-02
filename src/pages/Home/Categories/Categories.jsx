import React, { useEffect, useState } from 'react';
import Category from './Category';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { FaLongArrowAltRight } from "react-icons/fa";
import Loading from '../../Shared/Loading';
import { Link } from 'react-router-dom';

const Categories = () => {
    const { data: categories, isLoading, isSuccess } = useQuery({
        queryKey: ["categories"],
        queryFn: () => axios.get("http://localhost:5000/categories")
    });

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    // update on resize
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    if (isLoading) return <Loading />;

    let content = [];
    if (isSuccess) {
        // limit categories based on screen
        const items = isMobile 
            ? categories.data.slice(0, 6)  // 2 rows × 3 cols for mobile
            : categories.data.slice(0, 12); // 12 for desktop

        content = items.map(category => (
            <Category key={category._id} category={category} />
        ));
    }

    return (
        <div className='mb-6'>
            <div className='flex justify-between mb-2'>
                <h2 className='text-2xl font-bold text-slate-600 mb-2 underline'>Categories</h2>
                <Link to="/all_categories" className='btn btn-accent btn-xs'>
                    <p>See all</p>
                    <span><FaLongArrowAltRight /></span>
                </Link>
            </div>
            <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5'>
                {content}
            </div>
        </div>
    );
};

export default Categories;