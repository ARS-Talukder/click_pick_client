import React from 'react';
import { useNavigate } from 'react-router-dom';

const Category = ({ category }) => {
    const { name, img } = category;
    const navigate = useNavigate();
    const navigateToInventory = name => {
        navigate(`/${name}`);

        // Pushing Data to the Data Layer for Google data manager(GTM)
        window.dataLayer.push({
            event: 'category_button',
            ecommerce: {
                categoryName: { name }
            },
            buttonText: 'Category Button',
            buttonClick: 'Clicked',
            pagePath: window.location.pathname,
        });
    }
    return (
        <div className='mx-5 flex justify-center items-center' onClick={() => navigateToInventory(name)}>
            <div>
                <div className="avatar">
                    <div className="w-16 lg:w-20 shadow-lg shadow-black hover:shadow-xl transition-shadow duration-300 rounded-3xl">
                        <img className='w-full text-center' src={img} alt='category_img' />
                    </div>
                </div>

                <div>
                    <p className='text-center font-bold'><small>{name}</small></p>
                </div>
            </div>
        </div>
    );
};

export default Category;