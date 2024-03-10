/* eslint-disable react/no-unknown-property */
import { useEffect } from "react";
import { useState } from "react";
import { useSelector } from "react-redux";
import { Tab, initTE } from "tw-elements";
import "./profile.css";
import defaultProfilePicture from "../../assets/download.png"
import OrderPage from "../order page/OrderPage";
import SEO from "../../utils/Seo.jsx";
function Profile() {
  const { user } = useSelector((state) => state.user);
  useEffect(() => {
    initTE({ Tab });
  }, []);
  const [imageSrc, setImageSrc] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      setImageSrc(e.target.result);
    };
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
      <div className="flex mt-[4rem]">
        <ul
          className="mr-4 flex list-none flex-col flex-wrap pl-0 h-fit "
          role="tablist"
          data-te-nav-ref
        >
          <li role="presentation" className="flex-grow text-center">
            <a
              href="#tabs-account"
              className="link-tab flex"
              data-te-toggle="pill"
              data-te-target="#tabs-account"
              data-te-nav-active
              role="tab"
              aria-controls="tabs-account"
              aria-selected="true"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="9"
                  r="3"
                  stroke="#1B75BC"
                  strokeWidth="1.5"
                />
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#1B75BC"
                  strokeWidth="1.5"
                />
                <path
                  d="M17.9696 20C17.8105 17.1085 16.9252 15 12.0004 15C7.0757 15 6.1904 17.1085 6.03125 20"
                  stroke="#1B75BC"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
              <span className="ml-2">Account Details</span>
            </a>
          </li>
          <li role="presentation" className="flex-grow text-center">
            <a
              href="#tabs-payment"
              className="link-tab"
              data-te-toggle="pill"
              data-te-target="#tabs-payment"
              role="tab"
              aria-controls="tabs-payment"
              aria-selected="false"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="#737791"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 17V17.5V18"
                  stroke="#737791"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M12 6V6.5V7"
                  stroke="#737791"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M15 9.5C15 8.11929 13.6569 7 12 7C10.3431 7 9 8.11929 9 9.5C9 10.8807 10.3431 12 12 12C13.6569 12 15 13.1193 15 14.5C15 15.8807 13.6569 17 12 17C10.3431 17 9 15.8807 9 14.5"
                  stroke="#737791"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>

              <span className="ml-2">Payment Method</span>
            </a>
          </li>
          <li role="presentation" className="flex-grow text-center">
            <a
              href="#tabs-order"
              className="link-tab"
              data-te-toggle="pill"
              data-te-target="#tabs-order"
              role="tab"
              aria-controls="tabs-order"
              aria-selected="false"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M16 4C18.175 4.01211 19.3529 4.10856 20.1213 4.87694C21 5.75562 21 7.16983 21 9.99826V15.9983C21 18.8267 21 20.2409 20.1213 21.1196C19.2426 21.9983 17.8284 21.9983 15 21.9983H9C6.17157 21.9983 4.75736 21.9983 3.87868 21.1196C3 20.2409 3 18.8267 3 15.9983V9.99826C3 7.16983 3 5.75562 3.87868 4.87694C4.64706 4.10856 5.82497 4.01211 8 4"
                  stroke="#737791"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 13.4L10.7143 15L15 11"
                  stroke="#737791"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M8 3.5C8 2.67157 8.67157 2 9.5 2H14.5C15.3284 2 16 2.67157 16 3.5V4.5C16 5.32843 15.3284 6 14.5 6H9.5C8.67157 6 8 5.32843 8 4.5V3.5Z"
                  stroke="#737791"
                  strokeWidth="1.5"
                />
              </svg>

              <span className="ml-2">Orders</span>
            </a>
          </li>
        </ul>

        <div className="p-[2rem] flex-1 bg-[#FAFBFC]">
          <div
            className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="tabs-account"
            role="tabpanel"
            aria-labelledby="tabs-account-tab03"
            data-te-tab-active
          >
            <h2 className="text-[#091E42] text-[26px] font-bold">
              Account Details
            </h2>
            <p className="text-[#737791] text-[14px] font-normal">
              Manage your profile
            </p>
            <div className="bg-white p-2 rounded-md mt-3">
              <div className="flex items-center">
                <label
                  htmlFor="profilePhoto"
                  className="cursor-pointer relative w-fit block"
                >

                  <img
                    src={
                      imageSrc
                        ? imageSrc
                        : defaultProfilePicture
                    }
                    alt="Profile picture"
                    className="w-20 h-20 rounded-full"

                  />
                  <div
                    sx={{
                      position: "relative",
                    }}
                  >
                    <img
                      src={
                        imageSrc
                          ? imageSrc
                          : {defaultProfilePicture}
                      }
                      alt="Profile picture"
                      className="w-20 h-20 rounded-full"
                    />
                    <svg
                      width="30"
                      height="30"
                      viewBox="0 0 30 30"
                      className="absolute right-0 bottom-0"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle
                        cx="15"
                        cy="15"
                        r="13.25"
                        fill="#1B75BC"
                        stroke="white"
                        strokeWidth="2.5"
                      />
                      <g clipPath="url(#clip0_3118_1884)">
                        <path
                          d="M18.12 10.0905L17.3493 9.09119C17.1957 8.89363 16.9993 8.7336 16.7747 8.62322C16.5502 8.51284 16.3035 8.45501 16.0533 8.4541H13.9456C13.6954 8.45501 13.4487 8.51284 13.2242 8.62322C12.9996 8.7336 12.8032 8.89363 12.6496 9.09119L11.8789 10.0905H18.12Z"
                          fill="white"
                        />
                        <path
                          d="M14.9982 18.2718C16.2032 18.2718 17.18 17.295 17.18 16.09C17.18 14.885 16.2032 13.9082 14.9982 13.9082C13.7932 13.9082 12.8164 14.885 12.8164 16.09C12.8164 17.295 13.7932 18.2718 14.9982 18.2718Z"
                          fill="white"
                        />
                        <path
                          d="M18.8168 11.1816H11.1804C10.4573 11.1825 9.76416 11.4701 9.25288 11.9814C8.74161 12.4927 8.45399 13.1859 8.45312 13.9089V18.818C8.45399 19.5411 8.74161 20.2342 9.25288 20.7455C9.76416 21.2568 10.4573 21.5444 11.1804 21.5453H18.8168C19.5398 21.5444 20.233 21.2568 20.7443 20.7455C21.2556 20.2342 21.5432 19.5411 21.544 18.818V13.9089C21.5432 13.1859 21.2556 12.4927 20.7443 11.9814C20.233 11.4701 19.5398 11.1825 18.8168 11.1816ZM14.9986 19.3635C14.3513 19.3635 13.7185 19.1715 13.1803 18.8119C12.6422 18.4523 12.2227 17.9412 11.975 17.3432C11.7273 16.7451 11.6625 16.0871 11.7887 15.4523C11.915 14.8174 12.2267 14.2343 12.6844 13.7766C13.1421 13.3189 13.7253 13.0072 14.3601 12.8809C14.9949 12.7546 15.653 12.8194 16.251 13.0671C16.849 13.3148 17.3601 13.7343 17.7198 14.2725C18.0794 14.8107 18.2713 15.4434 18.2713 16.0907C18.2704 16.9584 17.9254 17.7904 17.3118 18.4039C16.6982 19.0175 15.8663 19.3626 14.9986 19.3635Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_3118_1884">
                          <rect
                            width="13.0909"
                            height="13.0909"
                            fill="white"
                            transform="translate(8.45312 8.4541)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                </label>
                <div className="ml-3">
                  <h3>{`${user.firstName} ${user.lastName}`}</h3>
                  <p className="text-[#737791] text-[14px] font-normal">
                    {user.email}
                  </p>
                </div>
              </div>
              <div className="mt-[3rem]">
                <form action="">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="col-span-full sm:col-span-1">
                      <h3>Basic Information</h3>
                      <div className="my-4">
                        <label
                          htmlFor="firstName"
                          className="text-[#737791] text-[14px] font-normal mb-2"
                        >
                          FirstName
                        </label>
                        <input
                          type="text"
                          id="firstName"
                          name="firstName"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="my-4">
                        <label
                          htmlFor="lastName"
                          className="text-[#737791] text-[14px] font-normal mb-2"
                        >
                          LastName
                        </label>
                        <input
                          type="text"
                          id="lastName"
                          name="lastName"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="my-4">
                        <label
                          htmlFor="email"
                          className="text-[#737791] text-[14px] font-normal mb-2"
                        >
                          Email
                        </label>
                        <input
                          type="text"
                          id="email"
                          name="email"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="my-4">
                        <label
                          htmlFor="phoneNumber"
                          className="text-[#737791] text-[14px] font-normal mb-2"
                        >
                          Phone Number
                        </label>
                        <input
                          type="text"
                          id="phoneNumber"
                          name="phoneNumber"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-span-full sm:col-span-1">
                      <h3>Password</h3>
                      <div className="my-4">
                        <label
                          htmlFor="oldPassword"
                          className="text-[#737791] text-[14px] font-normal mb-2"
                        >
                          Old Password
                        </label>
                        <input
                          type="password"
                          id="oldPassword"
                          name="oldPassword"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="my-4">
                        <label
                          htmlFor="newPassword"
                          className="text-[#737791] text-[14px] font-normal mb-2"
                        >
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                      <div className="my-4">
                        <label
                          htmlFor="confirmPassword"
                          className="text-[#737791] text-[14px] font-normal mb-2"
                        >
                          Confirm Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                          required
                        />
                      </div>
                    </div>
                    <div className="col-span-full sm:col-span-2">
                      <h3>Billing Address</h3>
                      <div className="grid grid-cols-12 gap-4">
                        <div className="my-4 col-span-12 sm:col-span-6">
                          <label
                            htmlFor="address"
                            className="text-[#737791] text-[14px] font-normal mb-2"
                          >
                            Address
                          </label>
                          <input
                            type="text"
                            id="address"
                            name="address"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="my-4 col-span-12 sm:col-span-3">
                          <label
                            htmlFor="city"
                            className="text-[#737791] text-[14px] font-normal mb-2"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="my-4 col-span-12 sm:col-span-3">
                          <label
                            htmlFor="state"
                            className="text-[#737791] text-[14px] font-normal mb-2"
                          >
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="my-4 col-span-12 sm:col-span-3">
                          <label
                            htmlFor="zipCode"
                            className="text-[#737791] text-[14px] font-normal mb-2"
                          >
                            Zip Code
                          </label>
                          <input
                            type="text"
                            id="zipCode"
                            name="zipCode"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="my-4 col-span-12 sm:col-span-3">
                          <label
                            htmlFor="country"
                            className="text-[#737791] text-[14px] font-normal mb-2"
                          >
                            Country
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    <div className="col-span-full sm:col-span-2">
                      <h3>Two-Factor Authentication</h3>
                      <p className="text-[#737791] text-[14px]">
                        Enable Two-Factor Authentication
                      </p>
                      <div className="grid grid-cols-12 gap-4">
                        <div className="my-4 col-span-12 sm:col-span-6">
                          <label
                            htmlFor="deliveryPreference"
                            className="text-[#737791] text-[14px] font-normal mb-2"
                          >
                            Delivery Preference
                          </label>
                          <input
                            type="text"
                            id="deliveryPreference"
                            name="deliveryPreference"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="my-4 col-span-12 sm:col-span-6">
                          <label
                            htmlFor="email"
                            className="text-[#737791] text-[14px] font-normal mb-2"
                          >
                            Email
                          </label>
                          <input
                            type="text"
                            id="email"
                            name="email"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                        <div className="my-4 col-span-12 sm:col-span-6">
                          <label
                            htmlFor="phoneNumber"
                            className="text-[#737791] text-[14px] font-normal mb-2"
                          >
                            Phone Number
                          </label>
                          <input
                            type="text"
                            id="phoneNumber"
                            name="phoneNumber"
                            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:border-blue-500"
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <button className="mainBtn px-4">Update</button>
                </form>
              </div>
            </div>
          </div>
          <div
            className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block"
            id="tabs-payment"
            role="tabpanel"
            aria-labelledby="tabs-payment-tab03"
          >
            Tab 2 content
          </div>
          <div
            className="hidden opacity-0 transition-opacity duration-150 ease-linear data-[te-tab-active]:block "
            id="tabs-order"
            role="tabpanel"
            aria-labelledby="tabs-order-tab03"
          >
            <OrderPage />
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
