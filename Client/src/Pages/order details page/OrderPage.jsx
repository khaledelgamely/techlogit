import React, { useEffect, useRef } from "react";
import OrderHistoryTable from "../../Components/orders/order";
import MainHeader from "../../Shared/MainHeader/MainHeader";
import "./order.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link, useParams } from "react-router-dom";
import { Fragment } from "react";
import SEO from "../../utils/Seo.jsx";
import { useState } from "react";
import NotFoundPage from "../NotFoundPage.jsx";
import Loader from "../../Shared/Loader/Loader.jsx";

export default function OrderPage() {
  const orders = useSelector((state) => state.user?.user?.orders);
  const { loading } = useSelector((state) => state.user);
  const { id } = useParams();
  const orderRef = useRef(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [heighLigth, setHeighLigth] = useState(true);
  useEffect(() => {
    const orderDetails = orders?.find((order) => order._id === id);
    if (!orderDetails) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
    if (orderRef.current && id) {
      const dataIdValue = orderRef.current.getAttribute("data-id");
      if (dataIdValue === id) {
        orderRef.current.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
      const timer = setTimeout(() => {
        setHeighLigth(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [id, orderRef.current, orders]);

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
      {loading ? (
        <Loader />
      ) : showErrorModal ? (
        <NotFoundPage />
      ) : (
        <div className="order-container min-h-screen mt-10 pt-20">
          <MainHeader text="Order History" />
          <div className="mx-auto my-4">
            {orders?.length === 0 ? (
              <div className="text-center text-gray-500 text-md">
                <p>No orders found. Start by requesting a service.</p>
                <center className="mt-5">
                  <Link to="/services">
                    <button className="flex mainBtn text-xl items-center p-4">
                      Request a Service
                      <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
                    </button>
                  </Link>
                </center>
              </div>
            ) : (
              orders
                ?.slice()
                ?.reverse()
                ?.map((order, index) => (
                  <Fragment key={order._id}>
                    {index > 0 && (
                      <div className="container my-4 border-t"></div>
                    )}
                    {/* Divider */}
                    <div
                      data-id={order._id}
                      ref={id === order._id ? orderRef : null} // Set the ref only for the desired element
                      className={`${id === order._id && heighLigth ?"fade-out py-1":'py-1'}`}
                    >
                      <OrderHistoryTable
                        orderId={order._id}
                        orderStatus={order.status}
                        paymentStatus={order.payment}
                        message={order.message}
                        date={order.createdAt}
                        imageOrder={order.service?.defaultLargeImage}
                        orderName={order.title}
                        price={order.totalPrice}
                        service={order.service}
                        projectDetails={order.projectDetails}
                        order={order}
                        className="container"
                      />
                    </div>
                  </Fragment>
                ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
