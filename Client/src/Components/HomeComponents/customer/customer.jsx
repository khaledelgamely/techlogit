/* eslint-disable react-refresh/only-export-components */
import Slider from "../../slider/carousel";
import { images } from "../../../constants";
import MotionWrap from "../../../Wrapper/MotionWrap";
import MainHeader from "../../../Shared/MainHeader/MainHeader";
import "./customer.css";
import { useEffect } from "react";
import { useState } from "react";
import Tech_Logit from "../../../API/config";
import { useSelector } from "react-redux";
import { getHomeContent } from "../../../store/Slices/homeSlice";
import { styleLastWord } from "../../../utils/styleLastWord";

function Customer() {
  const HomeData = useSelector(getHomeContent);
  const title = HomeData?.reviewsTitle;
  const [reviewsData, setReviewsData] = useState(false);

  useEffect(() => {
    const fetchReviews = async () => {
      const { data } = await Tech_Logit.get(`reviews`);
      setReviewsData(data);
    };
    fetchReviews();
  }, []);

  return (
    <div
      className="xs:pt-4 xs:pb-28 sm:pb-16 md:px-20 relative "
      style={{
        backgroundImage: `url(${images.bg1}), url(${images.bg2})`,
        backgroundSize: "cover",
      }}
    >
      {reviewsData && (
        <div className="sm:px-[60px] md:px-[40px] lg:px-[105px]">
          <h1 className="text-[28px] lg:text-[40px] font-semibold text-center my-7 mt-16">
            {styleLastWord("What Our Customer Says")}
          </h1>
          <Slider data={reviewsData} />
        </div>
      )}
    </div>
  );
}

export default MotionWrap(Customer);

// xs:h-[530px] sm:h-[593px]
