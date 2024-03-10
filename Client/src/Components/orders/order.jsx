/* eslint-disable react/prop-types */
import { AiOutlineArrowRight } from "react-icons/ai";
import "./order.css";
import { Link, useNavigate } from "react-router-dom";
import { globalUrl } from "./../../API/config";
import { useState } from "react";
import { useEffect } from "react";

const OrderHistoryTable = ({
  orderName,
  orderStatus,
  price,
  orderId,
  message,
  paymentStatus,
  date,
  imageOrder,
  service,
  projectDetails,
  order
}) => {
  const navigate = useNavigate(); // Access the navigate function
  const [isRedirecting, setIsRedirecting] = useState(false);
  const orderStatusBgClass =
    orderStatus === "recieved"
      ? "processingStatus"
      : orderStatus === "gathering-information"
        ? "pendingStatus text-white md:w-[184px] xs:px-[.5rem] sm:px-[.5rem] sm:w-[220px]"
        : orderStatus === "on-progress"
          ? "processingStatus"
          : "readyStatus";
  const orderEditedStatusBgClass =
    orderStatus === "recieved"
      ? "processingStatus"
      : orderStatus === "gathering-information"
        ? "pendingStatus text-white md:w-[184px] xs:px-[.5rem] sm:px-[.5rem]"
        : orderStatus === "on-progress"
          ? "processingStatus"
          : "readyStatus";

  const paymentStatusBgClass =
    paymentStatus === "unpaid"
      ? "pendingStatus"
      : paymentStatus === "refunded"
        ? "refundedStatus"
        : paymentStatus === "failed"
          ? "pendingStatus"
          : "readyStatus";

  const isChatButtonDisabled =
    paymentStatus === "unpaid" || paymentStatus === "refunded";

  const isPayButtonDisabled = paymentStatus === "paid";
  const dateOrder = new Date(date).toLocaleDateString();

  useEffect(() => {
    let timer;

    if (isRedirecting) {
      timer = setTimeout(() => {
        setIsRedirecting(false);
        navigate(`/payment/${orderId}`); // Use navigate to redirect
      }, 2000);
    }

    return () => {
      clearTimeout(timer); // Clear the timer if the component unmounts
    };
  }, [isRedirecting]);

  const handlePayNowClick = () => {
    setIsRedirecting(true);
  };
  return (
    <div className="flex flex-col lg:flex-row gap-6 my-8 xs:mx-10 justify-center items-center xl:mx-16">
      {/* Left Div with Image */}
      <div className="lg:w-1/4 rounded-2xl hidden xl:flex justify-center items-center bg-orderBg bg-center h-[366px] p-4">
        <img
          src={globalUrl + imageOrder}
          alt="Product"
          className="w-full object-cover rounded-2xl h-full"
        />
      </div>

      {/* Right Div with the Table */}
      <div className="bg-white rounded-2xl border border-transparent w-full lg:w-5/6 min-h-[350px]">
        <div className="flex flex-col h-full">
          {/* First Row */}
          <div className="flex flex-col md:flex-row md:border-b text-base md:text-lg xs:text-sm">
            <div className="xs:w-full md:w-3/5 md:border-r flex flex-row md:flex-col xs:my-7 md:my-0">
              <div className="mb-3 pl-4 pt-2 font-semibold md:w-full xs:w-full xs:text-[14px] sm:text-lg hidden md:flex">
                Order
              </div>
              <div className="mb-3 pl-4 pt-2 mr-1 font-semibold xs:w-1/2 text-lg flex md:hidden">
                <img
                  src={globalUrl + imageOrder}
                  alt="Product"
                  className="object-cover rounded-2xl"
                />
              </div>
              <hr className="mb-5" />
              <div className="flex flex-wrap flex-col px-4 py-2 xs:w-1/2 md:w-full">
                <p className="xs:text-[16px] sm:text-[30px] md:text-[18px] md:w-full xs:w-full font-semibold xs:leading-6 md:leading-6 sm:leading-10 md:font-[400]">
                  {orderName}
                </p>
                <p className="text-xl font-semibold text-[#1B75BC] xs:my-1 md:my-3">
                  ${order?.originPrice}
                </p>
                <p className="text-sm  md:text-[14px] line-clamp-2  max-h-20 max-w-[320px] break-all text-[#8A8A8A] hidden md:flex md:font-[400]  ">
                  {service?.defaultTopDescription}
                </p>
              </div>
            </div>
            <hr className="mb-5 xs:mx-4 md:mx-0" />
            <div className="w-full md:w-2/5 md:border-r flex flex-row md:flex-col">
              <div className="mb-3 pl-4 sm:pt-2 xs:pt-4 md:w-full xs:w-full xs:text-[14px] sm:text-lg leading-4 xs:font-[400] md:font-semibold">
                Date
              </div>
              <hr className="mb-5" />
              <div className="text-[16px] px-4 py-2 md:w-full xs:w-full xs:text-center md:text-left xs:text-[14px] sm:text-lg">
                {dateOrder}
              </div>
            </div>
            <div className="md:w-2/5 md:border-r flex flex-row md:flex-col ">
              <div className="mb-3 pl-4 sm:pt-2 xs:pt-4 md:w-full xs:w-full text-lg xs:text-[14px] sm:text-lg leading-4 xs:font-[400] md:font-semibold">
                Order Status
              </div>
              <hr className="mb-5" />
              <div className="flex flex-col items-center justify-center px-4 py-2 md:w-full xs:w-full">
                <div
                  className={`w-full h-8 flex items-center justify-center 
                  rounded-lg text-sm sm:text-lg xs:text-sm xs:px-[.5rem] sm:px-[1.5rem] lg:px-[.5rem] 
                  p-1 xl:h-[35px] sm:w-[182px] md:w-[160px] ${orderEditedStatusBgClass}`}
                >
                  {orderStatus === "recieved"
                    ? "Processing"
                    : orderStatus === "gathering-information"
                      ? "Awaiting details"
                      : orderStatus === "on-progress"
                        ? "On Progress"
                        : "Completed"}
                </div>
                <div
                  className={
                    paymentStatus == "paid"
                      ? "hidden"
                      : "flex text-gray-500 text-center text-sm mt-4"
                  }
                >
                  We will contact you within 48 hour via email
                </div>
                <div className="text-xs my-2 text-center hidden md:flex">
                  {message}
                </div>
                <div className="border-t mt-4 w-full hidden md:flex">
                  <Link
                    to={`/track_order/${orderId}`}
                    className={`${isChatButtonDisabled ? "disabled-btn" : ""
                      } w-full sm:m-3 md:m-1 lg:m-3 xs:m-1 rounded-3xl xs:h-8 xs:text-xs items-center 
                    justify-center hidden md:flex flex-row text-white bg-main-color text-xs xl:text-lg xl:h-[35px]`}
                  >
                    Track order <AiOutlineArrowRight className="text-lg mx-1" />
                  </Link>
                </div>
              </div>
            </div>
            <div className="md:w-2/5 flex flex-row md:flex-col">
              <div className="mb-3 pl-4 sm:pt-2 xs:pt-3 md:w-full xs:w-full text-lg xs:text-[14px] sm:text-lg leading-4 xs:font-[400] md:font-semibold">
                Payment
              </div>
              <hr className="mb-5" />
              <div className="flex flex-col items-center justify-center px-4 py-2 md:w-full xs:w-full">
                <div
                  className={`w-full h-8 flex items-center justify-center rounded-lg text-sm text-white sm:text-lg 
                  xs:text-sm xs:px-[1rem] sm:px-[1.5rem] lg:px-[1.5rem] p-1 xl:h-[35px] sm:w-[182px] md:w-[160px]  ${paymentStatusBgClass}`}
                >
                  {paymentStatus === "refunded"
                    ? "Refunded"
                    : paymentStatus === "paid"
                      ? "Paid"
                      : paymentStatus === "failed"
                        ? "Failed"
                        : "Unpaid"}{" "}
                </div>
              </div>
            </div>
          </div>

          {/* Second Row */}
          <div className="flex p-4">
            <div className="flex flex-col md:flex-row mt-3 sm:justify-center sm:items-center">
              <div className="flex flex-row md:flex-row w-full sm:w-3/4 xl:w-2/4 mb-3">
                <Link
                  to={`/track_order/${orderId}`}
                  className={`${isChatButtonDisabled
                      ? "disabled-track pay-btn3 w-1/2 md:hidden"
                      : "pay-btn3 w-1/2 md:hidden"
                    }`}
                >
                  Track Order{" "}
                  <AiOutlineArrowRight className="xs:text-base sm:text-[16px] mx-1 xs:font-[400] md:font-[500]" />
                </Link>
                <Link
                  to={`/chat?orderId=${orderId}`}
                  className={`pay-btn2  md:w-full ${isChatButtonDisabled ? "disabled-btn" : ""
                    }`}
                >
                  {orderStatus === "completed"
                    ? "View chat history"
                    : "Start Live Chat"}
                  <AiOutlineArrowRight className="xs:text-base sm:text-xl mx-1" />
                </Link>
              </div>
              {!isPayButtonDisabled ? (
                <Link
                  onClick={handlePayNowClick}
                  className={`pay-btn4edit relative overflow-hidden mb-3 ${isPayButtonDisabled
                      ? "xs:hidden md:flex flex-row items-center justify-center disabled-btn"
                      : "flex flex-row items-center justify-center"
                    }`}
                >
                  {isRedirecting ? ( // Display loading indicator if isRedirecting is true
                    <span className="text-lg">Please Wait...</span>
                  ) : (
                    <>
                      Pay Now
                      <span className="line-through xs:text-[12px] ps-2 px-1 text-gray-300  ml-1">
                        ${order?.originPrice}
                      </span>
                      <span className=" ml-1 md:text-[13px] lg:text-lg ps-1 ">${price}</span>
                      <AiOutlineArrowRight className="text-lg mx-1 mr-6" />
                      <div
                        className={`absolute flex items-center xs:top-[10px] sm:top-[11px] xs:right-[-4px] sm:right-[-5px] md:right-[-18px] lg:right-[-16px] w-100 xs:h-[50%] sm:h-[43.333%] md:h-[34.333%] lg:h-[43.333%] -mr-50 mt-15 transform rotate-45 bg-red-500 xs:text-[7.5px] sm:text-[10px] whitespace-no-wrap xs:pl-[1rem] sm:pl-[1.7rem] pr-[1rem] ${isPayButtonDisabled ? "bg-slate-300" : ""
                          }`}
                      >
                        {service?.discount}% Discount
                      </div>
                    </>
                  )}
                </Link>
              ) : (
                ""
              )}
              {isPayButtonDisabled && orderStatus !== "completed" ? (
                <p className="ms-4 order-last md:text-left text-sm text-[#8A8A8A] xs:font-[400]">
                  Ready to get started? Start a live chat and one of our agents
                  will help you get your project started right away
                </p>
              ) : !isPayButtonDisabled && orderStatus !== "completed" ? (
                <p className="ms-4 order-last md:text-left text-sm text-[#8A8A8A] xs:font-[400] ">
                  Pay now to get a {service?.discount}% discount and live chat
                  access for customers who need to start their project
                  immediately
                </p>
              ) : <p className="ms-4  invisible order-last md:text-left text-sm text-[#8A8A8A] xs:font-[400] ">
                Pay now to get a {service?.discount}% discount and live chat
                access for customers who need to start their project
                immediately
              </p>}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderHistoryTable;