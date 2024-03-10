import thankImg from "../../assets/Thank you.png";
import "./OrderRecieved.css";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchUser } from "../../store/Slices/userSlice";
import NotFoundPage from "../../Pages/NotFoundPage.jsx";
import { useEffect, useState } from "react";
import Loader from "../../Shared/Loader/Loader.jsx";

const OrderRecieved = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { _id, orders } = useSelector((state) => state.user?.user);
  const { loading } = useSelector((state) => state.user);
  const [showErrorModal, setShowErrorModal] = useState(false);
  useEffect(() => {
    const orderDetails = orders?.find((order) => order._id === id);
    if (!orderDetails) {
      setShowErrorModal(true);
    } else {
      setShowErrorModal(false);
    }
  }, [_id, dispatch, id, orders]);

  useEffect(() => {
    dispatch(fetchUser(_id));
  }, []);
  return (
    <>
      {loading ? (
        <Loader />
      ) : showErrorModal ? (
        <NotFoundPage />
      ) : (
        <div className="mt-9 thank h-[95vh]">
          <div className="xs:w-[90%] md:w-[80%] lg:w-[61%] m-auto h-full flex flex-col justify-center items-center gap-2  text-center">
            <div className="xs:w-[75%] sm:w-[45%]">
              <img className="w-[100%] mt-[4rem]" src={thankImg} alt="" />
            </div>
            <p className="text-4xl text-main-color font-semibold">
              Your order has been received
            </p>
            <p className="text-sm my-2  text-black">
              Thank you for trusting TechLogit , Your order number is ({id}).{" "}
              <br /> You will receive an order confirmation email shortly
            </p>
            <hr className="border-t-1 border-dashed w-[100%] border-gray-600" />
            <p className="text-sm my-3  text-black w-[90%]">
              To start your project, please visit our live chat and share your
              project requirements with us
            </p>
            <Link
              to={`/chat?orderId=${id}`}
              className="py-3  bg-main-color rounded-[3rem] text-white xs:w-[35%] md:w-[23%]"
            >
              Start Live Chat
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
export default OrderRecieved;
