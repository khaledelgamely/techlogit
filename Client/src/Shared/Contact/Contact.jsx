import "./style.css";
import {
  faEnvelope,
  faLocationDot,
  faPhoneVolume,
} from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faDiscord,
  faInstagram,
  faTwitter,
} from "@fortawesome/free-brands-svg-icons";
import { useSelector } from "react-redux";
import { getHomeContent } from "../../store/Slices/homeSlice";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import * as Yup from "yup";
import { useFormik } from "formik";
import { toastMessage } from "../../utils/toasfiy";
import Tech_Logit from "../../API/config";
import { styleLastWord } from "../../utils/styleLastWord";

function Contact() {
  const HomeData = useSelector(getHomeContent);
  const ContactData = HomeData?.contact;
  const [loading, setLoading] = useState(false);

  const initialValues = {
    email: "",
    phone: "",
    name: "",
    message: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("This Field is  Required"),
    phone: Yup.string("Invalid phone number").required(
      "This Field is  Required"
    ),
    name: Yup.string("Invalid name address").required(
      "This Field is  Required"
    ),
    message: Yup.string("Invalid message ").required("This Field is  Required"),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true); // Start loading
    try {
      const { data } = await Tech_Logit.post("subscripers/getintouch", values);
      formik.resetForm();
      toastMessage("success", " Successfully Subscriped");
    } catch (error) {
      setLoading(false);
      toastMessage(
        "error",
        error.response?.data?.error || "Failed to Add Get In Touch"
      );
    } finally {
      setLoading(false);
    }
  };
  if (ContactData === undefined) {
    return (
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
    )
  } else
    return (
      <div className=" min-h-[600px] bg-background-contact bg-cover  bg-center px-6 py-10  ">
        {/* // header of contact */}
        <div className="w-full max-w-screen-xl mx-auto ">
          <div className="mx-auto max-w-2xl text-center mb-6">
            <h1 className="text-[28px] lg:text-[40px] font-semibold text-center my-7 mt-16">
              {styleLastWord('Get in Touch')}
            </h1>
          </div>
          {/* // body of contact */}
          <div className="grid grid-cols-6 gap-3">
            {/* // card Contact Information */}
            <div className="sm:mx-14 md:mx-auto bg-card-contact min-h-[500px] md:max-h-[550px] lg:max-h-[550px] bg-cover bg-center col-span-6 md:col-span-3 xl:w-4/5 relative rounded-[30px] p-8">
              <h2 className="xs:text-[18px] md:text-[26px] mb-4 text-black font-bold tracking-wider">
                {ContactData?.smallTitle}
              </h2>
              <p className="xs:text-[14px] md:text-[16px] text-gray-500 mb-10">
                {/* {ContactData?.description} */}

                {ContactData?.description ? parse(ContactData?.description) : ''}
                {parse(ContactData?.description)}

              </p>
              <div className="">
                <ul className="list-none mb-14">
                  <li className="cursor-pointer flex items-center space-x-3 text-gray-700 mb-1" onClick={() => window.location.href = `tel:${ContactData?.phone}`}>
                    <FontAwesomeIcon
                      icon={faPhoneVolume}
                      className="text-main-color text-xl"
                    />
                    <span className="info">{ContactData?.phone}</span>
                  </li>
                  <li className="cursor-pointer flex items-center space-x-3 text-gray-700 my-8" onClick={() => window.location.href = `mailto:${ContactData?.mail}`} >
                    <FontAwesomeIcon
                      icon={faEnvelope}
                      className="text-main-color text-xl"
                    />
                    <span className="info">{ContactData?.mail}</span>
                  </li>
                  <li className="cursor-pointer lastli flex items-center space-x-3 text-gray-700 mb-2" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ContactData?.location)}`, '_blank')}>
                    <FontAwesomeIcon
                      icon={faLocationDot}
                      className="text-main-color text-xl"
                    />
                    <span className="info">{ContactData?.location}</span>
                  </li>
                </ul>
                <div className="social flex justify-start space-x-4">
                  <div
                    className="w-10 h-10 rounded-full bg-main-color flex items-center justify-center"
                    style={{ animation: "bounce 2s infinite" }}
                  >
                    <a
                      to={'/' + ContactData?.linkedin}
                      href={ContactData?.linkedin.startsWith('http') ? ContactData?.linkedin : `https://linkedin.com/${ContactData?.linkedin}`}
                      className="text-white text-xl "
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <FontAwesomeIcon icon={faTwitter} />
                    </a>
                  </div>
                  <div
                    className="w-10 h-10 rounded-full bg-main-color flex items-center justify-center"
                    style={{ animation: "bounce 2s infinite" }}
                  >
                    <a rel="noopener noreferrer"
                      href={ContactData?.insta.startsWith('http') ? ContactData?.insta : `https://instagram.com/${ContactData?.insta}`}
                      className="text-white text-xl "
                      target="_blank">
                      <FontAwesomeIcon icon={faInstagram} />
                    </a>
                  </div>

                  <div
                    className="w-10 h-10 rounded-full bg-main-color flex items-center justify-center"
                    style={{ animation: "bounce 2s infinite" }}
                  >
                    <a
                      href={ContactData?.discord.startsWith('http') ? ContactData?.discord : `https://discord.com/${ContactData?.discord}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-white text-xl"
                    >
                      <FontAwesomeIcon icon={faDiscord} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
            {/* // card Contact Information */}
            <form
              action="#"
              method="POST"
              onSubmit={(e) => {
                e.preventDefault();
              }}
              className=" sm:mx-auto mt-5 min-h-[500px] w-[100%] col-span-6  md:col-span-3  lg:col-span-3 "
            >
              <div className="grid grid-cols-1 gap-x-6 gap-y-1 sm:grid-cols-2">
                <div className="mt-3">
                  <label
                    htmlFor="phone-number"
                    className=" font-[400] text-[16px]  leading-6 text-gray-900  font-body"
                  >
                    Full Name
                  </label>
                  <span className="text-red-500 ms-2 font-medium">*</span>
                  <div>
                    <input
                      type="text"
                      name="name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      id="first-name"
                      autoComplete="given-name"
                      className="ContactInput"
                      placeholder="Name"
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-red-800 text-sm">{formik.errors.name}</p>
                    )}
                  </div>
                </div>

                <div className="mt-3">
                  <label
                    htmlFor="phone-number"
                    className=" font-[400] text-[16px] w   text-gray-900  font-body"
                  >
                    Phone number
                  </label>

                  <div className="relative">
                    <input
                      type="tel"
                      name="phone"
                      id="phone-number"
                      value={formik.values.phone}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="tel"
                      className="ContactInput"
                      placeholder="+(---)-- --- ----"
                    />
                    {formik.touched.phone && formik.errors.phone && (
                      <p className="text-red-800 text-sm">
                        {formik.errors.phone}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-3 sm:col-span-2  pe-0">
                  <label
                    htmlFor="phone-number"
                    className=" font-[400] text-[16px]  leading-6 text-gray-900  font-body"
                  >
                    Email
                  </label>
                  <span className="text-red-500 ms-2 font-medium">*</span>
                  <div>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      autoComplete="email"
                      className="ContactInput"
                      placeholder=" Enter email"
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-red-800 text-sm">
                        {formik.errors.email}
                      </p>
                    )}
                  </div>
                </div>

                <div className="sm:col-span-2 mt-3">
                  <label
                    htmlFor="message"
                    className=" font-[400] text-[16px]  leading-6 text-gray-900  font-body"
                  >
                    Message
                  </label>
                  <span className="text-red-500 ms-2 font-medium">*</span>
                  <div>
                    <textarea
                      name="message"
                      id="message"
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      value={formik.values.message}
                      rows={8}
                      className="ContactInput lg:w-full resize-none"
                      defaultValue={""}
                      placeholder=" Enter your question or message here..."
                    />
                    {formik.touched.message && formik.errors.message && (
                      <p className="text-red-800 text-sm">
                        {formik.errors.message}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="mt-10">
                <button
                  onClick={(e) => {
                    formik.handleSubmit();
                  }}
                  type="submit"
                  className="block rounded-3xl ms-auto  bg-icon px-3.5 py-2.5 text-center text-sm  text-white shadow-sm hover:bg-sky-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Send Message
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
}

export default Contact;
