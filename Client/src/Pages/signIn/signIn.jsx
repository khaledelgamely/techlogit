import { TERipple } from "tw-elements-react";
import image from "../../assets/ezgif.com-video-to-gif.gif";
import {
  FaGoogle,
  FaFacebook,
  FaEyeSlash,
  FaEye,
  FaExclamationCircle,
} from "react-icons/fa";
import { Field, Formik, Form } from "formik";
import { useState } from "react";
import * as Yup from "yup";
import Tech_Logit from "../../API/config";
import { fetchUser } from "../../store/Slices/userSlice";
import { toastMessage } from "../../utils/toasfiy";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import jwt_decode from "jwt-decode";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import SEO from "../../utils/Seo.jsx";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const initialValues = {
    email: "",
    password: "",
  };
  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("This Field is  Required"),
    password: Yup.string().required("This Field is Required"),
  });

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const { data } = await Tech_Logit.post("auth/signin", {
        ...values,
        email: values.email.toLowerCase(),
      });
      Cookies.set("token", data.accessToken, {
        secure: true,
        sameSite: "strict",
        expires: 1 / 24,
      }); // 1 hour expiration
      const decodedToken = jwt_decode(data.accessToken);
      dispatch(fetchUser(decodedToken.id));
      toastMessage("success", "Login Successfully");
      setLoginError(false);
      navigate("/");
    } catch (error) {
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleFacebookIconClick = async (social) => {
    const newWindow = window.open(
      `https://techlogit.com/api/auth/${social}`,
      "_blank",
      "width=600,height=600,top=150px,left=350px"
    );

    window.addEventListener("storage", (event) => {
      if (event.key === "authenticated" && event.newValue === "true") {
        newWindow.close();
        window.location.reload();
      }
    });
  };

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
      <div className="flex h-screen">
        {/* <!-- left column container with form --> */}
        <div className="flex items-center justify-center w-full md:w-1/2 mt-20">
          <Formik
            initialValues={initialValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            {(formik) => (
              <Form className="xs:w-9/12 md:w-9/12 lg:w-7/12">
                <h1 className="my-4 text-[30px] md:text-4xl text-center text-[#1b75bc] font-semibold">
                  Hello Again
                </h1>
                <p className="mb-12 text-lg md:text-xl font-normal text-center text-neutral-700 ">
                  Welcome back, you have been missed!
                </p>
                {/* Email input */}
                <div className="mb-6">
                  <label
                    className="text-neutral-700 text-md transition-transform transform-gpu origin-top-left"
                    htmlFor="email"
                  >
                    Email
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    onClick={() => {
                      setLoginError(false);
                    }}
                    className="w-full text-neutral-900 bg-[#F5F7F9] border-neutral-300  placeholder-[#9d9d9d] rounded-lg focus:outline-none focus:ring focus:border-primary focus:placeholder-neutral-400 my-1 px-4 py-2"
                    placeholder="Enter your email"
                  />
                  {/* Display error message */}
                  {formik.touched.email && formik.errors.email && (
                    <div className="text-red-500 mt-2 text-sm flex items-center">
                      <span className="text-red-500  text-sm  mx-2">
                        <FaExclamationCircle />
                      </span>
                      {formik.errors.email}
                    </div>
                  )}
                </div>
                {/* Password input */}
                <div className="mb-6 relative">
                  <label
                    className="text-neutral-700 text-sm transition-transform transform-gpu origin-top-left"
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Field
                      type={showPassword ? "text" : "password"}
                      onClick={() => {
                        setLoginError(false);
                      }}
                      id="password"
                      name="password"
                      className="w-full text-neutral-900 bg-[#F5F7F9] border-neutral-300 placeholder-[#9d9d9d] rounded-lg focus:outline-none focus:ring focus:border-primary focus:placeholder-neutral-400 my-1 px-4 py-2 pr-10"
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

                    {/* Display error message */}
                  </div>
                  {formik.touched.password && formik.errors.password && (
                    <div className="text-red-500 mt-2 text-sm flex items-center">
                      <span className="text-red-500 mx-2">
                        <FaExclamationCircle />
                      </span>
                      {formik.errors.password}
                    </div>
                  )}
                </div>
                {/* <!-- Remember me checkbox --> */}

                <div className="mb-6 flex items-center justify-between">
                  <div className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]">
                    <input
                      className="relative float-left -ml-[1.5rem] mr-[6px] mt-[0.15rem] h-[1.125rem] w-[1.125rem] appearance-none rounded-[0.25rem] border-[0.125rem] border-solid border-neutral-300 outline-none before:pointer-events-none before:absolute before:h-[0.875rem] before:w-[0.875rem] before:scale-0 before:rounded-full before:bg-transparent before:opacity-0 before:shadow-[0px_0px_0px_13px_transparent] before:content-[''] checked:border-primary checked:bg-primary checked:before:opacity-[0.16] checked:after:absolute checked:after:-mt-px checked:after:ml-[0.25rem] checked:after:block checked:after:h-[0.8125rem] checked:after:w-[0.375rem] checked:after:rotate-45 checked:after:border-[0.125rem] checked:after:border-l-0 checked:after:border-t-0 checked:after:border-solid checked:after:border-white checked:after:bg-transparent checked:after:content-[''] hover:cursor-pointer hover:before:opacity-[0.04] hover:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:shadow-none focus:transition-[border-color_0.2s] focus:before:scale-100 focus:before:opacity-[0.12] focus:before:shadow-[0px_0px_0px_13px_rgba(0,0,0,0.6)] focus:before:transition-[box-shadow_0.2s,transform_0.2s] focus:after:absolute focus:after:z-[1] focus:after:block focus:after:h-[0.875rem] focus:after:w-[0.875rem] focus:after:rounded-[0.125rem] focus:after:content-[''] checked:focus:before:scale-100 checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca] checked:focus:before:transition-[box-shadow_0.2s,transform_0.2s] checked:focus:after:-mt-px checked:focus:after:ml-[0.25rem] checked:focus:after:h-[0.8125rem] checked:focus:after:w-[0.375rem] checked:focus:after:rotate-45 checked:focus:after:rounded-none checked:focus:after:border-[0.125rem] checked:focus:after:border-l-0 checked:focus:after:border-t-0 checked:focus:after:border-solid checked:focus:after:border-white checked:focus:after:bg-transparent dark:border-neutral-600 dark:checked:border-primary dark:checked:bg-primary dark:focus:before:shadow-[0px_0px_0px_13px_rgba(255,255,255,0.4)] dark:checked:focus:before:shadow-[0px_0px_0px_13px_#3b71ca]"
                      type="checkbox"
                      value=""
                      id="exampleCheck3"
                      defaultChecked
                    />
                    <label
                      className="inline-block text-base md:text-sm pl-[0.15rem] hover:cursor-pointer"
                      htmlFor="exampleCheck3"
                    >
                      Remember Me
                    </label>
                  </div>

                  {/* <!-- Forgot password link --> */}
                  <Link
                    to={"/forget_password"}
                    className="text-[#1B75BC] text-base md:text-sm transition duration-150 ease-in-out hover:text-primary-600
            focus:text-primary-600 active:text-primary-700 dark:text-primary-400 dark:hover:text-primary-500
            dark:focus:text-primary-500 dark:active:text-primary-600"
                  >
                    Forgot password?
                  </Link>
                </div>

                {loginError ? (
                  <div className="text-red-500 my-5  text-sm flex justify-center items-center">
                    <span className="text-red-500  text-sm  mx-2"></span> Email
                    or Password is invalid
                  </div>
                ) : (
                  ""
                )}

                {/* <!-- Submit button --> */}

                <TERipple rippleColor="light" className="w-full">
                  <button
                    type="submit"
                    className={`inline-block capitalize w-full rounded-full bg-[#1b75bc] px-7 pb-2.5 pt-3
                                                text-sm font-medium  leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca]
                                                transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 
                                                active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]`}
                    disabled={loading} // Disable the button when loading is true
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-t-2 border-r-2 border-b-2 border-white rounded-full animate-spin" />
                        <span className="ml-2">Signing In...</span>
                      </div>
                    ) : (
                      "Sign in"
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

                <p className="mt-10 text-sm text-neutral-700 text-center">
                  Don’t have an account?
                  <Link
                    to={"/signup"}
                    className="text-primary-600 hover:underline focus:underline active:text-primary-700"
                  >
                    Sign Up
                  </Link>
                </p>
              </Form>
            )}
          </Formik>
        </div>
        {/* <!-- Right column container with background--> */}
        <div className="hidden md:flex items-center justify-center w-full md:w-1/2 bg-[#ebeff7]">
          <div className="md:w-12/12">
            <img src={image} className="w-full min-w-full" alt="Phone image" />
          </div>
        </div>
      </div>
    </>
  );
}
