import MotionWrap from "../../../Wrapper/MotionWrap.jsx";
import { motion } from "framer-motion";
import { useSelector } from "react-redux";
import { getHomeContent } from "../../../store/Slices/homeSlice";
import { globalUrl } from "../../../API/config";
import parse from "html-react-parser";
import { Link } from "react-router-dom";

function AboutUs() {
  const HomeData = useSelector(getHomeContent);
  const AboutUsData = HomeData?.aboutUs;

  // Check if AboutUsData or AboutUsData.image is undefined
  const isLoading = !AboutUsData || !AboutUsData.image;
    return (
    <div className="mt-5">
      <div className="container flex justify-center items-center h-auto flex-col">
        <div className="grid grid-cols-8 xs:gap-1 sm:gap-10 items-center my-16 w-full">
          <div className="xs:col-span-8 md:col-span-4 about-img-cont md:h-[400px]">
            {isLoading ? (
              <div className="rounded-3xl xs:w-[90%] xs:mx-left md:w-full h-full bg-gray-300 animate-pulse w-full"></div>
            ) : (
              <motion.img
                className="rounded-3xl xs:w-[90%] xs:mx-left md:w-full h-full"
                src={globalUrl + AboutUsData.image}
                alt="about us"
                animate={{ rotateY: 0 }}
                whileHover={{ rotateY: 180 }}
                transition={{ duration: 0.3 }}
              />
            )}
          </div>
          <div className="xs:col-span-8 md:col-span-4 ">
            {isLoading ? (
              <>
                <div className="h-8 bg-gray-300 rounded animate-pulse mb-3"></div>
                <div className="h-8 bg-gray-300 rounded animate-pulse mb-3"></div>
                <div className="h-8 bg-gray-300 rounded animate-pulse mb-3"></div>
                <div className="h-24 bg-gray-300 rounded animate-pulse"></div>
              </>
            ) : (
              <>
                <h1 className="xs:my-3 xs:text-lg md:text-3xl xl:text-4xl font-semibold xs:text-center md:text-start">
                  {AboutUsData.title}
                </h1>
                <p className="text-[14px] md:text-lg xs:mb-5 md:mt-3 lg:mt-5 md:mb-3 xs:text-center md:text-left">
                  {parse(AboutUsData.description)}
                </p>
              </>
            )}

            <div className="xs:text-center md:text-left">
             <Link to={'/how-it-work'}>
               <button className="h-[40px] xs:mt-4 lg:mt-10 bg-sky-600 text-white rounded-3xl xs:w-[149px]">
                 About Us
               </button>
             </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotionWrap(AboutUs);
