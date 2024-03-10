import React from "react";
import OrderHistoryTable from "../../Components/orders/order";
import MainHeader from "../../Shared/MainHeader/MainHeader";
import "./order.css";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";

export default function OrderPage() {
  const orders = useSelector((state) => state.user?.user?.orders);

  return (
    <div className="order-container min-h-screen mt-10 pt-20">
      <MainHeader text="Order History" />
      <div className="mx-auto my-4">
        {orders?.length === 0 ? (
          <div className="text-center text-gray-500 xtext-md">
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
            ?.slice() // Create a shallow copy of the array
            ?.reverse()
            ?.map((order, index) => (
              <React.Fragment key={index}>
                {index > 0 && <div className="container my-4 border-t"></div>}{" "}
                {/* Divider */}
                <OrderHistoryTable
                  orderId={order._id}
                  orderStatus={order.status}
                  paymentStatus={order.payment}
                  message={order.message}
                  date={order.createdAt}
                  imageOrder={order.image}
                  orderName={order.title}
                  price={order.totalPrice}
                  service={order.service}
                  projectDetails={order.projectDetails}
                  className="container"
                />
              </React.Fragment>
            ))
        )}
      </div>
    </div>
  );
}
