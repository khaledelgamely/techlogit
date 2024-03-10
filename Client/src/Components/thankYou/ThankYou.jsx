import React from "react";
import thankImg from "../../assets/Message received.png";
import "./thankYou.css";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import NotFoundPage from "../../Pages/NotFoundPage";
import Loader from "../../Shared/Loader/Loader";
const ThankYou = () => {
  const [order, setOrder] = useState(null);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const { id } = useParams();
  const { orders } = useSelector((state) => state.user?.user);
  const { loading } = useSelector((state) => state.user);

  useEffect(() => {
    const order = orders?.find((ele) => ele._id === id);
    if (order) {
      setOrder(order);
      setShowErrorModal(false);
    } else {
      setTimeout(() => {
        setShowErrorModal(true);
      }, 700);
    }
  }, [id, orders]);

  return (
    <>
      {loading ? (
        <Loader />
      ) : showErrorModal ? (
        <NotFoundPage />
      ) : (
        <>
          <div className="mt-9 thank min-h-[95vh] pt-16">
            <div className="xs:w-[90%] md:w-[80%] lg:w-[50%] m-auto h-full flex flex-col justify-center items-center gap-2  text-center">
              <div className="xs:w-[80%] sm:w-[55%] md:w-[45%] xs:mb-6">
                <img className="w-[100%] mt-[4rem]" src={thankImg} alt="" />
              </div>
              <p className="text-4xl text-main-color font-semibold">
                Thank You For Your Order
              </p>
              <p className="text-sm my-5  text-black">
                We're excited to get started on your project. this is pay on
                completion option and We'll be in touch within 48 hours via
                email to gather some additional information and start working on
                your project.
              </p>
              <hr className="border-t-1 border-dashed w-[100%] border-gray-600" />
              <p className="text-sm my-5  text-black w-[90%]">
                If you'd like to get started immediately, you can pay the
                project fees with a {order?.service?.discount}% discount by
                visiting your order and get access to our live with our agents
              </p>
              <Link
                to={`/order/${id}`}
                className="py-3  bg-main-color rounded-[3rem] text-white xs:w-[35%] md:w-[23%]"
              >
                Your Order
              </Link>
            </div>
          </div>
        </>
      )}
    </>
  );
};
export default ThankYou;
