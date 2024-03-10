/* eslint-disable react/prop-types */
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Dropdown, Ripple, initTE } from "tw-elements";
import Tech_Logit, { globalUrl } from "../../../API/config";
import percentageImg from "../../../assets/Group 36847.png";
import thankImg from "../../../assets/Message received.png";
import { fetchSingleServices } from "../../../store/Slices/servicesSlice.jsx";
import { fetchUser } from "../../../store/Slices/userSlice";
import { toastMessage } from "../../../utils/toasfiy.jsx";
import "../../thankYou/thankYou.css";
import AuthPopup from "./../../../Shared/AuthPopup/AuthPopup";
import "./productDescription.css";
initTE({ Dropdown, Ripple });

const ProductDescription = () => {
  const [selectedOptions, setSelectedOptions] = useState({});
  const [isLoading, setIsLoading] = useState(false); // Add loading state
  const [laterIsLoading, setLaterIsLoading] = useState(false); // Add loading state
  const singleService = useSelector((state) => state.services.singleService);
  const user = useSelector((state) => state.user?.user);
  const [variationError, setVariationError] = useState(null);
  const [unPaidOrders, setUnPaidOrders] = useState([]);
  const [mixedPrices, setMixedPrices] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showAuthPopup, setShowAuthPopup] = useState(false); // State to control the visibility of the popup
  const navigate = useNavigate();
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  function areSetsEqual(setA, setB) {
    if (setA.size !== setB.size) {
      return false;
    }
    for (const elem of setA) {
      if (!setB.has(elem)) {
        return false;
      }
    }
    return true;
  }

  const splitPaidAndUnpaid = () => {
    const unpaid = [];

    user.orders?.forEach((order) => {
      if (order.payment === "unpaid") {
        unpaid.push(order);
      }
    });
    setUnPaidOrders(unpaid);
  };

  useEffect(() => {
    splitPaidAndUnpaid();
  }, []);

  const paymentCall = (status) => {
    if (isLoading) return; // Prevent multiple clicks while loading
    if (laterIsLoading) return; // Prevent multiple clicks while loading

    // Check if this service is already ordered before
    const orderExisted = unPaidOrders.find(
      (order) => order?.service?._id == singleService?._id
    );

    // if two variants no selected
    if (
      (singleService.dropDownnNames.length == 1 &&
        Object.keys(selectedOptions).length == 1) ||
      (singleService.dropDownnNames.length == 2 &&
        Object.keys(selectedOptions).length == 2) ||
      singleService.dropDownnNames.length == 0
    ) {
      if (!orderExisted) {
        const hasVariations = singleService?.mixedPrices.some((item) => {
          const itemVariations = new Set(item.variationsId);
          const selectedOptionsValues = new Set(Object.values(selectedOptions));
          return areSetsEqual(itemVariations, selectedOptionsValues);
        });

        if (!hasVariations) {
          if (user.id === "") {
            // User is not logged in, show the authentication popup
            setShowAuthPopup(true);
            return;
          }
          (async () => {
            try {
              setVariationError(null);
              if (status === "payNow") {
                setIsLoading(true);
                const response = await Tech_Logit.post(`/orders`, {
                  totalPrice: mixedPrices
                    ? mixedPrices -
                    (mixedPrices * singleService?.discount) / 100
                    : singleService.defaultPrice -
                    (singleService.defaultPrice * singleService?.discount) /
                    100,
                  service: singleService._id,
                  title: singleService.defaultName,
                  chossen: [selectedOptions],
                  originPrice: mixedPrices ? mixedPrices : singleService.defaultPrice,
                  userInfo: { firstName: user?.firstName, lastName: user?.lastName, email: user?.email, phone: user?.phone },
                });
                dispatch(fetchUser(user._id));
                setTimeout(() => {
                  setIsLoading(false);
                  navigate(`/payment/${response.data.order._id}`);
                }, 1200);
              } else if (status === "payLater") {
                setLaterIsLoading(true);
                const response = await Tech_Logit.post(`/orders`, {
                  totalPrice: mixedPrices
                    ? mixedPrices -
                    (mixedPrices * singleService?.discount) / 100
                    : singleService.defaultPrice -
                    (singleService.defaultPrice * singleService?.discount) /
                    100,
                  service: singleService._id,
                  title: singleService.defaultName,
                  originPrice: mixedPrices ? mixedPrices : singleService.defaultPrice,
                  userInfo: { firstName: user?.firstName, lastName: user?.lastName, email: user?.email, phone: user?.phone },
                });
                dispatch(fetchUser(user._id));
                setTimeout(() => {
                  setLaterIsLoading(false);
                  navigate(`/thank_you/${response.data.order._id}`);
                }, 1200);
              }
            } catch (error) {
              setIsLoading(false);
              setLaterIsLoading(false);
            }
          })();
          return;
        }

        singleService?.mixedPrices.forEach((item) => {
          const itemVariations = new Set(item.variationsId);
          const selectedOptionsValues = new Set(Object.values(selectedOptions));
          const areEqualSets = areSetsEqual(
            itemVariations,
            selectedOptionsValues
          );

          if (areEqualSets) {
            if (user.id === "") {
              // User is not logged in, show the authentication popup
              setShowAuthPopup(true);
              return;
            }
            (async () => {
              try {
                setVariationError(null);
                if (status === "payNow") {
                  setIsLoading(true);
                  const response = await Tech_Logit.post(`/orders`, {
                    totalPrice:
                      item.price - (item.price * singleService?.discount) / 100,
                    service: singleService._id,
                    title: singleService.defaultName,
                    chossen: [selectedOptions],
                  });
                  dispatch(fetchUser(user._id));
                  setIsLoading(false);
                  navigate(`/payment/${response.data.order._id}`);
                } else if (status === "payLater") {
                  setLaterIsLoading(true);
                  const response = await Tech_Logit.post(`/orders`, {
                    totalPrice:
                      item.price - (item.price * singleService?.discount) / 100,
                    service: singleService._id,
                    title: singleService.defaultName,
                    chossen: [selectedOptions],
                  });
                  dispatch(fetchUser(user._id));
                  setTimeout(() => {
                    setLaterIsLoading(false);
                    navigate(`/thank_you/${response.data.order._id}`);
                  }, 1200);
                }
              } catch (error) {
                setIsLoading(false);
                setLaterIsLoading(false);
              }
            })();
          }
        });
      } else {
        toastMessage("error", "You have already requested this service before");
      }
    } else {
      toastMessage("error", "You must select all the variants");
    }
  };

  const changePrice = () => {
    singleService.mixedPrices.forEach((item) => {
      const itemVariations = new Set(item.variationsId);
      const selectedOptionsValues = new Set(
        Object.values(selectedOptions).map((option) => option._id)
      );
      // Check if the sets are equal
      const areEqualSets = areSetsEqual(itemVariations, selectedOptionsValues);
      if (areEqualSets) {
        setMixedPrices(item.price);
        return; // Exit the loop once a match is found
      }
    });
  };

  // dynamic dropdown
  function DropdownItem({ variation }) {
    const [isOpen, setIsOpen] = useState(false);
    const toggleDropdown = () => {
      setIsOpen(!isOpen);
    };
    const handleOptionSelect = (option, _id) => {
      setVariationError(null);
      setSelectedOptions((prevSelectedOptions) => ({
        ...prevSelectedOptions,
        [variation._id]: {
          title: option,
          originPrice: mixedPrices ? mixedPrices : singleService.defaultPrice,
          _id: _id,
        }, // Use the variation's _id as the key
      }));
      setIsOpen(false);
    };
    useEffect(() => {
      changePrice();

    }, [selectedOptions]);

    return (
      <div className="relative product-dropdown">
        <div
          className="cursor-pointer flex items-center justify-between font-medium whitespace-nowrap bg-transparent px-6 pb-2 pt-2.5 leading-normal border-2 rounded-3xl border-[#1B75BC]"
          type="button"
          onClick={() => {
            toggleDropdown();
          }}
          aria-expanded={isOpen}
        >
          {selectedOptions[variation._id] !== undefined
            ? singleService.variations.find(
              (item) => item._id === selectedOptions[variation._id]._id
            )?.title
            : variation?.title}
          <span className="ml-2 w-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="#1B75BC"
              className={`h-5 w-5 ${isOpen ? "rotate-180" : ""}`}
            >
              <path
                fillRule="evenodd"
                d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </span>
        </div>
        {isOpen && (
          <ul className="absolute z-[1000] w-full float-left m-0 min-w-max list-none overflow-hidden rounded-t-none rounded-lg border-none bg-white bg-clip-padding text-left text-base shadow-lg dark:bg-neutral-700 [&[data-te-dropdown-show]]:block">
            <li className="block text-center  border-b-2 font-bold m-0  w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm  text-neutral-700 bg-blue-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 ">
              {variation?.title}
            </li>
            {singleService?.variations
              ?.filter((item) => item.dropDownnNameId == variation._id)
              .map((item, index) => (
                <li
                  onClick={() =>
                    handleOptionSelect(
                      variation?.title ? { [variation.title]: item.title } : {},
                      item._id
                    )
                  }
                  key={item._id}
                  className="block cursor-pointer m-0 w-full whitespace-nowrap bg-transparent px-4 py-2 text-sm font-normal text-neutral-700 hover:bg-neutral-100 active:text-neutral-800 active:no-underline disabled:pointer-events-none disabled:bg-transparent disabled:text-neutral-400 dark:text-neutral-200 dark:hover:bg-neutral-600"
                >
                  {item.title}
                </li>
              ))}
          </ul>
        )}
      </div>
    );
  }
  // dynamic dropdown end

  useEffect(() => {
    dispatch(fetchSingleServices(id));
  }, [dispatch, id]);

  useEffect(() => { }, [showAuthPopup]);
  return (
    <div>
      {!singleService._id ? (
        <div className="product-header mt-40 container h-[70%]">
          <div
            role="status"
            className=" h-full space-y-8 animate-pulse md:space-y-0 md:space-x-8 md:flex md:items-center"
          >
            <div className="flex items-center justify-center w-[90%] h-[350px] bg-gray-300 rounded dark:bg-gray-700">
              <svg
                className="w-10 h-10 text-gray-200 dark:text-gray-600"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 18"
              >
                <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
              </svg>
            </div>
            <div className="w-full">
              <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
              <div className="h-2.5 mt-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>

              <div className="h-2 my-7 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
              <div className="h-2 my-7 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
              <div className="h-2 my-7 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
              <div className="h-2 my-7 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>
              <div className="h-2 my-7 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[480px] mb-2.5"></div>

              <div className="mt-5 h-2.5 inline-block bg-gray-200 rounded-full dark:bg-gray-700 w-48 "></div>
              <div className="mt-5 h-2.5 inline-block ms-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>
              <div className="mt-5 h-2.5 inline-block bg-gray-200 rounded-full dark:bg-gray-700 w-48 "></div>
              <div className="mt-5 h-2.5 inline-block ms-5 bg-gray-200 rounded-full dark:bg-gray-700 w-48"></div>

              <div className="h-2  m-5 bg-gray-200 rounded-full dark:bg-gray-700 max-w-[360px]"></div>
            </div>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : (
        <div className="pt-10">
          <div className="product-description pt-20 pb-7 ">
            <div className="xs:w-[95%] md:w-[80%] m-auto grid grid-cols-12 gap-7">
              <div className="min-h-[400px] max-h-[450px] xs:col-span-12  lg:col-span-6 flex justify-center items-center  ">
                {!singleService?.defaultLargeImage ? (
                  <div
                    role="status"
                    className="max-w-sm p-4 border border-gray-200  shadow animate-pulse md:p-6 dark:border-gray-700 proDescMainPhoto rounded-lg"
                  >
                    <div className="flex items-center justify-center h-48 mb-4 bg-gray-300 rounded dark:bg-gray-700">
                      <svg
                        className="w-10 h-10 text-gray-200 dark:text-gray-600"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 16 20"
                      >
                        <path d="M14.066 0H7v5a2 2 0 0 1-2 2H0v11a1.97 1.97 0 0 0 1.934 2h12.132A1.97 1.97 0 0 0 16 18V2a1.97 1.97 0 0 0-1.934-2ZM10.5 6a1.5 1.5 0 1 1 0 2.999A1.5 1.5 0 0 1 10.5 6Zm2.221 10.515a1 1 0 0 1-.858.485h-8a1 1 0 0 1-.9-1.43L5.6 10.039a.978.978 0 0 1 .936-.57 1 1 0 0 1 .9.632l1.181 2.981.541-1a.945.945 0 0 1 .883-.522 1 1 0 0 1 .879.529l1.832 3.438a1 1 0 0 1-.031.988Z" />
                        <path d="M5 5V.13a2.96 2.96 0 0 0-1.293.749L.879 3.707A2.98 2.98 0 0 0 .13 5H5Z" />
                      </svg>
                    </div>
                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-48 mb-4"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700 mb-2.5"></div>
                    <div className="h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                    <div className="flex items-center mt-4 space-x-3">
                      <svg
                        className="w-10 h-10 text-gray-200 dark:text-gray-700"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M10 0a10 10 0 1 0 10 10A10.011 10.011 0 0 0 10 0Zm0 5a3 3 0 1 1 0 6 3 3 0 0 1 0-6Zm0 13a8.949 8.949 0 0 1-4.951-1.488A3.987 3.987 0 0 1 9 13h2a3.987 3.987 0 0 1 3.951 3.512A8.949 8.949 0 0 1 10 18Z" />
                      </svg>
                      <div>
                        <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                        <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                      </div>
                    </div>
                    <span className="sr-only">Loading...</span>
                  </div>
                ) : (
                  <img
                    src={globalUrl + singleService?.defaultLargeImage}
                    alt=""
                    className="proDescMainPhoto rounded-lg"
                  />
                )}
              </div>
              <div className=" xs:col-span-12 lg:col-span-6 flex flex-col justify-center gap-5 items-start break-words">
                <h1 className="text-[26px] md:text-4xl max-w-full ms-5">
                  {singleService.defaultName}
                </h1>
                <p className="text-[#1B75BC] font-semibold text-2xl max-w-full ms-5">
                  {mixedPrices
                    ? mixedPrices + "$"
                    : singleService.defaultPrice + " $"}
                </p>
                <p className="text-[#7a7a7a] text-sm font-[300] leading-[25.6px] max-w-full ms-5">
                  {parse(singleService?.defaultTopDescription)}
                </p>
                <div className="w-11/12 flex justify-between  mx-auto">
                  {singleService?.dropDownnNames?.map((variation, index) => {
                    return <DropdownItem key={index} variation={variation} />;
                  })}
                  {variationError ? (
                    <p className="text-red-500 text-xs  capitalize ms-3 mt-4 ">
                      {variationError}
                    </p>
                  ) : null}
                  {/* {selectedOptions} */}
                </div>
                <div className=" w-11/12 flex justify-between mx-auto">
                  {isLoading ? ( // Display loading indicator if isRedirecting is true
                    <div className="cursor-pointer h-[45px] payNowBtn relative overflow-hidden xs:text-[14px] sm:text-[17px]">
                      Loading...
                    </div>
                  ) : (
                    <div
                      onClick={() => paymentCall("payNow")}
                      className="cursor-pointer h-[45px] payNowBtn relative overflow-hidden xs:text-[14px] sm:text-[17px]"
                    >
                      Pay Now{" "}
                      {/*<span className="line-through text-sm px-1">
                        {" "}
                        {mixedPrices
                          ? mixedPrices + "$"
                          : singleService.defaultPrice + " $"}
                      </span>{" "}
                      <span className="text-sm">
                        {mixedPrices
                          ? mixedPrices -
                            (mixedPrices * singleService?.discount) / 100 +
                            "$"
                          : singleService.defaultPrice -
                            (singleService.defaultPrice *
                              singleService?.discount) /
                              100 +
                            " $"}
                            </span>*/}
                      <div
                        className="absolute top-[8px] right-[-25px] md:right-[-5px] w-100 xs:h-[42%] md:h-[38%] -mr-50 mt-15 
                      transform rotate-45 bg-red-500 xs:text-[8px]
                      whitespace-no-wrap xs:pl-[2rem] xs:pr-[1.5rem] sm:pl-[2.7rem] sm:pr-[1.8rem] md:pl-[1.5rem] md:pr-[0.7rem]"
                      >
                        {singleService?.discount}% Discount
                      </div>
                    </div>
                  )}

                  {laterIsLoading ? ( // Display loading indicator if isRedirecting is true
                    <div className="h-[45px] text-center w-6/12 ml-5 py-3 bg-[#afd6f3] rounded-[3rem] text-[#1B75BC] font-semibold px-4 xs:text-[14px] sm:text-[17px]">
                      Loading...
                    </div>
                  ) : (
                    <button
                      onClick={() => paymentCall("payLater")}
                      className=" h-[45px]  w-6/12 ml-5 py-3 bg-[#afd6f3] rounded-[3rem] text-[#1B75BC] font-semibold px-4 xs:text-[14px] sm:text-[17px]"
                    >
                      Pay Later
                    </button>
                  )}
                </div>
                <button className="h-[45px]  mx-auto flex justify-center items-center gap-2 w-11/12 border-dotted border-[#1B75BC] border-2 rounded-[3rem] py-3 text-[#1B75BC] font-semibold">
                  <img
                    src={percentageImg}
                    alt=""
                    className="w-[20px] h-[20px]"
                  />
                  <span className="xs:text-[14px] sm:text-[17px]">
                    Get {singleService?.discount}% Discount on Pay Now
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Render the authentication popup when showAuthPopup is true */}
      {showAuthPopup && (
        <AuthPopup
          onClose={() => {
            setShowAuthPopup(false);
            setVariationError(null);
          }}
        />
      )}
      {showModal ? (
        <>
          <div className=" xs:w-[80vw] md:w-[50vw] m-auto justify-center  items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            {/*content*/}
            <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
              {/*body*/}
              <div className="flex-col items-center justify-center     min-w-screen ">
                <div className="max-w-xl text-center text-gray-800  bg-white  lg:max-w-3xl rounded-3xl">
                  <div className="flex-col justify-center ">
                    <div className=" thank">
                      <div className="lg:w-[61%] m-auto h-full flex flex-col justify-center items-center gap-7 py-12 text-center">
                        <div className="w-[45%]">
                          <img className="w-[100%]" src={thankImg} alt="" />
                        </div>
                        <h1 className="text-4xl text-main-color font-semibold">
                          Thank You For Your Order
                        </h1>
                        <hr className="text-black" />
                        <p className="text-sm">
                          If you'd like to get started immediately, you can pay
                          the project fees with a{" "}
                          <span className="font-bold">
                            {" "}
                            {singleService?.discount}% Discount
                          </span>{" "}
                          by visiting your order and get access to our live with
                          our agents
                        </p>
                      </div>
                      <div className="flex items-center justify-end p-2 border-t border-solid border-slate-200 rounded-b">
                        <button
                          className="text-red-500 background-transparent font-bold capitalize px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => setShowModal(false)}
                        >
                          Close
                        </button>
                        <Link
                          to={`/orders`}
                          className="bg-main-color text-white  font-bold capitalize text-sm px-6 py-3 rounded shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                          type="button"
                          onClick={() => {
                            setShowModal(false), navigate(`/orders`);
                          }}
                        >
                          View order
                          <FontAwesomeIcon
                            className="ms-3"
                            icon={faArrowRight}
                          />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/*footer*/}
            </div>
          </div>
          <div className="opacity-25 fixed inset-0 z-40 bg-black"></div>
        </>
      ) : null}
    </div>
  );
};

export default ProductDescription;
