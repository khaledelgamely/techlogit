/* eslint-disable react-refresh/only-export-components */
import MotionWrap from "../../../Wrapper/MotionWrap";
import { motion } from "framer-motion";
import "./companies.css";
import { useSelector } from "react-redux";
import { getHomeContent } from "../../../store/Slices/homeSlice";
import { globalUrl } from "../../../API/config";
import parse from "html-react-parser";
import { styleLastWord } from "../../../utils/styleLastWord.jsx";

function Companies() {
  const companiesData = useSelector(getHomeContent).whyChooseUs;
  const reasonsData = companiesData?.reasons;
  const image = companiesData?.image;

  const title = companiesData?.title;

  return (
    <div className="bg-bgCompanies bg-no-repeat xs:md:bg-cover ">
      <div className="relative w-full max-w-screen-xl mx-auto px-8 py-20  ">
        <h3 className="font-[600] mb-10 mt-5 text-center xs:text-[22px] md:text-[26px] lg:text-[40px] line-40 xs:font-body">
          {styleLastWord("Companies choose us because of our Quality Services")}
        </h3>
        <div className="flex justify-center items-center mt-2 ">
          <div className="flex flex-col-reverse lg:flex-row mt-5 w-[90%]">
            <div className="lg:w-6/12 lg:order-first xs:order-last w-full">
              <div className="section mt-2 w-full">
                {companiesData
                  ? Object?.keys(reasonsData).map((key) => {
                      const item = reasonsData[key];
                      return (
                        <div key={key}>
                          <div className="card flex xs:flex-col md:flex-row ">
                            <div
                              className="icons bg-no-repeat  md:flex items-center justify-start xs:w-[40%] sm:w-[13%] h-100 relative"
                              style={{
                                height: "100%",
                                backgroundRepeat: "no-repeat",
                                backgroundPosition: "left",
                                minHeight: "60px",
                              }}
                            >
                              <img
                                src={globalUrl + item.image}
                                className="icon mt-2 "
                                alt={item.title}
                              />
                            </div>
                            <div className="card xs:w-fit md:mb-7 ">
                              <div>
                                <h5 className="xs:text-[18px]  md:text-[26px] text-left my-2  text-black ">
                                  {item.title}
                                </h5>
                                <p className="xs:text-[14px] my-2    md:text-[16px] font-body font-[400]  tracking-tight text-gray-500">
                                  {parse(item.description)}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  : [1, 2, 3, 5, 7].map((key) => (
                      <div className="w-full" key={key}>
                        <div className="card flex xs:flex-col md:flex-row w-full ">
                          <div className="skeleton-icon bg-placeholder w-[40%] sm:w-[13%] h-100 relative"></div>
                          <div className="card xs:w-fit md:mb-2">
                            <div className="" key={key}>
                              <div
                                key={key}
                                role="status"
                                className="max-w-sm p-1 animate-pulse md:p-6 dark:border-gray-700"
                              >
                                <div className="flex items-center mt-1">
                                  <svg
                                    className="w-10 h-10 me-3 text-gray-200 dark:text-gray-700"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                                  </svg>
                                  <div>
                                    <div className="h-2.5 bg-gray-200 rounded-full dark:bg-gray-700 w-32 mb-2"></div>
                                    <div className="w-48 h-2 bg-gray-200 rounded-full dark:bg-gray-700"></div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
              </div>
            </div>
            {image ? (
              <div className="lg:w-6/12 lg:order-last sm:order-first order-last mx-5 ">
                <motion.img
                  className="w-full my-2 h-[88%] object-cover rounded-3xl transition-transform duration-300 transform lg:hover:scale-101"
                  src={globalUrl + image}
                  alt="companies"
                  animate={{ rotateY: 0 }}
                  whileHover={{ scale: 1.05, rotateY: 180 }}
                  transition={{ duration: 0.1 }}
                />
              </div>
            ) : (
              <div className="lg:w-6/12 lg:order-last sm:order-first order-last mx-5 mt-6 ">
                {/* Skeleton Loader for Image */}
                <div className="flex items-center justify-center m-auto w-[450px] max-w-full h-[500px] bg-gray-300 rounded-lg  dark:bg-gray-700">
                  <svg
                    className="w-10 h-10 text-gray-200 dark:text-gray-600"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 18"
                  >
                    <path d="M18 0H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2Zm-5.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm4.376 10.481A1 1 0 0 1 16 15H4a1 1 0 0 1-.895-1.447l3.5-7A1 1 0 0 1 7.468 6a.965.965 0 0 1 .9.5l2.775 4.757 1.546-1.887a1 1 0 0 1 1.618.1l2.541 4a1 1 0 0 1 .028 1.011Z" />
                  </svg>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default MotionWrap(Companies);
