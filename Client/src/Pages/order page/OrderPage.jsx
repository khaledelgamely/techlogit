import React from "react";
import OrderHistoryTable from "../../Components/orders/order";
import MainHeader from "../../Shared/MainHeader/MainHeader";
import "./order.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import SEO from "../../utils/Seo.jsx";
import Loader from "../../Shared/Loader/Loader.jsx";

export default function OrderPage() {
  const orders = useSelector((state) => state.user?.user?.orders);
  const { loading } = useSelector((state) => state.user);

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
      ) : (
        <div className="order-container min-h-screen mt-10 pt-20">
          <MainHeader text="Order History" />
          <div className="mx-auto my-4">
            {orders?.length === 0 ? (
              <div className="text-center text-gray-500 xtext-md">
                <p>No orders found. Start by requesting a service.</p>
                <center className="mt-5">
                  <Link to="/ContactUs">
                    <button className="flex mainBtn text-xl items-center p-4">
                      Request a Service
                      <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
                    </button>
                  </Link>
                </center>
              </div>
            ) : (
              orders
                ?.slice() // Create a shallow copy of the array
                ?.reverse()
                ?.map((order, index) => (
                  <React.Fragment key={index}>
                    {index > 0 && (
                      <div className="container my-4 border-t"></div>
                    )}
                    {/* Divider */}
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
                  </React.Fragment>
                ))
            )}
          </div>
        </div>
      )}
    </>
  );
}
