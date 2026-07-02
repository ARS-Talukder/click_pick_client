import React from 'react';
import toast from 'react-hot-toast';
import { TbPointFilled } from "react-icons/tb";
import { AiFillDelete } from "react-icons/ai";

const Order = ({ order, index, refetch }) => {
    const { _id, date, orderID, time, shipping, total, products, customerName, email, phone, address, status, paymentMethod, transactionID } = order;

    const statusFlow = ["processing", "confirmed", "packed", "delivered"];
    const currentIndex = statusFlow.includes(status) ? statusFlow.indexOf(status) : 0;

    let currentDate = new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });
    const currentTime = new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
    });

    const handleOrderState = (event) => {
        const stateName = event.target.value;
        let newStep1
        let newStep2

        const now = `${currentDate}\n${currentTime}`;

        if (stateName === 'confirmed') {
            newStep1 = { time: now, title: 'Confirmed', description: 'We have confirmed your order.' }
            newStep2 = { time: now, title: 'Packing', description: 'We are currently packing your order.' }
        }
        if (stateName === 'packed') {
            newStep1 = { time: now, title: 'Packed', description: 'Your order is packed now.' }
            newStep2 = { time: now, title: 'Delivering', description: 'Your order is now ready for delivering' }
        }
        if (stateName === 'delivered') {
            newStep1 = { time: now, title: 'Delivered', description: 'You have received your order' }
        }
        if (stateName === 'canceled') {
            newStep1 = { time: now, title: 'Canceled', description: 'Sorry, your order has been canceled by our team. For more details, please contact +8801814728277' }
        }

        // Build steps array safely
        const steps = [];
        if (newStep1) steps.push(newStep1);
        if (newStep2) steps.push(newStep2);


        // Send both status and steps
        const data = {
            state: stateName,
            steps: steps
        };

        fetch(`http://localhost:5000/order_state/${_id}`, {
            method: 'PATCH',
            headers: {
                'content-type': 'application/json'
            },
            body: JSON.stringify(data)
        }).then(res => {
            return res.json()
        }).then(data => {
            refetch();

        })
        toast.success(`Order is ${stateName}`)
    }


    let classColor
    if (status === 'processing') {
        classColor = 'text-xl text-yellow-500'
    }
    if (status === 'confirmed') {
        classColor = 'text-xl text-black'
    }
    if (status === 'canceled') {
        classColor = 'text-xl text-red-500'
    }
    if (status === 'packed') {
        classColor = 'text-xl text-blue-600'
    }
    if (status === 'delivered') {
        classColor = 'text-xl text-green-500'
    }

    const handleDelete = (id) => {
        const proceed = window.confirm('Do You Want to remove this order information from database?');
        if (proceed) {
            fetch(`http://localhost:5000/order-delete/${id}`, {
                method: 'DELETE'
            })
                .then(res => res.json())
                .then(data => {
                    toast.success("Removed");
                    refetch();
                })
        }
        else {
            return;
        }
    }

    return (
        <tr className='text-slate-600 font-bold'>
            <th className='border'>{index + 1}</th>
            <th className='border'>{orderID}</th>
            <td className='border'>
                {products.map((p, index) => <p key={p.product_id}>
                    <p className='w-full truncate' title={p.name}>
                        <small>
                            <span className='text-black'>{index + 1}. </span>{p.name.length > 30 ? p.name.slice(0, 35) + '..' : p.name}
                        </small>
                    </p>
                    {p.size && <p className='mt-1'><small><span className='border border-blue-500 px-2'>{p.size}</span></small></p>
                    }
                    {p.color && <p className='mt-1'><small><span className='border border-blue-500 px-2'>{p.color}</span></small></p>}

                </p>)}
            </td>
            <td className="border">
                {products.map(p => (
                    <div key={p.product_id} className="flex justify-center items-center gap-1">
                        <span>{p.quantity}</span>
                        <span>x</span>
                        <span>{p.discount_price}</span>
                        <span className='text-red-600'>(-{p.discount}%)</span>
                        <span className='text-black'>={p.discount_price * p.quantity}</span>

                    </div>
                ))}
            </td>
            <td className='border'>{shipping}</td>
            <td className='font-bold border'>{total}</td>
            <td className='border'>
                <p>{date}</p>
                <p>{time}</p>
            </td>
            <td className='border'>
                <p className='text-blue-600'>{customerName}</p>
                <p>{email}</p>
                <p className='text-red-600'>{phone}</p>
                <div>
                    <p>
                        <small>
                            <span className='text-black'>{address.street}</span>
                        </small>
                    </p>
                    <p>
                        <small>
                            <span>Upazilla: </span>
                            <span className='text-black'>{address.upazila}</span>
                        </small>
                    </p>
                    <p>
                        <small>
                            <span>District: </span>
                            <span className='text-black'>{address.district}</span>
                        </small>
                    </p>
                    <p>
                        <small>
                            <span>Division: </span>
                            <span className='text-black'>{address.division}</span>
                        </small>
                    </p>
                </div>
            </td>
            <td className='border'>
                <p>{paymentMethod}</p>
                <p className='text-red-600'>{transactionID}</p>
            </td>
            <td>
                <select
                    value={status}
                    onChange={handleOrderState}
                    className="select select-sm select-primary"
                    disabled={status === 'delivered' || status === 'canceled' && true}
                >
                    {status === "canceled" ? (
                        // Only show Canceled when canceled is selected
                        <option value="canceled" className="text-red-500">
                            Canceled
                        </option>
                    ) : (
                        <>
                            {/* Show the status options from current position */}
                            {statusFlow.slice(currentIndex).map(item => (
                                <option
                                    key={item}
                                    value={item}
                                    disabled={item === status}
                                    className={
                                        item === "processing" ? "text-yellow-500" :
                                            item === "confirmed" ? "text-black" :
                                                item === "packed" ? "text-blue-600" :
                                                    item === "delivered" ? "text-green-500" : ""
                                    }
                                >
                                    {item.charAt(0).toUpperCase() + item.slice(1)}
                                </option>
                            ))}

                            {/* Show 'Canceled' if status is not delivered or canceled */}
                            {status !== "delivered" && (
                                <option value="canceled" className="text-red-500">
                                    Canceled
                                </option>
                            )}
                        </>
                    )}
                </select>
            </td>
            <td className='border'>
                <button onClick={() => handleDelete(_id)} className='p-1 bg-red-100 rounded hover:bg-red-200' title="Delete">
                    <AiFillDelete className="text-2xl text-red-500"></AiFillDelete>
                </button>
            </td>
        </tr>
    );
};

export default Order;