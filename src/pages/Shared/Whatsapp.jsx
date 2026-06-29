import React from 'react';

const Whatsapp = () => {
    return (
        <div className='fixed bottom-16 right-4'>
            <a href="https://api.whatsapp.com/send?phone=8801629396785" target='_blank' rel="noreferrer">
                <img src="https://i.ibb.co.com/VxK8y9K/Whatsapp.png" width={65} alt="chat" />
            </a>
        </div>
    );
};

export default Whatsapp;