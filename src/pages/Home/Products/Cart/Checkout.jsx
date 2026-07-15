import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useCart, useDispatchCart } from '../../../ContextReducer';
import { useNavigate } from 'react-router-dom';
import CheckoutProduct from './CheckoutProduct';
import { FaBangladeshiTakaSign } from "react-icons/fa6";
import { MdOutlineSell } from "react-icons/md";
import { SERVER_URL } from '../../../../api/api';

const Checkout = () => {
    const data = useCart();
    const dispatch = useDispatchCart();
    const navigate = useNavigate();

    // if the cart is empty the user can't stay on this checkout
    useEffect(() => {
        if (data.length === 0) {
            toast.error("Your cart is empty.");
            navigate("/", { replace: true });
        }
    }, [data, navigate]);

    const [freeShipping, setFreeShipping] = useState(false);
    const [shipping, setShipping] = useState(130);
    const [paymentMethod, setPaymentMethod] = useState('');
    const [transactionID, setTransactionID] = useState('');
    const [couponCode, setCouponCode] = useState('');

    // coupon states
    const [availableCoupons, setAvailableCoupons] = useState([]);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    // Address states
    const [divisions, setDivisions] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [upazilas, setUpazilas] = useState([]);

    const [selectedDistrictId, setSelectedDistrictId] = useState('');
    const [selectedDistrictName, setSelectedDistrictName] = useState('');
    const [selectedDivision, setSelectedDivision] = useState('');
    const [selectedUpazila, setSelectedUpazila] = useState('');

    // Fetch divisions
    useEffect(() => {
        fetch(`${SERVER_URL}/divisions`)
            .then(res => res.json())
            .then(data => setDivisions(data.data || []))
            .catch(err => console.error("Error fetching divisions:", err));
    }, []);

    // Fetch coupons
    useEffect(() => {
        fetch(`${SERVER_URL}/coupons`)
            .then(res => res.json())
            .then(data => setAvailableCoupons(data))
            .catch(err => console.error("Error fetching coupons:", err));
    }, []);

    const handleDivisionChange = (e) => {
        const divisionId = e.target.value;
        const division = divisions.find(d => d.id === divisionId);

        setSelectedDivision(division?.name || "");
        setSelectedUpazila("");
        setDistricts([]);
        setUpazilas([]);

        if (divisionId) {
            fetch(`${SERVER_URL}/districts/${divisionId}`)
                .then(res => res.json())
                .then(data => setDistricts(data.data || []))
                .catch(err => console.error("Error fetching districts:", err));
        }
    };

    const handleDistrictChange = (e) => {
        const districtId = e.target.value;
        const district = districts.find(d => d.id === districtId);

        setSelectedDistrictId(districtId);
        setSelectedDistrictName(district?.name || "");
        setSelectedUpazila("");
        setUpazilas([]);

        if (districtId) {
            fetch(`${SERVER_URL}/upazilas/${districtId}`)
                .then(res => res.json())
                .then(data => setUpazilas(data.data || []))
                .catch(err => console.error("Error fetching upazilas:", err));
        }
    };

    const handleFreeShipping = () => {
        const allFree = data.every(p => p.shippingCharge === 'free');
        if (allFree) {
            setShipping(0);
            setFreeShipping(true);
        }
    };
    useEffect(handleFreeShipping, [data]);

    const handleCouponApply = () => {
        const found = availableCoupons.find(c => c.coupon_code === couponCode.trim().toUpperCase());
        if (found) {
            setAppliedCoupon(found);
            toast.success(`Coupon "${found.coupon_code}" applied successfully!`);
        } else {
            setAppliedCoupon(null);
            toast.error("Invalid coupon code");
        }
    };

    const handleKeyPress = (e) => { if (e.key === 'Enter') handleCouponApply(); };

    let subTotal = 0;
    data.forEach(item => subTotal += item.discount_price * item.quantity);

    let discount = appliedCoupon ? parseFloat(appliedCoupon.coupon_discount) : 0;
    let total = subTotal + shipping - discount;

    const date = new Date().toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });

    const handleShipping = (e) => { if (!freeShipping) setShipping(e.target.value === 'inside_dhaka' ? 60 : 130); };

    const handleConfirmOrder = (e) => {
        e.preventDefault();
        if (!paymentMethod) return toast.error('Please select a payment method.');
        if (paymentMethod === 'bKash') {
            if (!transactionID.trim()) return toast.error('Please enter a bKash Transaction ID.');
            if (transactionID.trim().length < 8) return toast.error('Transaction ID must be at least 8 characters.');
        }

        const orderID = Math.floor(10000000 + Math.random() * 90000000);
        const customerName = e.target.name.value;
        const street = e.target.street.value;
        const phone = e.target.phone.value;

        const order = {
            customerName,
            orderID,
            address: { street, upazila: selectedUpazila, district: selectedDistrictName, division: selectedDivision },
            subTotal,
            shipping,
            discount,
            total,
            phone,
            products: data,
            coupon: appliedCoupon ? appliedCoupon.coupon_code : null, // save applied coupon
            date,
            time,
            paymentMethod,
            transactionID: paymentMethod === 'bKash' ? transactionID : null,
            status: 'processing',
            status_color: 'yellow',
            orderSteps: [
                { time: `${date}\n${time}`, title: 'Order Placed', description: `Your order is successfully placed. Order id ${orderID}` },
                { time: `${date}\n${time}`, title: 'Processing', description: 'We have received your order. Our team will confirm shortly' }
            ]
        };

        fetch(`${SERVER_URL}/orders`, {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify(order)
        })
            .then(res => res.json())
            .then(data => {
                if (data.acknowledged) {
                    toast.success("Congratulations! Your order's completed");
                    dispatch({ type: "CLEAR" });
                    navigate('/confirmed', { state: orderID });
                } else toast.error('Sorry! Try again');
            });

        const customer = { name: customerName, email: "No Email", address: { street, upazila: selectedUpazila, district: selectedDistrictName, division: selectedDivision }, phone };
        fetch(`${SERVER_URL}/customers/${phone}`, { method: 'PUT', headers: { 'content-type': 'application/json' }, body: JSON.stringify(customer) });
    };

    return (
        <div className='grid grid-cols-1 lg:grid-cols-5 gap-6 px-4 lg:px-32 py-6'>
            {/* Customer Form */}
            <div className='col-span-3 border rounded-lg p-4 shadow-sm bg-white'>
                <h3 className='text-slate-600 text-center mb-4 text-sm'>
                    Fill the information below & click <span className='text-purple-500 font-bold'>Confirm Order</span>
                </h3>
                <form onSubmit={handleConfirmOrder} className='space-y-3'>
                    <label className='block'>
                        <span className='text-sm font-semibold'>Full Name</span>
                        <input type="text" name="name" placeholder="Enter your first & last name" className='input input-md input-bordered w-full mt-1 rounded-none' required />
                    </label>

                    <label className='block'>
                        <span className='text-sm font-semibold'>Phone Number</span>
                        <input type="number" name="phone" placeholder="Please enter your phone number" className='input input-md input-bordered w-full mt-1 rounded-none' required />
                    </label>

                    <div className='grid grid-cols-2 gap-4'>
                        <label className='block'>
                            <span className='text-sm font-semibold'>Region</span>
                            <select onChange={handleDivisionChange} required className='select select-bordered select-md w-full mt-1 rounded-none'>
                                <option value="">Please choose your region</option>
                                {divisions.map(div => <option key={div.id} value={div.id}>{div.name}</option>)}
                            </select>
                        </label>

                        <label className='block'>
                            <span className='text-sm font-semibold'>City</span>
                            <select
                                onChange={handleDistrictChange}
                                required
                                className={`select select-bordered select-md w-full mt-1 rounded-none 
        ${!selectedDivision ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'cursor-pointer bg-white text-black'}`}
                                value={selectedDistrictId}
                                disabled={false}
                            >
                                <option value="" disabled={!selectedDivision}>Please choose your city</option>
                                {districts.map(dist => (
                                    <option key={dist.id} value={dist.id}>{dist.name}</option>
                                ))}
                            </select>
                        </label>
                    </div>

                    <label className='block'>
                        <span className='text-sm font-semibold'>Sub-city/ Upazila</span>
                        <select
                            onChange={(e) => setSelectedUpazila(e.target.value)}
                            value={selectedUpazila}
                            required
                            className={`select select-bordered select-md w-full mt-1 rounded-none 
            ${!selectedDistrictName ? 'cursor-not-allowed bg-gray-100 text-gray-400' : 'cursor-pointer bg-white text-black'}`}
                            disabled={false}
                        >
                            <option value="" disabled={!selectedDistrictName}>Please choose your upazila</option>
                            {upazilas.map((u, i) => (
                                <option key={i} value={u.name}>{u.name}</option>
                            ))}
                        </select>
                    </label>

                    <label className='block'>
                        <span className='text-sm font-semibold'>Address</span>
                        <input type="text" name="street" placeholder="For Example: House# 123, Street# 123, ABC Road" className='input input-md input-bordered w-full mt-1 rounded-none' required />
                    </label>

                    {freeShipping ? (
                        <label className='block'>
                            <span className='text-sm font-semibold'>Shipping</span>
                            <input type="text" value="Free Shipping" disabled className='input input-md input-bordered w-full mt-1 disabled:text-green-600 disabled:font-bold rounded-none' />
                        </label>
                    ) : (
                        <label className='block'>
                            <span className='text-sm font-semibold'>Shipping Area</span>
                            <select defaultValue='outside_dhaka' onChange={handleShipping} className='select select-bordered select-md w-full mt-1 rounded-none'>
                                <option value="outside_dhaka">Outside Dhaka (৳130)</option>
                                <option value="inside_dhaka">Inside Dhaka (৳60)</option>
                            </select>
                        </label>
                    )}

                    <button type="submit" className='btn w-full mt-4 text-white bg-blue-500 hover:bg-blue-600'>Confirm Order</button>
                </form>
            </div>

            {/* Order Summary & Payment */}
            <div className='col-span-2 space-y-6'>
                {/* Order Summary */}
                <div className='border rounded-lg p-4 shadow-sm bg-white'>
                    <h3 className='font-bold text-blue-800 mb-3'><small>Order Summary</small></h3>
                    {data.map((product, index) => <CheckoutProduct key={index} index={index} product={product} />)}

                    <div className="my-3">
                        <h3 className="flex items-center font-bold text-blue-700"><MdOutlineSell className='mr-2' />Have a coupon code?</h3>
                        <div className="flex gap-2 my-3">
                            <input type="text" value={couponCode} onChange={(e) => setCouponCode(e.target.value)} onKeyPress={handleKeyPress} placeholder="Enter coupon code" className="flex-1 px-4 py-2 input-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
                            <button onClick={handleCouponApply} className="px-6 py-2 bg-blue-600 text-white btn-sm font-medium rounded-md hover:bg-blue-700">Apply</button>
                        </div>
                    </div>

                    <hr />
                    <div className='flex justify-between my-3 text-sm'>
                        <span>Subtotal</span>
                        <span className='flex items-center font-bold text-red-600'>
                            <FaBangladeshiTakaSign className='text-xs' />{subTotal}
                        </span>
                    </div>

                    <div className='flex justify-between my-3 text-sm'>
                        <span>Shipping (+)</span>
                        <span className='flex items-center font-bold text-red-600'>
                            <FaBangladeshiTakaSign className='text-xs' />{shipping}
                        </span>
                    </div>

                    {appliedCoupon && (
                        <div className='flex justify-between my-3 text-sm text-green-600'>
                            <span>Coupon (-) <b>{appliedCoupon.coupon_code}</b></span>
                            <span className='flex items-center font-bold'>
                                <FaBangladeshiTakaSign className='text-xs' />{discount}
                            </span>
                        </div>
                    )}

                    <hr className='my-2' />

                    <div className='flex justify-between font-bold my-4'>
                        <span>Total</span>
                        <span className='flex items-center text-red-600'>
                            <FaBangladeshiTakaSign className='text-xs' />{total}
                        </span>
                    </div>
                </div>

                {/* Payment Section */}
                <div className='border rounded-lg p-4 shadow-sm bg-white'>
                    <h2 className='text-lg font-semibold text-gray-700 mb-3'>Payment Information</h2>
                    <div className='space-y-3'>
                        <label className='flex items-center space-x-2'>
                            <input type='radio' name='paymentMethod' value='COD' className='radio radio-sm' onChange={() => setPaymentMethod('COD')} required />
                            <span className='text-sm font-bold text-slate-600'>Cash on Delivery</span>
                        </label>
                        <label className='flex items-center space-x-2'>
                            <input type='radio' name='paymentMethod' value='bKash' className='radio radio-sm' onChange={() => setPaymentMethod('bKash')} />
                            <span className='text-sm font-bold text-slate-600 flex items-center'>
                                bKash <img src="https://i.ibb.co.com/DPbM1wtB/BKash-Logo-wine.png" alt="bKash" className='h-6 ml-1' />
                            </span>
                        </label>

                        {paymentMethod === 'COD' && <p className='text-xs text-gray-600 my-2 rounded bg-slate-100 border p-2'>Partial advance may be required depending on product or location.</p>}

                        {paymentMethod === 'bKash' && (
                            <div>
                                <p className='text-xs text-gray-600 my-2 rounded bg-slate-100 border p-2'>Send money to <span className='font-bold text-red-500'>01814728277</span> and enter your Transaction ID.</p>
                                <input type='text' name='transactionId' placeholder='Transaction ID or last 4 digits' value={transactionID} onChange={(e) => setTransactionID(e.target.value)} className={`input input-sm input-bordered w-full ${transactionID && transactionID.length < 8 ? 'border-red-500' : ''}`} required={paymentMethod === 'bKash'} />
                                {transactionID && transactionID.length < 8 && <p className='text-xs text-red-500'>Transaction ID must be at least 8 characters.</p>}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
