import React, { useEffect, useState } from 'react'
import { Link, Outlet, useParams } from 'react-router-dom';
import Footer from '../../../Shared/Footer/Footer';



const NestedProductRoute = () => {
    const { id } = useParams();
    const [activeButton, setActiveButton] = useState();
    const btns = [
        {
            id: 1,
            name: "Description",
            to: `/product-description/${id}`,
        },
        {
            id: 2,
            name: "Old Work",
            to: `/product-description/oldWork/${id}`,
        }
    ]

    const handleButtonClick = (item) => {
        setActiveButton(item.id);
    };

    useEffect(() => {
        if (window.location.href.toString().includes('oldWork')) {
            setActiveButton(2);
        } else {
            setActiveButton(1);
        }
    }, [])



    return (
        <div>
            <div className='container xs:mt-5 md:mt-9 '>
                <div className=' flex justify-start gap-6 mb-6'>
                    {btns.map((item, index) => (
                        <Link key={index}
                            onClick={() => handleButtonClick(item)}
                            to={item.to} className={`font-[500] ${activeButton == item.id ? "bg-[#1B75BC] text-white" : "bg-white"}  flex items-center justify-center text-center  font-[500]  border-[#afd6f3] border-2 rounded-[3rem] text-[#1B75BC] xs:text-sm md:text-[17px]  xs:p-2 md:p-3 min-w-[150px]`}>{item.name}</Link>
                    ))}
                </div>
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}

export default NestedProductRoute