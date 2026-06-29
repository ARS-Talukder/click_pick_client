import React from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import useAdmin from '../hooks/useAdmin';
import { Navigate, useLocation } from 'react-router-dom';
import Loading from '../Shared/Loading';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';

const RequireAdmin = ({ children }) => {
    const [user, loading] = useAuthState(auth);
    const [admin, adminLoading] = useAdmin(user);
    const location = useLocation();

    if (loading || adminLoading) {
        return <Loading></Loading>
    }

    if (!user || !admin) {
        signOut(auth);
        toast.error('UnAuthorized Access')
        return <Navigate to="/sign" state={{ from: location }} replace></Navigate>
    }

    return children;
};

export default RequireAdmin;