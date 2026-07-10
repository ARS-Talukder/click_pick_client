import React, { useEffect } from 'react';
import { useSignInWithEmailAndPassword, useSignInWithGoogle } from 'react-firebase-hooks/auth';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import auth from '../../firebase.init';
import Loading from '../Shared/Loading';

const Sign = () => {
    const [signInWithEmailAndPassword, user, loading, error,] = useSignInWithEmailAndPassword(auth);
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const navigate = useNavigate();
    const location = useLocation();
    let from = location.state?.from?.pathname || "/";

    useEffect(() => {
        if (user || gUser) {
            navigate(from, { replace: true });
        }
    }, [user, gUser, from, navigate])

    if (loading || gLoading) {
        return <Loading></Loading>
    }

    let signInError;

    if (error || gError) {
        signInError = <p className='text-red-500 font-bold'><small>{error?.message || gError?.message}</small></p>
    }

    const handleSignIn = event => {
        event.preventDefault();
        const email = event.target.email.value;
        const password = event.target.password.value;
        signInWithEmailAndPassword(email, password);


    }

    const handleGoogleSign = () => {
        signInWithGoogle()
            .then(data => {
                const email = data.user.email;
                const name = data.user.displayName;
                const address = "No Address";
                const phone = "No Mobile Number";
                const customer = { name, email, phone, address }
                if (data.user) {
                    //Post a customer
                    fetch(`http://localhost:5000/customers/${email}`, {
                        method: 'PUT',
                        headers: {
                            'content-type': 'application/json'
                        },
                        body: JSON.stringify(customer)
                    })
                }
            })
    }
    return (
        <div className='flex justify-center items-center mt-6 pt-8 pb-16 px-4'>
            <div className="card w-96 bg-base-100 shadow-2xl">
                <div className="card-body">
                    <h2 className="text-center text-2xl text-slate-500 font-bold my-2">Hi, Welcome Back</h2>
                    <form onSubmit={handleSignIn} action="">
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Email</span>
                            </label>
                            <input type="email" name="email" placeholder="Your Email" className="input input-bordered w-full max-w-xs" required />

                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Password</span>
                            </label>
                            <input type="password" name="password" placeholder="Password" className="input input-bordered w-full max-w-xs" required />

                        </div>

                        {signInError}

                        <input className='btn w-full max-w-xs mt-4 text-white bg-blue-500 hover:bg-blue-600' type="submit" value="Login" />
                    </form>

                    <p className='text-slate-500'>
                        <small>
                            <span className='underline'>New to PeakyOnline?</span>
                            <Link className="text-primary" to="/register"> Create an account</Link>
                        </small>
                    </p>

                    <div className="divider">OR</div>

                    <button onClick={handleGoogleSign} className='flex justify-center items-center border-2 rounded-lg py-2 border-blue-400 hover:border-blue-600 cursor-pointer'>
                        <div className="flex justify-center items-center w-3/4 max-w-xs rounded submit-button">
                            <img className='w-5 h-5 m-0' src="https://i.ibb.co/vcHZKPm/google-logo.png" alt="google_logo" />
                            <span className='mx-2 text-slate-500 font-bold'><small>CONTINUE WITH GOOGLE</small></span>
                        </div>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Sign;