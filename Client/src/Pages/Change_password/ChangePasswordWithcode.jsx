/* eslint-disable react/no-unescaped-entities */
// import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import image from "../../assets/ezgif.com-video-to-gif.gif";
import { FaEyeSlash, FaEye, FaExclamationCircle } from "react-icons/fa";
import { Field, Formik, Form } from "formik";
import { useState } from "react";

import "react-phone-number-input/style.css";
import { useNavigate } from "react-router";
import { Link, useParams } from "react-router-dom";
import { TERipple } from "tw-elements-react";
import * as Yup from "yup";
import Tech_Logit from "../../API/config";
import SEO from "../../utils/Seo.jsx";

// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export default function ChangePasswordWithCode() {
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    let { email,code } = useParams();

    async function addUser(values) {
        setLoading(true); // Start loading
        try {
            await Tech_Logit.post("auth/forgetpassword", values);
            setShowModal(true);
        } catch (error) {
            setError(true);
        } finally {
            setLoading(false); // Stop loading
        }
    }

    {
        /* Formik Configuration  */
    }
    const initialValues = {
        email: decodeURIComponent(email),
        resetCode: code,
        cPassword: "",
    };
    const handleSubmit = async (values) => {
        addUser(values);
    };
    const validationSchema = Yup.object({
        resetCode: Yup.string().required("Required"),
        password: Yup.string()
            .required("This Field is Required")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Must contain at least one special character"
            )
            .matches(/[0-9]/, "Must contain at least one number")
            .min(8, "Must be at least 8 characters long"),
        cPassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match") // Add this custom validation
            .required("This Field is Required")
            .matches(/[A-Z]/, "Must contain at least one uppercase letter")
            .matches(/[a-z]/, "Must contain at least one lowercase letter")
            .matches(
                /[!@#$%^&*(),.?":{}|<>]/,
                "Must contain at least one special character"
            )
            .matches(/[0-9]/, "Must contain at least one number")
            .min(8, "Must be at least 8 characters long"),
    });

    return (
        <>
            <SEO
                title="My Page Title"
                description="Description of My Page"
                ogTitle="My Page Title for Sharing"
                ogDescription="My Page Description for Sharing"
                ogType="website"
                ogImage="URL to My Page Image"
                ogUrl="URL of My Page"
                siteName="My Site Name"
            />

            <div className="flex justify-center min-h-screen">
                {/* <!-- left column container with form --> */}

                <div className="flex items-center justify-center w-full md:w-3/4 lg:w-1/2 mt-20">
                    <Formik
                        initialValues={initialValues}
                        onSubmit={handleSubmit}
                        validationSchema={validationSchema}
                    >
                        {(formik) => (
                            <Form className="xs:w-11/12 md:w-9/12 lg:w-7/12">
                                <h1 className=" mt-10 mb-2 text-2xl md:text-4xl text-center text-[#1b75bc] font-semibold">
                                    Change Password
                                </h1>
                                <p className="mb-12 text-md font-normal text-center text-gray-500 ">
                                    Fill up the form to change the password
                                </p>
                                {/* Password input */}
                                <div className="my-4 relative">
                                    <label className="inputLable" htmlFor="password">
                                        Password
                                    </label>
                                    <div className="relative mb-2">
                                        <Field
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            name="password"
                                            className="field pr-10"
                                            placeholder="Enter your password"
                                        />
                                        {/* show Password  */}
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <FaEyeSlash className="text-neutral-500" />
                                            ) : (
                                                <FaEye className="text-neutral-500" />
                                            )}
                                        </div>
                                    </div>
                                    {/* Display error message */}
                                    {formik.touched.password && formik.errors.password && (
                                        <div className="text-red-500 text-sm flex items-center">
                                            <span className="text-red-700 mx-2">
                                                <FaExclamationCircle />
                                            </span>{" "}
                                            {formik.errors.password}
                                        </div>
                                    )}
                                </div>

                                {/* CPassword input */}
                                <div className="my-4 relative">
                                    <label className="inputLable" htmlFor="password">
                                        Confirm Password
                                    </label>
                                    <div className="relative mb-2">
                                        <Field
                                            type={showCPassword ? "text" : "password"}
                                            id="cPassword"
                                            name="cPassword"
                                            className="field pr-10"
                                            placeholder="Confirm your password"
                                        />
                                        {/* show Password  */}
                                        <div
                                            className="absolute inset-y-0 right-0 flex items-center pr-3 cursor-pointer"
                                            onClick={() => setShowCPassword(!showCPassword)}
                                        >
                                            {showCPassword ? (
                                                <FaEyeSlash className="text-neutral-500" />
                                            ) : (
                                                <FaEye className="text-neutral-500" />
                                            )}
                                        </div>
                                    </div>
                                    {/* Display error message */}
                                    {formik.touched.cPassword && formik.errors.cPassword && (
                                        <div className="text-red-500 flex text-sm items-center">
                                            <span className="text-red-700 mx-2">
                                                <FaExclamationCircle />
                                            </span>{" "}
                                            {formik.errors.cPassword}
                                        </div>
                                    )}
                                </div>

                                {formik.touched.agreeToTerms && formik.errors.agreeToTerms && (
                                    <div className="text-red-500">
                                        {formik.errors.agreeToTerms}
                                    </div>
                                )}

                                {/* <!-- Submit button --> */}
                                <TERipple rippleColor="light" className="w-full">
                                    <button
                                        type="submit"
                                        className={`inline-block w-full rounded-full bg-[#1b75bc] px-7 pb-2.5 pt-3
                                            text-sm font-medium capitalize leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]
                                            transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 
                                            active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]`}
                                        disabled={loading} // Disable the button when loading is true
                                    >
                                        {loading ? (
                                            <div className="flex items-center justify-center">
                                                <div className="w-5 h-5 border-t-2 border-r-2 border-b-2 border-white rounded-full animate-spin" />
                                                <span className="ml-2">Changing Password...</span>
                                            </div>
                                        ) : (
                                            "Change Password"
                                        )}
                                    </button>
                                </TERipple>
                                <p className="my-5 text-sm text-neutral-700 text-center">
                                    <Link
                                        to={"/signin"}
                                        className="text-primary-600 hover:underline focus:underline active:text-primary-700"
                                    >
                                        Not your account?
                                    </Link>
                                </p>
                            </Form>
                        )}
                    </Formik>
                </div>

                {/* <!-- Right column container with background--> */}
                <div className="hidden lg:flex items-center justify-center min-h-screen w-1/2 bg-[#eaedf6]">
                    <div className="lg:w-12/12 ">
                        <img src={image} className="w-full max-w-full" alt="Phone image" />
                    </div>
                </div>
            </div>

            {showModal ? (
                <>
                    <div className="shadow-xl justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                        <div className="relative w-auto my-6 mx-auto max-w-3xl">
                            {/*content*/}
                            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                                {/*body*/}
                                <div className="flex items-center justify-center  p-5  min-w-screen ">
                                    <div className="max-w-xl p-8 text-center text-gray-800  bg-white  lg:max-w-3xl rounded-3xl lg:p-12">
                                        <h3 className="text-2xl capitalize">
                                            your password has been changed successfully
                                        </h3>
                                        <div className="flex justify-center mt-7">
                                            <svg
                                                className="w-32 h-32"
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="green"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                            >
                                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                                {/*footer*/}
                                <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                                    <button
                                        className="text-red-500 background-transparent font-bold capitalize px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Close
                                    </button>
                                    <button
                                        className="bg-main-color text-white  font-bold capitalize text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                                        type="button"
                                        onClick={() => {
                                            setShowModal(false), navigate(`/signin`);
                                        }}
                                    >
                                        Login
                                        <FontAwesomeIcon className="ms-3" icon={faArrowRight} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
                </>
            ) : null}
        </>
    );
}
