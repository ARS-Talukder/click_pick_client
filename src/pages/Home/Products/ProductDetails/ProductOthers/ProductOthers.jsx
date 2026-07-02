import React from 'react';

const ProductOthers = ({ product }) => {
    const { images, description } = product;
    const { description_title, description_details, specificDescription } = description;
    return (
        <div className='lg:w-2/3 md:w-3/4 mx-auto py-10 px-4 lg:px-0'>
            <h2 className='text-xl font-bold'>Description</h2>
            <h3 className='text-xl font-bold my-2'>{description_title}</h3>
            <h3 className='text-slate-500 font-bold my-4'>{description_details}</h3>

            <h4 className={specificDescription.length == '' ? 'hidden' : 'font-bold'}>Specification:</h4>
            <div className='text-slate-600 px-3 my-4'>
                {specificDescription?.map(s => <pre key={s._id} className="whitespace-pre-wrap break-words"><small>{s.text}</small></pre>)}
            </div>
            <div className='my-8'>
                {
                    images.map(i => <img key={i._id} src={i.url} alt="product" />)
                }
            </div>
        </div >
    );
};

export default ProductOthers;