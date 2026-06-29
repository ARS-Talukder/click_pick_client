import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Product from '../Products/Product';

const CategoryItems = () => {
    const { name } = useParams();
    let content;
    const [products, setProducts] = useState([])
    useEffect(() => {
        fetch(`http://localhost:5000/category/${name}`)
            .then(res => res.json())
            .then(data => setProducts(data))

    }, [name])

    if (products.length === 0) {
        content = <p className='text-red-500'>Sorry!! This Category has no products right now.</p>
    }

    if (products.length !== 0) {
        content = products.map(product => <Product key={product._id} product={product}></Product>)
    }
    return (
        <div className='mb-6 px-5 lg:px-16 md:px-8'>
            <h2 className='text-2xl font-bold text-black my-4'>{name}</h2>
            <div className='grid grid-cols-2 lg:grid-cols-6 md:grid-cols-4 gap-5'>
                {
                    content
                }
            </div>

        </div>
    );
};

export default CategoryItems;