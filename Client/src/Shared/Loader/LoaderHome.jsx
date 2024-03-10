import { motion } from 'framer-motion';
import { useRef, useState } from "react";
import '../NavBar/NavBar.css'
import '../../Components/HomeComponents/latestprojects/ourLatestProjects.css'
function LoaderHome() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const dropDawnProfileRef = useRef(null);
    const [openProfileDropDown, setOpenProfileDropDown] = useState(false);


    return (
        <div className="">
            <nav className={` w-full z-[21] pb-1 px-2 bg-gray-200`}>
                <div className="navbar mx-auto xs:px-3 sm:px-3 lg:px-[2vw] xl:px-[5.2vw]">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            {/* Logo Skeleton */}
                            <div className="logo">
                                <div className="w-[76px] h-[58px] m-3 me-8 max-w-[100%] bg-white animate-pulse"></div>
                            </div>
                            {/* Navigation Links Skeleton */}
                            <div className="relative hidden pt-2 lg:flex sm:space-x-6 xl:space-x-8 text-sm md:text-[0.9rem] xl:text-[1rem] xl:font-normal xl:leading-3 xl:tracking-tight flex-2">
                                {[1, 2, 3, 4, 5].map((item, index) => (
                                    <div
                                        key={index}
                                        className={`animate-pulse ${index === 0 ? "" : "ms-6"
                                            } w-[80px] h-6 rounded-full  bg-white`}
                                    ></div>
                                ))}
                            </div>
                        </div>
                        <div className="hidden xs:flex items-center space-x-4">
                            {/* User Login/Logout Button Skeleton */}
                            <div className="w-[100px] h-8  bg-white rounded-full animate-pulse"></div>
                            {/* Request a Service Button Skeleton */}
                            <div className="w-[180px] h-8  bg-white rounded-full animate-pulse"></div>
                            {/* Mobile Menu Icon Skeleton */}
                            <div className="w-8 h-8  bg-white rounded-full animate-pulse"></div>
                        </div>
                    </div>
                    {/* Profile Dropdown Skeleton */}
                    <div className="relative" ref={dropDawnProfileRef}>
                        {/* Profile Button Skeleton */}
                        {/* Profile Dropdown Content Skeleton */}
                        {openProfileDropDown && (
                            <div className="absolute left-[-4rem] bg-white w-[250px] text-black rounded-md shadow-md top-[60px]">
                                {/* Profile Dropdown Items Skeleton */}
                                {[1, 2, 3, 4, 5].map((item, index) => (
                                    <div
                                        key={index}
                                        className="border-main-color  w-fit text-main-color  cursor-pointer text-sm tracking-wider"
                                        style={{ border: "1px dashed" }}
                                    >
                                        <p className="w-16 sm:w-20 h-2.5 bg-white  dark:bg-gray-700"></p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    {/* Mobile Menu Skeleton */}
                    <div className={`app__navbar-menu md:flex ${mobileMenuOpen ? "open" : ""} `}>
                        {/* Mobile Menu Overlay Skeleton */}
                        {mobileMenuOpen && (
                            <span
                                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                                className="absolute top-2 left-0 bg-[#000000cf] w-[100%] h-screen lg:hidden"
                            ></span>
                        )}
                        <motion.div
                            className="bg-white relative "
                            style={{ padding: "0" }}
                            initial={{ x: "-100%" }}
                            animate={{ x: mobileMenuOpen ? "0" : "-100%" }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            {/* Close Icon Skeleton */}
                            <div className="absolute right-2 top-4 p-5 text-gray-600 w-8 h-8 bg-gray-300 rounded-full animate-pulse"></div>
                            {/* Mobile Menu Logo Skeleton */}
                            <div className="self-center ps-5 mt-6 mr-auto">
                                <div className="w-[76px] h-[58px] max-w-[100%] bg-gray-300 animate-pulse"></div>
                            </div>
                            {/* Mobile Menu Items Skeleton */}
                            <ul className="pt-8 ">
                                {[1, 2, 3, 4, 5, 6, 7].map((item, index) => (
                                    <li
                                        className="w-full text-left xs:text-[12px]"
                                        style={{
                                            borderBottom: "3px solid #ededed",
                                            margin: " 0",
                                            padding: "1rem 0",
                                        }}
                                        key={index}

                                    >
                                        \                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </nav>


            <div className="header flex justify-between min-h-[80vh]  w-[90%] m-auto  relative xs:pt-[5rem] md:pt-8 pb-8">
                <div className="w-full relative mt-[4rem]">
                    <div className="w-full grid md:grid-cols-12  ">
                        <div className="col-span-12 md:col-span-7 grid  place-content-stretch ">
                            {/* Skeleton Loader for Title */}
                            <div className="animate-pulse">
                                <div className="h-[30px] w-[80%] bg-gray-300 mb-[20px] rounded"></div>
                                <div className="h-[30px] w-[60%] bg-gray-300 mb-[20px] rounded"></div>
                            </div>
                            {/* Skeleton Loader for Description */}
                            <div className="animate-pulse mt-4">
                                <div className="h-[18px] w-[80%] bg-gray-300 mb-8 rounded"></div>
                                <div className="h-[18px] w-[10%] bg-gray-300 mb-8 rounded"></div>
                            </div>
                            {/* Skeleton Loader for Buttons */}
                            <div className="flex sm:gap-3 xs:justify-center md:justify-start xs:items-center md:items-start  sm:flex-row">
                                <div className="xs:w-[150px] sm:w-[200px] pt-4 pb-2 inline-block me-2">
                                    <div className="animate-pulse">
                                        <div className="h-[50px] w-full bg-gray-300 rounded-[3rem]"></div>
                                    </div>
                                </div>
                                <div className="xs:w-[150px] sm:w-[200px] pt-4 pb-2 inline-block">
                                    <div className="animate-pulse">
                                        <div className="h-[50px] w-full bg-gray-300 rounded-[3rem]"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-span-12 md:col-span-5 mt-4 md:mt-0 px-2">
                            {/* Skeleton Loader for Image */}
                            <div className="flex items-center justify-center m-auto w-[400px] h-[400px] bg-gray-300 rounded-full  dark:bg-gray-700">
                                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <div className="relative z-[1] bg-white pb-0 overflow-hidden">

                <section className="bg-white dark:bg-gray-900">
                    <div className="container px-6 py-10 mx-auto animate-pulse">
                        <div className="animate-pulse w-[40%] m-auto   justify-center">
                            <div className="h-[30px] m-auto my-12 w-[50%] bg-gray-300 rounded"></div>
                        </div>

                        <div className="grid grid-cols-1 gap-8 mt-8 xl:mt-12 xl:gap-12 sm:grid-cols-2 lg:grid-cols-3">
                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>

                                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                            </div>

                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>

                                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                            </div>
                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>

                                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                            </div>
                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>

                                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                            </div>
                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>

                                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                            </div>

                            <div className="w-full ">
                                <div className="w-full h-64 bg-gray-300 rounded-lg md:h-72 dark:bg-gray-600"></div>

                                <h1 className="w-56 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></h1>
                                <p className="w-24 h-2 mt-4 bg-gray-200 rounded-lg dark:bg-gray-700"></p>
                            </div>
                        </div>
                    </div>
                </section>

                <div className="flex justify-center items-center w-full h-auto flex-col">
                    <div className="animate-pulse w-[40%] m-auto   justify-center">
                        <div className="h-[30px] m-auto my-12 w-[50%] bg-gray-300 rounded"></div>
                    </div>
                    <div className="grid w-[70%] grid-cols-8 md:gap-14 xs:gap-y-5">
                        {[1, 2, 3, 4].map((index) => {
                            const isEvenIndex = index % 2 === 0;
                            const imageClassName =
                                index === 1 || index === 4
                                    ? " lg:h-[420px] rounded-2xl"
                                    : "lg:h-[300px] rounded-2xl";

                            return (
                                <div
                                    key={index}
                                    className={`xs:col-span-8 md:col-span-4 ${isEvenIndex ? "even" : "odd"
                                        } ${index === 4 && "md:mt-[-7.5rem]"}`}
                                >
                                    <div className="flex justify-center items-center h-auto flex-col">
                                        <div className={`col-span-12 md:col-span-5  px-2 `}>
                                            {/* Skeleton Loader for Image */}
                                            <div className={`flex items-center  ${imageClassName} justify-center m-auto w-[350px] h-[350px] bg-gray-300 rounded-lg  dark:bg-gray-700`}>
                                                <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                                </svg>
                                            </div>
                                        <div className="w-[100%] m-auto">
                                            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[70%]  my-4"></div>
                                            <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[30%]  mb-4"></div>
                                        </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                <div
                    style={{
                        background: "linear-gradient(to bottom, #ffffff, #e9f2f9)",
                    }}
                >
                    {/* <OurLatestProjectsSkeleton /> */}
                </div>
            

                <div className="animate-pulse w-[40%] m-auto   justify-center">
                    <div className="h-[30px] m-auto my-12 w-[50%] bg-gray-300 rounded"></div>
                </div>
                <div role="status" className="space-y-8 pb-20 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center justify-center h-[70vh] w-full md:w-[90%] mx-auto mt-12">

                    <div className="flex items-center justify-center w-full md:w-[450px] h-[450px] bg-gray-300 rounded sm:w-96 dark:bg-gray-700">
                        <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                            <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                        </svg>
                    </div>
                    <div className="w-full md:w-[50%]">
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[440px] mb-2.5"></div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[460px] mb-2.5"></div>
                        <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-full md:w-48 mb-4"></div>
                        <div className="h-9 bg-gray-200 rounded-full dark:bg-gray-700 w-[160px] m-4 inline-block"></div>
                    </div>
                    <span className="sr-only">Loading...</span>
                </div>

                <div className="animate-pulse w-[40%] m-auto   justify-center">
                    <div className="h-[30px] m-auto my-12 w-[50%] bg-gray-300 rounded"></div>
                </div>
                <div role="status" className="space-y-8 pb-20 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items justify-center h-[70vh] w-full md:w-[90%] mx-auto mt-12">
                    <div className="flex items-center justify-center w-full md:w-[450px] h-[450px] bg-gray-300 rounded sm:w-96 dark:bg-gray-700">

                    </div>
                    <div className="w-full md:w-[50%]">
                        <div className="h-9 bg-gray-200 rounded-lg dark:bg-gray-700 mb-2.5  w-[48%] inline-block"></div>
                        <div className="h-9 bg-gray-200 rounded-lg dark:bg-gray-700 mb-2.5  ms-6 w-[48%] inline-block"></div>
                        <div className="h-9 bg-gray-200 rounded-lg dark:bg-gray-700 mb-2.5   w-[100%] inline-block"></div>
                        <div className="h-52 bg-gray-200 rounded-lg dark:bg-gray-700 mb-2.5   w-[100%] inline-block"></div>
                        <div className="w-full flex justify-end ">
                            <div className="h-9 bg-gray-200 rounded-full dark:bg-gray-700 w-[160px] m-4  inline-block"></div>

                        </div>                    </div>
                    <span className="sr-only">Loading...</span>
                </div>


            </div>

            <div className="">

                <footer className="bg-gray-300 text-white relative z-[1]">
                    <div className="xs:p-4 sm:p-4 md:px-[2rem] lg:px-[8rem]">
                        <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-4 sm:gap-2 md:gap-8 sm:px-0 md:px-4 md:py-8">
                            <div className="w-full mb-3 md:mb-0 xs:col-span-1">
                                <div className="skeleton-box bg-white h-12 w-24 mb-2"></div>
                                <p className="skeleton-box bg-white h-20 w-full mb-3"></p>
                                <button className="skeleton-box bg-white h-8 w-24 mb-3"></button>
                            </div>

                            <div className="flex xs:col-span-2">
                                <div className="xs:w-[35%] sm:w-full mb-3 md:mb-0">
                                    <h4 className="skeleton-box bg-white h-8 w-full mb-2"></h4>
                                    <div className="skeleton-box bg-white h-32 w-full mb-3"></div>
                                </div>

                                <div className="xs:w-[65%] sm:w-full mb-3 md:mb-0">
                                    <h4 className="skeleton-box bg-white h-8 w-full mb-2"></h4>
                                    <div className="skeleton-box bg-white h-32 w-full mb-3"></div>
                                </div>
                            </div>

                            <div className="w-full md:mb-0 xs:col-span-1">
                                <h4 className="skeleton-box bg-white h-8 w-full mb-2"></h4>
                                <p className="skeleton-box bg-white h-20 w-full mb-3"></p>

                                <div className="skeleton-box bg-white h-10 w-full mb-3 relative">
                                    <input className="skeleton-box bg-white h-full w-full p-2 rounded-2xl text-gray-600 mr-1 " disabled />
                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                                        {/* You can put the loading icon here */}
                                    </div>
                                </div>
                                <p className="skeleton-box bg-white h-4 w-1/2"></p>
                            </div>
                        </div>
                    </div>
                    <div className="text-center xs:text-sm sm:text-base bg-gray-200 p-3">
                        <div className="skeleton-box bg-white h-6 w-40"></div>
                    </div>
                </footer>

            </div>
        </div>
    )
}

export default LoaderHome