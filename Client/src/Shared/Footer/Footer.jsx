import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { toastMessage } from "../../utils/toasfiy";
import Tech_Logit from "../../API/config";
import {
  faEnvelope,
  faLocationArrow,
  faMapMarkerAlt,
  faPhone,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import "./Footer.css";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

import { getHomeContent } from "../../store/Slices/homeSlice";
import { Link } from "react-router-dom";
import { useState } from "react";
function Footer() {
  const [loading, setLoading] = useState(false);
  const HomeData = useSelector(getHomeContent);
  const ContactData = HomeData?.contact;
  const initialValues = {
    email: "",
  };

  const validationSchema = Yup.object({
    email: Yup.string()
      .email("Invalid email address")
      .required("This Field is  Required"),
  });
  const formik = useFormik({
    initialValues: initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await handleSubmit(values);
      formik.resetForm();
    },
  });

  const handleSubmit = async (values) => {
    setLoading(true); // Start loading
    try {
      const { data } = await Tech_Logit.post("subscripers", values);

      toastMessage("success", " Successfully Subscriped");
    } catch (error) {
      setLoading(false);
      toastMessage(
        "error",
        error.response?.data?.error || "Failed to Subscripe"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-[#000018] text-white relative z-[1]">
      <div className="xs:p-4 sm:p-4 md:px-[2rem] lg:px-[8rem]">
        <div className="grid grid-cols-1 xs:grid-cols-1 md:grid-cols-4 sm:gap-2 md:gap-8 sm:px-0 md:px-4 md:py-8">
          <div className="w-full mb-3 md:mb-0 xs:col-span-1">
            <svg
              className="mb-2"
              width="76"
              height="58"
              viewBox="0 0 76 58"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15.9816 49.902V48.1348H10.6458H8.86719C8.86719 49.3217 8.86719 50.5087 8.86719 51.7089V53.9246C8.86719 54.6104 8.86719 55.2962 8.86719 55.9952C8.86719 56.5887 8.86719 57.1953 8.86719 57.7888H15.9687V55.9952H10.6458V53.8059H15.7869V52.1045H10.6458V49.8888H15.9816V49.902Z"
                fill="url(#paint0_linear_497_5694)"
              />
              <path
                d="M56.9809 12.5652C57.0198 11.1804 56.124 9.98028 54.9556 9.3736C49.8794 6.41935 44.8292 3.42554 39.753 0.484481C38.6495 -0.214515 37.2214 -0.122195 36.1179 0.537235C30.8599 3.62337 25.589 6.7095 20.3311 9.80882C22.2914 9.90114 24.2648 9.82201 26.2381 9.86158C26.7574 9.84839 27.3287 9.94071 27.796 9.63737C31.2234 7.64589 34.5989 5.58847 38.0653 3.66293C43.0765 6.65675 48.1397 9.58462 53.177 12.5389C53.2549 12.6839 53.3977 12.9741 53.4626 13.1324C53.2679 18.5397 53.6314 23.9602 53.3068 29.3675C47.231 29.4598 41.1421 29.4071 35.0663 29.3939C35.1052 25.2131 35.0922 21.0323 35.0663 16.8515C33.6382 16.8384 32.2101 16.8515 30.782 16.8515C30.821 22.4171 30.7041 27.9959 30.8469 33.5483C39.1818 33.5879 47.5036 33.5483 55.8384 33.5747C56.4486 32.757 57.0328 31.847 56.9809 30.7655C57.0068 24.6988 56.9939 18.632 56.9809 12.5652Z"
                fill="url(#paint1_linear_497_5694)"
              />
              <path
                d="M45.8156 35.2357C43.2061 36.6733 40.6356 38.2032 38.065 39.7462C32.859 36.8711 27.7828 33.719 22.6157 30.7516C22.5638 25.6476 22.6157 20.5436 22.6028 15.4265C27.2765 15.466 31.9502 15.5056 36.6239 15.4133C36.7018 19.6336 36.6369 23.8408 36.6499 28.0611C38.091 28.1007 39.532 28.1007 40.9731 28.0743C41.012 23.854 40.9601 19.6468 40.9991 15.4265C42.8166 15.466 44.6342 15.4265 46.4647 15.4265C46.4258 14.0944 46.4777 12.7492 46.3739 11.4171C37.299 11.3512 28.2242 11.4171 19.1494 11.3907C18.9676 12.7492 19.0196 14.1208 19.0196 15.4924C19.0196 20.5832 19.0196 25.6872 19.0196 30.778C18.9936 32.0837 19.7466 33.3366 20.8891 33.9433C26.0302 36.9371 31.1453 39.9573 36.2864 42.9643C37.299 43.5841 38.6233 43.5973 39.6489 43.0038C43.5696 40.709 47.5033 38.4406 51.4111 36.1062C51.7876 35.9084 52.1251 35.6446 52.4886 35.4336C52.5925 35.394 52.7872 35.2885 52.8911 35.2489C50.5283 35.1962 48.1654 35.1039 45.8156 35.2357Z"
                fill="url(#paint2_linear_497_5694)"
              />
              <path
                d="M3.01196 49.7833H0V48.1348C2.73932 48.1348 5.06321 48.1348 7.81551 48.1348V49.7833H4.80355V57.7756H3.01196V49.7833Z"
                fill="url(#paint3_linear_497_5694)"
              />
              <path
                d="M25.7324 56.5619C24.7587 57.5378 23.4994 57.9994 22.1233 57.9994C18.592 57.9994 17.099 55.5332 17.086 53.0273C17.073 50.5083 18.6829 47.9365 22.1233 47.9365C23.4085 47.9365 24.6289 48.4377 25.6156 49.4136L24.4212 50.5874C23.798 49.9676 22.9541 49.6774 22.1233 49.6774C19.8253 49.6774 18.8387 51.4183 18.8516 53.0273C18.8646 54.6231 19.7734 56.2981 22.1233 56.2981C22.9541 56.2981 23.8889 55.9552 24.512 55.3221L25.7324 56.5619Z"
                fill="url(#paint4_linear_497_5694)"
              />
              <path
                d="M33.1965 57.7883V53.8845H28.5357V57.7883H26.7441V48.1475H28.5357V52.2095H33.1965V48.1475H34.9751V57.7883H33.1965Z"
                fill="url(#paint5_linear_497_5694)"
              />
              <path
                d="M38.4547 48.1348V56.1007H43.3361V57.7756H36.6631V48.1348H38.4547Z"
                fill="url(#paint6_linear_497_5694)"
              />
              <path
                d="M53.6447 53.0141C53.6188 55.5068 52.1128 57.9994 48.7763 57.9994C45.4397 57.9994 43.8818 55.5595 43.8818 53.0273C43.8818 50.4951 45.4787 47.9365 48.7633 47.9365C52.0349 47.9365 53.6707 50.4951 53.6447 53.0141ZM45.6475 53.0537C45.6864 54.6363 46.5303 56.3377 48.7633 56.3377C50.9963 56.3377 51.8402 54.6231 51.8661 53.0405C51.8921 51.4183 50.9963 49.5983 48.7633 49.5983C46.5303 49.5983 45.6085 51.4315 45.6475 53.0537Z"
                fill="url(#paint7_linear_497_5694)"
              />
              <path
                d="M62.0054 50.4951C61.3693 49.8753 60.4215 49.5324 59.5907 49.5324C57.5524 49.5324 56.3191 51.1018 56.3191 53.0933C56.3191 54.6759 57.2278 56.3113 59.5907 56.3113C60.3307 56.3113 60.9928 56.1399 61.7328 55.5332V53.8187H59.305V52.1965H63.3686V56.2586C62.4338 57.3532 61.2524 57.9995 59.5907 57.9995C56.0205 57.9995 54.5664 55.6123 54.5664 53.0801C54.5664 50.3633 56.2282 47.8574 59.5907 47.8574C60.863 47.8574 62.1353 48.3586 63.1219 49.3345L62.0054 50.4951Z"
                fill="url(#paint8_linear_497_5694)"
              />
              <path
                d="M71.1975 49.7833H68.1855V48.1348C70.9249 48.1348 73.2488 48.1348 76.0011 48.1348V49.7833H72.9891V57.7756H71.1975V49.7833Z"
                fill="url(#paint9_linear_497_5694)"
              />
              <path
                d="M64.8486 48.1348V50.7593V52.3551V57.7756H66.6272V50.5615V48.9525V48.1348H64.8486Z"
                fill="url(#paint10_linear_497_5694)"
              />
              <defs>
                <linearGradient
                  id="paint0_linear_497_5694"
                  x1="-1.37225"
                  y1="52.9565"
                  x2="33.5368"
                  y2="52.9565"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#1B75BC" />
                  <stop offset="1" stopColor="#00AEEF" />
                </linearGradient>
                <linearGradient
                  id="paint1_linear_497_5694"
                  x1="38.6645"
                  y1="-6.75183"
                  x2="38.6645"
                  y2="33.7731"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#A7A9AC" />
                  <stop offset="0.5722" stopColor="#D1D3D4" />
                  <stop offset="1" stopColor="#939598" />
                </linearGradient>
                <linearGradient
                  id="paint2_linear_497_5694"
                  x1="19.0095"
                  y1="27.4131"
                  x2="52.8844"
                  y2="27.4131"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#1B75BC" />
                  <stop offset="1" stopColor="#00AEEF" />
                </linearGradient>
                <linearGradient
                  id="paint3_linear_497_5694"
                  x1="-1.37234"
                  y1="52.9565"
                  x2="33.5367"
                  y2="52.9565"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#1B75BC" />
                  <stop offset="1" stopColor="#00AEEF" />
                </linearGradient>
                <linearGradient
                  id="paint4_linear_497_5694"
                  x1="-1.37139"
                  y1="52.9698"
                  x2="33.5377"
                  y2="52.9698"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#1B75BC" />
                  <stop offset="1" stopColor="#00AEEF" />
                </linearGradient>
                <linearGradient
                  id="paint5_linear_497_5694"
                  x1="-1.3723"
                  y1="52.9697"
                  x2="33.5368"
                  y2="52.9697"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#1B75BC" />
                  <stop offset="1" stopColor="#00AEEF" />
                </linearGradient>
                <linearGradient
                  id="paint6_linear_497_5694"
                  x1="28.351"
                  y1="52.9565"
                  x2="87.3403"
                  y2="52.9565"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#808285" />
                  <stop offset="1" stopColor="#A7A9AC" />
                </linearGradient>
                <linearGradient
                  id="paint7_linear_497_5694"
                  x1="28.3514"
                  y1="52.9698"
                  x2="87.3408"
                  y2="52.9698"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#808285" />
                  <stop offset="1" stopColor="#A7A9AC" />
                </linearGradient>
                <linearGradient
                  id="paint8_linear_497_5694"
                  x1="28.3513"
                  y1="52.9286"
                  x2="87.3407"
                  y2="52.9286"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#808285" />
                  <stop offset="1" stopColor="#A7A9AC" />
                </linearGradient>
                <linearGradient
                  id="paint9_linear_497_5694"
                  x1="28.3517"
                  y1="52.9565"
                  x2="87.3411"
                  y2="52.9565"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#808285" />
                  <stop offset="1" stopColor="#A7A9AC" />
                </linearGradient>
                <linearGradient
                  id="paint10_linear_497_5694"
                  x1="28.3513"
                  y1="52.9565"
                  x2="87.3407"
                  y2="52.9565"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop stopColor="#808285" />
                  <stop offset="1" stopColor="#A7A9AC" />
                </linearGradient>
              </defs>
            </svg>

            <p className="text-[#BEBEBE] xs:my-3 sm:my-6 text-sm">
              {ContactData?.description?parse(ContactData?.description):''}
            </p>
           <Link to={'/ContactUs'}>
             <button className="xs:mt-2 sm:mt-4 px-6 py-2 bg-main-color rounded-[25px] font-bold">
               Contact Us
             </button>
           </Link >
          </div>

          <div className="flex xs:col-span-2">
            <div className="xs:w-[35%] sm:w-full mb-3 md:mb-0">
              <h4 className="font-bold xs:text-[16px] sm:text-[18px] md:text-[20px] lg:text-[26px] mb-2">
                Quick Links
              </h4>
              <ul className="space-y-2">
                <li className="link">
                  <Link to="/">Home</Link>
                </li>
                <li className="link">
                  <Link to="/how-it-work">About Us</Link>
                </li>
                <li className="link">
                  <Link to="/Services">Services</Link>
                </li>
                <li className="link">
                  <Link to="/OurProjects">Portfolio</Link>
                </li>
              </ul>
            </div>

            <div className="xs:w-[65%] sm:w-full mb-3 md:mb-0">
              <h4 className="font-bold xs:text-[16px] sm:text-[18px] md:text-[20px] lg:text-[26px] mb-2">
                Contact Info
              </h4>
              <ul className="space-y-2">
                <li className="link" onClick={() => window.location.href = `tel:${ContactData?.phone}`}>
                  <FontAwesomeIcon
                    icon={faPhone}
                    className="xs:text-[12px] mr-2 text-main-color"
                  />
                  <span>{ContactData?.phone}</span>
                </li>
                <li className="link" onClick={() => window.location.href = `mailto:${ContactData?.mail}`} >
                  <FontAwesomeIcon
                    icon={faEnvelope}
                    className="xs:text-[12px] mr-2 text-main-color"
                  />

                  <span> {ContactData?.mail} </span>
                </li>
                <li className="link" onClick={() => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ContactData?.location)}`, '_blank')}>
                  <FontAwesomeIcon
                    icon={faMapMarkerAlt}
                    className="xs:text-[12px] mr-2 text-main-color"
                  />
                  <span>{ContactData?.location}</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="w-full md:mb-0 xs:col-span-1">
            <h4 className="font-bold xs:text-[16px] sm:text-[18px] md:text-[20px] lg:text-[26px] mb-2">
              Subscribe
            </h4>
            <p className="text-[#BEBEBE] lg:my-8 text-sm">
              Lorem Ipsum is simply dummy text of the printing and typesetting
              industry.
            </p>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                formik.handleSubmit();
              }}
            >
              <div className="flex mt-3 items-center relative">
                <input
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  name="email"
                  // type="email"
                  onBlur={formik.handleBlur}
                  placeholder="Your email here..."
                  className={`pl-3 p-2 rounded-2xl bg-transparent text-gray-700 mr-1 w-full border-2 focus:border-main-color outline-none pr-8 ${
                    formik.touched.email && formik.errors.email
                      ? "border-red-800"
                      : ""
                  }`}
                />
                <FontAwesomeIcon
                  onClick={(e) => {
                    formik.handleSubmit();
                  }}
                  icon={loading ? faSpinner : faLocationArrow}
                  beatFade
                  className="absolute right-4 text-gray-400 ml-3 cursor-pointer"
                />
              </div>
            </form>
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-800 text-sm">{formik.errors.email}</p>
            )}
          </div>
        </div>
      </div>
      <div className="text-center xs:text-sm sm:text-base bg-main-color p-3">
        Copyright @ 2023 Agency Creative.
      </div>
    </footer>
  );
}

export default Footer;
