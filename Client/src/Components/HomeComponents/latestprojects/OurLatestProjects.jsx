import React from "react";
import "./ourLatestProjects.css";
import MotionWrap from "../../../Wrapper/MotionWrap.jsx";
import MainHeader from "../../../Shared/MainHeader/MainHeader";
import { globalUrl } from "../../../API/config";
import { useSelector } from "react-redux";
import { getHomeContent } from "../../../store/Slices/homeSlice";
import parse from "html-react-parser";
import { styleLastWord } from "../../../utils/styleLastWord";

const OurLatestProjects = () => {
  const HomeData = useSelector(getHomeContent);
  const latestProjects = HomeData?.latestProjects;


  if (!latestProjects) {
    return (
      <div className="container my-20 pt-4">
        <h1 className="text-[28px] lg:text-[40px] font-semibold text-center my-14 mt-16">
          {styleLastWord("Our Latest Projects")}
        </h1>
        <div className="grid w-[70%] grid-cols-8 md:gap-14 xs:gap-y-5 m-auto">
          {[1, 2, 3, 4].map((index) => {
            const isEvenIndex = index % 2 === 0;
            const imageClassName =
              index === 1 || index === 4
                ? " lg:h-[420px] rounded-2xl"
                : "lg:h-[300px] rounded-2xl";

            return (
              <div
                key={index}
                className={`xs:col-span-8 md:col-span-4 ${isEvenIndex ? "even" : "odd"
                  } ${index === 4 && "md:mt-[-7.5rem]"}`}
              >
                <div className="flex justify-center items-center h-auto flex-col">
                  <div className={`col-span-12 md:col-span-5  px-2 `}>
                    {/* Skeleton Loader for Image */}
                    <div className={`flex items-center  ${imageClassName} justify-center m-auto w-[350px] h-[350px] bg-gray-300 rounded-lg  dark:bg-gray-700`}>
                      <svg className="w-10 h-10 text-gray-200 dark:text-gray-600" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 18">
                        <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                      </svg>
                    </div>
                    <div className="w-[100%] m-auto">
                      <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[70%]  my-4"></div>
                      <div className="h-3 bg-gray-200 rounded-full dark:bg-gray-700 w-[30%]  mb-4"></div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    // Your existing content
    <div className="container my-20 pt-4">
      <h1 className="text-[28px] lg:text-[40px] font-semibold text-center my-14 mt-16">
        {styleLastWord("Our Latest Projects")}
      </h1>
      <div className="flex justify-center items-center h-auto flex-col">
        <div className="grid grid-cols-8 md:gap-14 xs:gap-y-5">
          {latestProjects?.slice(0, 4)?.map((item, index) => {
            const isEvenIndex = index % 2 === 0;
            const imageClassName =
              index === 0 || index === 3
                ? "w-full lg:h-[420px] rounded-2xl"
                : "lg:h-[300px] w-full rounded-2xl";
            return (
              <div
                key={index}
                className={`xs:col-span-8 md:col-span-4 ${isEvenIndex ? "even" : "odd"
                  } ${index === 3 && "md:mt-[-7.5rem]"}`}
              >
                <div className="flex justify-center items-center h-auto flex-col">
                  <div className="project-item">
                    <img
                      className={imageClassName}
                      src={globalUrl + item.largeImage}
                      alt="project"
                    />
                    <h1 className="xs:my-5 md:mt-8 text-[18px] md:text-[24px]">
                      {item.title}
                    </h1>
                    <p className="md:w-3/4 text-[14px] md:text-lg mb-2">
                      {parse(item.description)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MotionWrap(OurLatestProjects);
