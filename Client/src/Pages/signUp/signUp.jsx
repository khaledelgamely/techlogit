/* eslint-disable react/no-unescaped-entities */
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form, Formik } from "formik";
import { useEffect, useState } from "react";
import {
  FaExclamationCircle,
  FaEye,
  FaEyeSlash,
  FaFacebook,
  FaGoogle,
} from "react-icons/fa";
import PhoneInput, {
  isPossiblePhoneNumber,
  isValidPhoneNumber,
} from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";
import { TERipple } from "tw-elements-react";
import * as Yup from "yup";
import Tech_Logit from "../../API/config";
import image from "../../assets/ezgif.com-video-to-gif.gif";
import { countries } from "../../constants/countries";
import { toastMessage } from "../../utils/toasfiy";
import SEO from "../../utils/Seo.jsx";

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [loading, setLoading] = useState(false);
  const [signUpError, setSignUpError] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [values, setValues] = useState([]);

  async function addUser(values) {
    setLoading(true); // Start loading

    try {
      await Tech_Logit.post("auth/signup", values);
      toastMessage("success", "An account has been created");
      setShowModal(true);
      signUpError(false);
    } catch (error) {
      if (error?.response?.data?.error === "Account Already Exist 🙄")
        setSignUpError(true);
      else setSignUpError(false);
    } finally {
      setLoading(false); // Stop loading
    }
  }
  const handleCountryChange = (newCountry, countries) => {
    const selectedCountryObj = countries.find(
      (country) => country.label === newCountry
    );
    if (selectedCountryObj) {
      const selectedCountryLabel = selectedCountryObj.value;
      setSelectedCountry(selectedCountryLabel);
    }
  };

  const handleFacebookIconClick = async (social) => {
    const newWindow = window.open(
      `https://techlogit.com/api/auth/${social}`,
      "_blank",
      "width=600,height=600,top=150px,left=350px"
    );

    window.addEventListener('storage', (event) => {
      if (event.key === 'authenticated' && event.newValue === 'true') {
        newWindow.close();
        window.location.reload();
      }
    });
  };

  {
    /* Yup Validation  */
  }
  const validationSchema = Yup.object({
    firstName: Yup.string()
      .required("This Field is Required")
      .min(3, "First name must be at least 3 characters")
      .max(10, "First name must not exceed 10 characters"),
    lastName: Yup.string()
      .required("This Field is Required")
      .min(3, "Last name must be at least 3 characters")
      .max(10, "Last name must not exceed 10 characters"),
    email: Yup.string()
      .matches(/^.+@.+\..+$/, "Invalid email address")
      .required("This Field is Required"),
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
    phone: Yup.string()
      .test("is-valid-phone", "Invalid phone number", (value) => {
        if (!value) return true; // Allow empty phone numbers
        try {
          const phoneNumber = isPossiblePhoneNumber(value);
          if (!phoneNumber || !isValidPhoneNumber(value)) {
            return false;
          }
          return true;
        } catch (error) {
          return false;
        }
      })
      .required("Phone number is required"),
    country: Yup.string().required("This Field is Required"),
  });

  {
    /* Formik Configuration  */
  }
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    country: "",
  };
  const handleSubmit = (values) => {
    setValues(values);
    addUser(values);
  };

  useEffect(() => {}, [signUpError]);

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
                  Let's Started
                </h1>
                <p className="mb-12 text-base md:text-xl font-normal text-center text-neutral-700 font-dmsans">
                  Sign Up and get access to all the features of Techlogit
                </p>
                <div className="flex mb-4">
                  <div className="w-1/2 pr-2">
                    <label className="inputLable" htmlFor="firstName">
                      First Name
                    </label>
                    <Field
                      type="text"
                      id="firstName"
                      name="firstName"
                      className="field"
                      placeholder="First Name"
                    />
                    {formik.touched.firstName && formik.errors.firstName && (
                      <div className="text-red-500 text-sm flex items-start">
                        <span className="text-red-500 mx-2 mt-1">
                          <FaExclamationCircle />
                        </span>{" "}
                        {formik.errors.firstName}
                      </div>
                    )}
                  </div>
                  <div className="w-1/2 pl-2">
                    <label className="inputLable" htmlFor="lastName">
                      Last Name
                    </label>
                    <Field
                      type="text"
                      id="lastName"
                      name="lastName"
                      className="field"
                      placeholder="Last Name"
                    />
                    {formik.touched.lastName && formik.errors.lastName && (
                      <div className="text-red-500 text-sm flex items-start">
                        <span className="text-red-500 mx-2 mt-1">
                          <FaExclamationCircle />
                        </span>{" "}
                        {formik.errors.lastName}
                      </div>
                    )}
                  </div>
                </div>
                {/* Email input */}
                <div className="">
                  <label className="inputLable" htmlFor="email">
                    Email{" "}
                  </label>
                  <Field
                    onClick={() => {
                      setSignUpError(false);
                    }}
                    type="email"
                    id="email"
                    name="email"
                    className="w-full text-neutral-900 bg-[#F5F7F9] border-neutral-300  placeholder-[#9d9d9d] rounded-lg focus:outline-none focus:ring focus:border-primary focus:placeholder-neutral-400 my-1 px-4 py-2"
                    placeholder="Enter your email"
                  />
                </div>
                {/* Display error message */}
                {formik.touched.email && formik.errors.email && (
                  <div className="text-red-500 text-sm flex items-start">
                    <span className="text-red-500 mx-2 mt-1">
                      <FaExclamationCircle />
                    </span>{" "}
                    {formik.errors.email}
                  </div>
                )}

                {/* Password input */}
                <div className="my-4 relative">
                  <label className="inputLable" htmlFor="password">
                    Password
                  </label>
                  <div className="relative">
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
                    <div className="text-red-500 text-sm flex items-start">
                      <span className="text-red-500 mx-2 mt-1">
                        <FaExclamationCircle />
                      </span>{" "}
                      {formik.errors.password}
                    </div>
                  )}
                </div>

                {/* Country select */}
                <div className="mb-4">
                  <label
                    className="text-neutral-700 text-md transition-transform transform-gpu origin-top-left"
                    htmlFor="country"
                  >
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formik.values.country}
                    onChange={(e) => {
                      formik.handleChange(e);
                      handleCountryChange(e.target.value, countries);
                    }}
                    onBlur={formik.handleBlur}
                    className="w-full text-neutral-900 bg-[#F5F7F9] border-neutral-300 placeholder-[#9d9d9d] rounded-lg focus:outline-none focus:ring focus:border-primary focus:placeholder-neutral-400 my-1 px-2 py-2"
                  >
                    <option value="" disabled>
                      Select your country
                    </option>
                    {countries.map((country) => (
                      <option key={country.value} value={country.label}>
                        {country.label}
                      </option>
                    ))}
                  </select>
                  {/* Display error message */}
                  {formik.touched.country && formik.errors.country && (
                    <div className="text-red-500 text-sm flex items-start">
                      <span className="text-red-500 mx-2 mt-1">
                        <FaExclamationCircle />
                      </span>
                      {formik.errors.country}
                    </div>
                  )}
                </div>
                {/* country & Phone number inputs */}
                <div className="my-6 relative">
                  <label className="inputLable" htmlFor="phone">
                    Phone Number
                  </label>
                  <div className="relative">
                    <PhoneInput
                      className="w-full text-neutral-900 bg-[#FFFF] placeholder-[#9d9d9d] rounded-lg focus:outline-none focus:ring focus:border-primary focus:placeholder-neutral-400 my-1 px-1 "
                      id="phone"
                      name="phone"
                      defaultCountry={selectedCountry}
                      rules={{ required: true }}
                      international
                      placeholder="Enter phone number"
                      value={formik.values.phone}
                      onChange={(value) => {
                        formik.setFieldValue("phone", value);
                      }}
                      onBlur={formik.handleBlur}
                    />
                  </div>
                  {formik.touched.phone && formik.errors.phone && (
                    <div className="text-red-500 text-sm flex items-start">
                      <span className="text-red-500 mx-2 mt-1">
                        <FaExclamationCircle />
                      </span>
                      {formik.errors.phone}
                    </div>
                  )}
                </div>

                {signUpError ? (
                  <div className="text-red-500  my-5  text-[15px] font-[100] flex justify-center items-center">
                    <span className="text-red-500  text-sm  mx-2"></span> An
                    account with this email already exists
                  </div>
                ) : (
                  ""
                )}

                {/* <!-- Submit button --> */}
                <TERipple rippleColor="light" className="w-full ">
                  <button
                    type="submit"
                    className={`inline-block w-full capitalize rounded-full bg-[#1b75bc] px-7 pb-2.5 pt-3
                                                text-sm font-medium  leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]
                                                transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 
                                                active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]`}
                    disabled={loading} // Disable the button when loading is true
                  >
                    {loading ? (
                      <div className="flex items-center justify-center capitalize">
                        <div className="w-5 h-5 border-t-2 border-r-2 border-b-2 border-white rounded-full animate-spin" />
                        <span className="ml-2"> Signing up...</span>
                      </div>
                    ) : (
                      "Sign up"
                    )}
                  </button>
                </TERipple>

                {/* <!-- Divider --> */}
                <div className="my-4 flex items-center before:mt-0.5 before:flex-1 before:border-t before:border-neutral-300 after:mt-0.5 after:flex-1 after:border-t after:border-neutral-300">
                  <h4 className="mx-4 mb-0 text-center dark:text-neutral-200">
                    or continue with
                  </h4>
                </div>
                {/* <!-- Social login buttons --> */}
                <div className="flex">
                  <TERipple rippleColor="light" className="flex-1 me-2">
                    <div
                      className="mb-3 flex items-center justify-center rounded-full border border-[#d2d2d2] px-7 pb-2.5 pt-3 text-center"
                      role="button"
                      onClick={() => handleFacebookIconClick("google")}
                    >
                      <FaGoogle className="mr-2 text-red-500" />
                      Google
                    </div>
                  </TERipple>
                  <TERipple rippleColor="light" className="flex-1 ml-2">
                    <div
                      className="mb-3 flex items-center justify-center rounded-full  border border-[#d2d2d2] px-7 pb-2.5 pt-3 text-center"
                      href="#!"
                      role="button"
                      onClick={() => handleFacebookIconClick("facebook")}
                    >
                      <FaFacebook className="mr-2 text-blue-600" />
                      Facebook
                    </div>
                  </TERipple>
                </div>
                <p className="my-5 text-sm text-neutral-700 text-center">
                  I already have an account{" "}
                  <Link
                    to={"/signin"}
                    className="text-primary-600 hover:underline focus:underline active:text-primary-700"
                  >
                    Sign in
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>

        {/* <!-- Right column container with background--> */}
        <div className="hidden lg:flex items-center justify-center min-h-screen w-1/2 bg-[#eaedf6]">
          <div className="lg:w-12/12 mb-60 ">
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
                    <h3 className="text-2xl">Check your email</h3>
                    <p className="my-3">
                      We've sent a message to{" "}
                      <span className="font-bold">{values?.email}</span> with a
                      link to activite your account.
                    </p>
                    <div className="flex justify-center">
                      <svg
                        className="w-32 h-32"
                        viewBox="0 0 50 21"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M42.2285 0C40.3812 4.92e-05 38.7061 0.741775 37.4785 1.94141H18.4102C18.3787 1.94141 18.3493 1.94909 18.3184 1.95117C18.1298 1.94236 17.9327 1.91521 17.6641 1.97656C17.5086 2.01156 17.3074 2.10876 17.1797 2.28516C17.052 2.46106 17.0156 2.66417 17.0156 2.85547V3.20898C17.0101 3.25944 17 3.30955 17 3.36133V4.11719L17.0156 4.12695V19.9551C17.0156 20.1414 17.0477 20.3306 17.1484 20.502C17.2492 20.6734 17.4182 20.7996 17.5723 20.8613C17.8803 20.9847 18.1304 20.9551 18.3789 20.9551H45.6523C46.0097 20.9551 46.3585 20.8387 46.6152 20.5977C46.872 20.3565 47.0156 19.9997 47.0156 19.627V11.6309C48.2595 10.3975 49.0312 8.69075 49.0312 6.80469C49.0313 3.05339 45.9798 0 42.2285 0ZM42.2285 1C45.4394 1 48.0313 3.59389 48.0312 6.80469C48.0312 10.0156 45.4394 12.6074 42.2285 12.6074C39.0177 12.6074 36.4238 10.0156 36.4238 6.80469C36.4238 3.59389 39.0176 1.0001 42.2285 1ZM42.2285 1.91992C39.5376 1.91992 37.3457 4.11389 37.3457 6.80469C37.3457 9.49559 39.5377 11.6874 42.2285 11.6875C44.9194 11.6875 47.1113 9.49559 47.1113 6.80469C47.1114 4.11389 44.9194 1.91992 42.2285 1.91992ZM42.2285 2.91992C44.379 2.91992 46.1113 4.65429 46.1113 6.80469C46.1113 8.95509 44.3789 10.6875 42.2285 10.6875C40.0781 10.6874 38.3457 8.95509 38.3457 6.80469C38.3457 4.65429 40.0781 2.91992 42.2285 2.91992ZM18.3496 2.95312C18.3775 2.9531 18.3771 2.95312 18.4102 2.95312H36.625C35.8693 4.04923 35.4238 5.37598 35.4238 6.80469C35.4238 8.17802 35.8362 9.45503 36.5391 10.5254L32.2715 13.6211L32.2539 13.6387C32.1417 13.7387 32.0985 13.7439 32.0605 13.7441C32.0226 13.7443 31.9342 13.7282 31.7715 13.6094L18.043 3.61328L18.0156 3.5957V3.27734C18.0495 3.10235 18.1792 2.97857 18.3496 2.95312ZM44.6426 4.63672C44.513 4.63827 44.389 4.69009 44.2969 4.78125L41.1934 7.77148L40.1602 6.77539C40.1131 6.72883 40.0574 6.69206 39.996 6.66721C39.9347 6.64236 39.8691 6.62993 39.8029 6.63064C39.7368 6.63134 39.6714 6.64517 39.6106 6.67132C39.5498 6.69747 39.4949 6.73542 39.4489 6.78298C39.4028 6.83053 39.3667 6.88674 39.3426 6.94835C39.3185 7.00996 39.3068 7.07575 39.3083 7.1419C39.3098 7.20805 39.3244 7.27324 39.3513 7.33371C39.3782 7.39417 39.4167 7.4487 39.4648 7.49414L40.8457 8.82617C40.9389 8.91579 41.0631 8.96586 41.1924 8.96586C41.3217 8.96586 41.4459 8.91579 41.5391 8.82617L44.9902 5.5C45.0632 5.43099 45.1137 5.34161 45.1351 5.2435C45.1565 5.14539 45.1479 5.04311 45.1104 4.94995C45.0729 4.8568 45.0082 4.7771 44.9248 4.72124C44.8413 4.66537 44.743 4.63592 44.6426 4.63672V4.63672ZM18.0156 4.83203L31.1836 14.418C31.4501 14.6121 31.7434 14.7459 32.0664 14.7441C32.3894 14.7441 32.6876 14.5913 32.918 14.3867L37.1523 11.3164C38.3998 12.7173 40.2098 13.6074 42.2285 13.6074C43.6296 13.6074 44.9323 13.18 46.0156 12.4512V19.627C46.0156 19.7646 45.9788 19.8212 45.9297 19.8672C45.8806 19.9132 45.7986 19.9551 45.6523 19.9551H18.3789C18.1652 19.9551 18.0614 19.9415 18.0156 19.9375V4.83203Z"
                          fill="url(#paint0_linear)"
                        />
                        <rect
                          y="5"
                          width="15"
                          height="2"
                          rx="1"
                          fill="#1B75BC"
                        />
                        <rect
                          y="11"
                          width="15"
                          height="2"
                          rx="1"
                          fill="#1B75BC"
                        />
                        <rect
                          y="8"
                          width="6"
                          height="2"
                          rx="1"
                          fill="#1B75BC"
                        />
                        <rect
                          y="15"
                          width="6"
                          height="2"
                          rx="1"
                          fill="#1B75BC"
                        />
                        <rect
                          x="8"
                          y="8"
                          width="6"
                          height="2"
                          rx="1"
                          fill="#1B75BC"
                        />
                        <rect
                          x="8"
                          y="15"
                          width="6"
                          height="2"
                          rx="1"
                          fill="#1B75BC"
                        />
                        <defs>
                          <linearGradient
                            id="paint0_linear"
                            x1="16.9996"
                            y1="10.4791"
                            x2="47.0156"
                            y2="10.4791"
                            gradientUnits="userSpaceOnUse"
                          >
                            <stop stopColor="#1B75BC" />
                            <stop offset="1" stopColor="#1B75BC" />
                          </linearGradient>
                        </defs>
                      </svg>
                    </div>
                    <span className="font-bold">
                      Didn't get an email ? Check your spam folder!{" "}
                    </span>
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
                      setShowModal(false), navigate("/signin");
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
