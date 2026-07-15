import axios from 'axios';
import React from 'react';
import Loading from '../../Shared/Loading';
import Category from './Category';
import { useQuery } from '@tanstack/react-query';
import API from '../../../api/api';

const AllCategories = () => {
    const { data: categories, isLoading, isSuccess, isError, error } = useQuery({
        queryKey: ["categories"],
        queryFn: () => {
            return API.get("/categories")
        }
    })
    let content;

    if (isLoading) {
        return <Loading />
    }

    if (isSuccess) {
        content = categories.data.map(category => <Category key={category._id} category={category} />);
    }
    return (
        <div className='py-12'>
            <div className='grid grid-cols-3 lg:grid-cols-6 md:grid-cols-4 gap-5'>
                {content}
            </div>

        </div>
    );
};

export default AllCategories;