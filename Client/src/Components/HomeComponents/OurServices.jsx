import React from "react";
import MainHeader from "../../Shared/MainHeader/MainHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import MotionWrap from "../../Wrapper/MotionWrap";
import { images } from "../../constants";
import Tech_Logit, { globalUrl } from "../../API/config";
import { useSelector } from "react-redux";
import { getHomeContent } from "../../store/Slices/homeSlice";
import parse from "html-react-parser";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { styleLastWord } from "../../utils/styleLastWord";

function OurServices() {
  const HomeData = useSelector(getHomeContent);
  const ourServices = HomeData?.ourServices;

  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Add loading state

  const fetchCategories = async () => {
    try {
      const response = await Tech_Logit.get("categories");
      setCategories(response.data);
      setIsLoading(false); // Set loading to false when data is fetched
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (isLoading || !HomeData) {
    // Display skeleton or loading state when data is undefined or still loading
    return (
      <div className="container py-10">
        <h1 className="text-[28px] lg:text-[40px] font-semibold text-center my-14 mt-16">
          {styleLastWord("Our Services")}
        </h1>
        {/* Skeleton UI */}
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-16">
          {[...Array(6)].map((_, index) => (
            <div
              className="mb-4 rounded-3xl overflow-hidden shadow-lg bg-white animate-pulse"
              key={index}
            >
              <div className="w-full h-64 bg-gray-300"></div>
              <div className="px-6 py-4">
                <div className="mb-2 w-3/4 h-4 bg-gray-300"></div>
                <div className="w-1/2 h-4 bg-gray-300"></div>
              </div>
              <div className="px-6 pt-4 pb-2 mb-8">
                <div className="w-2/3 h-8 bg-gray-300"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        backgroundImage: `url(${images?.bg1}), url(${images?.bg2})`,
        backgroundSize: "cover",
      }}
      id="oursevice"
    >
      <div className="container py-10 break-words">
        <h1 className="text-[28px] lg:text-[40px] font-semibold text-center my-14 mt-16">
          {styleLastWord("Our Services")}
        </h1>
        <div className=" grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-4 md:line-[18px] ">
          {ourServices?.slice(0, 6).map((item, index) => (
            <div
              className="mb-4  rounded-3xl md:line-[18px] overflow-hidden shadow-lg bg-white"
              key={index}
            >
              <img
                className="w-full h-64 object-cover"
                src={globalUrl + item?.image}
                alt={item?.image}
              />
              <div className="px-6 py-4 ">
                <h2 className="font-[400] xs:text-sm md:text-xl mb-2 max-w-full">
                  {item.title}
                </h2>
                <div className="h-[160px] overflow-y-auto">
                  <p
                    style={{ lineHeight: "25.6px" }}
                    className=" max-w-full text-gray-400 xs:text-sm md:text-[18px]"
                  >
                    {item.description ? parse(item.description) : ""}
                  </p>
                </div>
              </div>
              <div className="px-6 pt-4 pb-2 mb-8">
                <Link to={`services/${item?._id}`}>
                  <button className="mainBtn flex items-center gap-2 px-6">
                    <span>Show more</span>
                    <FontAwesomeIcon className="" icon={faArrowRight} />
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MotionWrap(OurServices);
