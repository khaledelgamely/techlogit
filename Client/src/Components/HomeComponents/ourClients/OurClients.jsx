import React from "react";
import MotionWrap from "../../../Wrapper/MotionWrap.jsx";
import { useSelector } from "react-redux";
import { getHomeContent } from "../../../store/Slices/homeSlice.jsx";
import { globalUrl } from "../../../API/config.jsx";
import { styleLastWord } from "../../../utils/styleLastWord.jsx";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ourClients.css";

const OurClients = () => {
  const HomeData = useSelector(getHomeContent);
  const clientsData = HomeData?.clients;

  // Loading skeleton UI for each client element
  const renderSkeleton = () => {
    return (
      <Slider dots={false} infinite={false} slidesToShow={5} slidesToScroll={1}>
        {[...Array(5)].map((_, index) => (
          <div key={index} className="flex justify-center items-center md:pl-10">
            <div className="skeleton-client xs:w-[60%] md:w-[70%] xs:h-8 md:h-10 mt-5 bg-gray-300"></div>
          </div>
        ))}
      </Slider>
    );
  };

  if (!clientsData) {
    return (
      <div className="container">
        <h1 className="text-[28px] lg:text-[40px] font-semibold text-center my-14 mt-16">
          {styleLastWord("Our Clients")}
        </h1>
        {renderSkeleton()}
      </div>
    );
  }

  return (
    // Your existing content
    <div className="container">
      <h1 className="text-[28px] lg:text-[40px] font-semibold text-center my-14 mt-16">
        {styleLastWord("Our Clients")}
      </h1>
      <Slider dots={true} infinite={true} slidesToShow={5} slidesToScroll={1} className="list-none">
        {clientsData?.map((item, index) => (
          <div key={index} className="flex justify-center items-center md:pl-10">
            <img
              className="xs:w-[60%] md:w-[70%] xs:h-8 md:h-10 mt-5"
              src={globalUrl + item}
              alt="TechClient"
              style={{ animation: "bounce 2s infinite" }}
            />
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default MotionWrap(OurClients);
