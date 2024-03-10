import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import "./orderTracker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faEnvelopeOpenText } from "@fortawesome/free-solid-svg-icons";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faUserTie } from "@fortawesome/free-solid-svg-icons";
import { faSquareCheck } from "@fortawesome/free-solid-svg-icons";
import Tech_Logit from "../../API/config";
import Loader from "../../Shared/Loader/Loader";

const OrderTracker = () => {
  const { id } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth > 890);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth > 890);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  function formatDate(inputDate) {
    const date = new Date(inputDate);
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are zero-based, so we add 1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  useEffect(() => {
    const getOrder = async () => {
      try {
        const response = await Tech_Logit.get(`orders/${id}`);
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      } finally {
        setLoading(false);
      }
    };

    getOrder();
  }, [id]);

  if (loading) {
    return <Loader />;
  }

  if (!orderData) {
    return (
      <div className="error-message">
        <p>Failed to fetch order data.</p>
      </div>
    );
  }

  return (
    <div className="mt-9 py-16 order-tracker">
      <div className="mt-9 py-16 order-tracker">
        <div className="container">
          <div className="stepperHolder py-10 bg-white rounded-3xl">
            <div className="">
              <h1 className="pl-[50px] text-2xl">{orderData?.title}</h1>
              <p className="pl-[50px] text-sm pt-4 mb-10 text-gray-600">
                Order Id: {orderData?._id}
              </p>
            </div>
            {isMobileView ? (
              <>

                <div className="w-[100%] stepper">
                  <div className="step-child">
                    <p className="step-bullet active-step step-1">
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "white", fontSize: "18px" }}
                      />
                    </p>
                  </div>
                  <div className="step-child">
                    <p
                      className={`step-bullet active-step   ${orderData?.status === "gathering-information" ||
                        orderData?.status === "completed" ||
                        orderData?.status === "on-progress"
                        ? ""
                        : "step-4"
                        }`}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "white", fontSize: "18px" }}
                      />
                    </p>
                  </div>
                  <div className="step-child">
                    <p
                      className={`step-bullet active-step  ${orderData?.status === "completed" ||
                        orderData?.status === "on-progress"
                        ? ""
                        : "step-4"
                        }`}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "white", fontSize: "18px" }}
                      />
                    </p>
                  </div>
                  <div>
                    <p
                      className={`step-bullet ${orderData?.status === "completed" ? "" : "step-4"
                        } `}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "white", fontSize: "18px" }}
                      />
                    </p>
                  </div>
                </div>

                <div className="stepper">
                  <div className="stepIconHolder">
                    <FontAwesomeIcon icon={faEnvelopeOpenText} />
                  </div>
                  <div className="stepIconHolder">
                    <FontAwesomeIcon icon={faPenToSquare} />
                  </div>
                  <div className="stepIconHolder">
                    <FontAwesomeIcon icon={faUserTie} />
                  </div>
                  <div className="stepIconHolder">
                    <FontAwesomeIcon icon={faSquareCheck} />
                  </div>
                </div>
                <div className="stepper-title">
                  <p className="ms-5">Order Received</p>
                  <p>Gathering Project Details</p>
                  <p>Working On Project</p>
                  <p>Project Completed</p>
                </div>
              </>
            ) : (
              <div className=''>
                <div className="vertical-step pl-[50px] flex gap-6">
                  <div className="step-vert-child">
                    <p className="step-vert-bullet active-vert-step step-1">
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "white", fontSize: "18px" }}
                      />
                    </p>
                  </div>
                  <div className="vert-step-info">
                    <FontAwesomeIcon icon={faEnvelopeOpenText} />
                    <p className=" sm:text-base xs:text-sm">Order Received</p>
                  </div>
                </div>
                <div className={`vertical-step pl-[50px] flex gap-6`}>
                  <div className={`step-vert-child ${orderData?.status === "gathering-information" ||
                    orderData?.status === "completed" ||
                    orderData?.status === "on-progress"
                    ? ""
                    : "step-4"
                    }`}>

                    <p
                      className={`step-vert-bullet active-vert-step`}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "white", fontSize: "18px" }}
                      />
                    </p>
                  </div>
                  <div className="vert-step-info">
                    <FontAwesomeIcon icon={faPenToSquare} />
                    <p className=' sm:text-base xs:text-sm'>Gathering Project Details</p>
                  </div>
                </div>
                <div className={`vertical-step pl-[50px] flex gap-6 `}>
                  <div className={`step-vert-child ${orderData?.status === "completed" ||
                    orderData?.status === "on-progress"
                    ? ""
                    : "step-4"
                    }`}>
                    <p className={`step-vert-bullet active-vert-step`}>
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "white", fontSize: "18px" }}
                      />
                    </p>
                  </div>
                  <div className="vert-step-info">
                    <FontAwesomeIcon icon={faUserTie} />
                    <p className=' sm:text-base xs:text-sm'>Working On Project</p>
                  </div>
                </div>
                <div className="pl-[50px] flex  gap-6">
                  <div className="">
                    <p
                      className={`step-vert-bullet ${orderData?.status === "completed" ? "" : "step-4"
                        } `}
                    >
                      <FontAwesomeIcon
                        icon={faCheck}
                        style={{ color: "white", fontSize: "18px" }}
                      />
                    </p>
                  </div>
                  <div className="vert-step-info">
                    <FontAwesomeIcon icon={faSquareCheck} />
                    <p className='sm:text-base xs:text-sm '>Project Completed</p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <hr className="w-1/2 my-6 text-black" />
          <div className="work-status">
            <h1 className="font-semibold mb-4">Work-Status : </h1>
            {orderData?.workStatus?.map((item) => {
              return (
                <div key={item._id} className="mb-6">
                  <div className="flex justify-between xs:w-full lg:w-1/2 mb-1">
                    <li className="text-[#1B75BC]">{item.title}</li>
                    <p className="text-[#8A8A8A]">
                      {formatDate(item.updatedAt)}
                    </p>
                  </div>
                  <p className="text-[#8A8A8A] text-sm pl-16 xs:w-full lg:w-1/2">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderTracker;
