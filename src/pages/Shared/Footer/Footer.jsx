import React from 'react';
import './Footer.css';
import { FaInstagram } from "react-icons/fa6";
import { AiOutlineFacebook } from "react-icons/ai";
import { Link } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer className='footer_container'>
            <section className='footer_main text-white'>
                <div className='footer_single_div'>
                    <div>
                        <h1 className='text-4xl'>Click Pick</h1>
                        <p className='mt-4'>Largest product search engine,</p>
                        <p>maximum categorized online shopping mall</p>
                        <p>and quickest home delivery system.</p>
                        <div className='flex items-center'>
                            <h3 className='text-xl'>Follow Us</h3>
                            <a
                                href="https://www.facebook.com/ars.talukder.shadhin"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-2xl mx-3"
                            >
                                <AiOutlineFacebook />
                            </a>
                            {/* <p className='text-2xl'><FaInstagram /></p> */}
                        </div>
                    </div>
                </div>

                <div className='footer_single_div'>
                    <div>
                        <h3 className='text-xl font-bold'>Contact us</h3>
                        <p className='mt-4'>Shyamoli </p>
                        <p>Shyamoli, Dhaka</p>
                        <p className='flex'><span className='mr-1'>Email:</span> <span>clickpick@gmail.com</span></p>

                    </div>
                </div>

                <div className='footer_single_div'>
                    <div>
                        <h3 className='text-xl font-bold'>Let Us Help You</h3>
                        <p><Link to="dashboard/order_track" className='hover:text-pink-400 hover:underline'>Track Order</Link></p>
                        <p><a href="terms" className='hover:text-pink-400 hover:underline'>Terms & Conditions</a></p>

                    </div>
                </div>

            </section>

            <section className='footer_reserved'>
                <p>© {currentYear} clickpick.com | All rights reserved.</p>
            </section>
        </footer>
    );
};

export default Footer;