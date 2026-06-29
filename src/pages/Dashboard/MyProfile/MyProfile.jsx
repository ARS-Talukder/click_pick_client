import React, { useEffect, useState } from 'react';
import { TiEdit } from "react-icons/ti";
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../../firebase.init';
import Loading from '../../Shared/Loading';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import DashboardButton from '../DashboardButton';


const MyProfile = () => {
    const [user, loading, error] = useAuthState(auth);
    let mobile = "No Number"
    let address = "No Address"
    const { data: customers, isLoading, isSuccess, isError, refetch } = useQuery({
        queryKey: ["customers"],
        queryFn: () => {
            return axios.get("http://localhost:5000/customers")
        }
    })

    if (loading || isLoading) {
        return <Loading></Loading>
    }
    if (customers.data.length !== 0) {
        customers.data.filter((order) => {
            if (order.email == user.email) {
                console.log(order)
            }
        })
    }


    return (
        <div>
            {/* ---------------Dashboard Button------------- */}
            <DashboardButton></DashboardButton>
            <div className='py-4 flex justify-center items-center'>
            <div className="overflow-x-auto px-2 text-center">
                <div className="flex justify-center">
                    <img className='border-2 border-slate-400 rounded-lg' width={200} src="https://i.ibb.co/ctFS6Qt/login-Avatar.png" alt="login avatar" />
                </div>
                <p className='text-xl font-bold text-slate-600 my-2'>{user.displayName}</p>
                <p className='font-bold text-slate-500 my-1'>{user.email}</p>


            </div>
            </div>
        </div>
    );
};

export default MyProfile;