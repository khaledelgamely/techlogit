/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { images } from "../../../constants/index";

export default function ConfirmModal({ onClose, amount, orderNumber }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.5 }}
        className="bg-white p-4 rounded-xl shadow-md relative xs:w-[80%] sm:w-[70%] md:w-[500px] "
      >
        <button
          className="absolute top-2 right-2 bg-transparent border-none cursor-pointer"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} size="xl" className="pr-2 pt-1" />
        </button>
        <img
          src={images.confirmation}
          alt="confirmed"
          className="block mx-auto mb-4 w-24 h-auto mt-8"
        />
        <div className="text-center">
          <h3 className="text-2xl font-[600] text-main-color leading-9 mb-2 ">
            Payment Successful!
          </h3>
          <h3 className="text-xl font-[400] text-[#979797] leading-9 mb-14">
            Order Number: {orderNumber}
          </h3>
        </div>
        <hr className="my-5" />
        <div className="flex flex-row justify-between w-full mt-14 myb-5 px-3">
          <h2 className="text-[18px] md:text-[20px] font-[500] text-[#979797]">
            Amount Paid:
          </h2>
          <h2 className="text-[18px] md:text-[22px]font-[500] text-[#979797] ">
            {amount} $
          </h2>
        </div>
      </motion.div>
    </div>
  );
}
