import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCreateUserWithEmailAndPassword, useSignInWithGoogle, useUpdateProfile } from 'react-firebase-hooks/auth';
import auth from '../../firebase.init';
import Loading from '../Shared/Loading';

const Register = () => {
    // const [email, setEmail] = useState('');
    // const [password, setPassword] = useState('');
    const [signInWithGoogle, gUser, gLoading, gError] = useSignInWithGoogle(auth);
    const [
        createUserWithEmailAndPassword,
        emailUser,
        emailLoading,
        emailError,
    ] = useCreateUserWithEmailAndPassword(auth);
    const [updateProfile, updating, uError] = useUpdateProfile(auth);
    // const [token] = useToken(emailUser || user)
    const navigate = useNavigate();

    let error_message;

    if (emailError || uError || gError) {
        error_message = <p className='text-red-500 font-bold'><small>{emailError?.message || gError?.message}</small></p>
    }
    if (emailLoading || updating || gLoading) {
        return <Loading></Loading>
    }
    if (emailUser || gUser) {
        navigate('/')
    }


    const handleSignUp = async event => {
        event.preventDefault();
        const name = event.target.name.value;
        const email = event.target.email.value;
        const phone = event.target.phone.value;
        const password = event.target.password.value;
        const confirm_password = event.target.confirm_password.value;
        const customer = { name, email, phone, address: "No Address", role: 'customer' }
        if (password === confirm_password) {
            await createUserWithEmailAndPassword(email, password);
            await updateProfile({ displayName: name });
            //Post a customer
            fetch(`http://localhost:5000/customers/${email}`, {
                method: 'PUT',
                headers: {
                    'content-type': 'application/json'
                },
                body: JSON.stringify(customer)
            })
        }
        if (password !== confirm_password) {
            error_message = <p className='text-red-500 font-bold'><small>Password does not match</small></p>
        }

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
        // singinwithgoogle().then(data => console.log(data)).catch()
    }
    return (
        <div className='flex justify-center items-center mt-6 pt-8 pb-16 px-4'>
            <div className="card w-96 bg-base-100 shadow-2xl">
                <div className="card-body">
                    <h2 className="text-center text-slate-500 text-2xl font-bold">Create an account</h2>
                    <form onSubmit={handleSignUp} action="">
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Name</span>
                            </label>
                            <input type="text" name="name" placeholder="Your Name" className="input input-bordered w-full max-w-xs" required />

                        </div>
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Phone Number</span>
                            </label>
                            <input type="number" name="phone" placeholder="Phone Number" className="input input-bordered w-full max-w-xs" required />

                        </div>
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
                        <div className="form-control w-full max-w-xs">
                            <label className="label">
                                <span className="label-text text-slate-500 font-bold">Confirm Password</span>
                            </label>
                            <input type="password" name="confirm_password" placeholder="Password" className="input input-bordered w-full max-w-xs" required />

                        </div>

                        {error_message}

                        <input className='btn w-full max-w-xs mt-4 text-white bg-blue-500 hover:bg-blue-600' type="submit" value="Register" />
                    </form>

                    <p className='text-slate-500'>
                        <small>
                            <span className='underline'>Already have an account?</span>
                            <Link className="text-primary" to="/sign"> Please Login</Link>
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

export default Register;