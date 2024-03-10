import ParticlesContainer from "../ParticlesContainer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight, faTimes } from "@fortawesome/free-solid-svg-icons";
import {
  faFacebookF,
  faInstagram,
  faTwitter,
  faYoutube,
} from "@fortawesome/free-brands-svg-icons";
import { useSelector } from "react-redux";
import { getHomeContent } from "../../../store/Slices/homeSlice";
import { globalUrl } from "../../../API/config";
import { Link } from "react-router-dom";
import parse from "html-react-parser";
import { useState } from "react";
import { useEffect } from "react";

function Header() {
  const HomeData = useSelector(getHomeContent);
  const headerData = HomeData?.getStarted;
  const contactData = HomeData?.contact;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const videoUrl = headerData?.videoUrl;

  const loadVideo = (videoUrl) => {
    const videoIdMatch = videoUrl.match(
      /^(https:\/\/www\.youtube\.com\/(watch\?v=|embed\/|v\/|shorts\/|channel\/|user\/|c\/))?(.{11})/
    );
    if (videoIdMatch && videoIdMatch[3]?.length === 11) {
      return videoIdMatch[3];
    } else {
      alert("Invalid YouTube URL");
    }
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
  };
  const handleBackdropClick = (e) => {
    if (e?.target?.classList?.contains("backdrop")) {
      closeModal();
    }
  };

  useEffect(() => {}, [headerData]);
  return (
    <div className="header min-h-screen bg-[#011836] grid place-content-center  relative xs:pt-[5rem] md:pt-8 pb-8">
      <ParticlesContainer />

      <div className=" w-[95%] mx-auto relative mt-[4rem]">
        <div className="grid md:grid-cols-12 gap-y-12 md:gap-4">
          <div className="col-span-12 md:col-span-6  lg:col-span-7  grid mt-[3rem] text-center">
            <div
              className={`intro text-center md:text-left  ${
                headerData?.title ? "w-full" : "md:me-[26vw]"
              }`}
            >
              {headerData?.title ? (
                <h2 className="xs:text-[22px] md:text-[26px] lg:text-[40px] mb-[50px]  text-white font-bold leading-[30px] md:leading-[50px] xs:font-body ">
                  {parse(headerData?.title)}
                </h2>
              ) : (
                <h2 className="animate-pulse mb-[50px]  ">
                  <div className="h-[30px] w-[100%] bg-gray-300 mb-[20px] font-bold leading-[30px] md:leading-[50px] xs:font-body  rounded"></div>
                  <div className="h-[30px] w-[60%] bg-gray-300 mb-[20px] font-bold leading-[30px] md:leading-[50px] xs:font-body  rounded"></div>
                </h2>
              )}
              {/* <span className="text-main-color px-3">Design</span> */}
              {/* to Development team. */}
              <h4 className="xs:text-[14.592px] md:text-[16px] lg:text-[18px] text-white leading-[30px] text-center    lg:text-left ">
                {headerData?.description ? (
                  parse(headerData?.description)
                ) : (
                  <h4 className="animate-pulse  mb-24">
                    <div className="h-[18px] w-[80%] bg-gray-300 mb-8 mt-12 rounded"></div>
                    <div className="h-[18px] w-[10%] bg-gray-300 mb-16 rounded"></div>
                  </h4>
                )}
              </h4>
              <div className="flex sm:gap-3 xs:justify-center md:justify-start xs:items-center md:items-start  sm:flex-row">
                <div className="xs:w-[150px] sm:w-[200px] pt-4 pb-2 inline-block me-2">
                  <Link to={`/services`}>
                    <button className="w-full py-[15px] sm:px-[30px] bg-main-color rounded-[3rem] text-white flex justify-center items-center gap-2 mx-auto md:mx-0 ">
                      <span className="text-xs xs:text-sm sm:text-base">
                        Get Started
                      </span>
                      <FontAwesomeIcon className="" icon={faArrowRight} />
                    </button>
                  </Link>
                </div>
                <div className="xs:w-[150px] sm:w-[200px] pt-4 pb-2 inline-block">
                  <button
                    className="w-full py-[15px] sm:px-[30px] bg-main-color rounded-[3rem] text-white flex justify-center items-center gap-2 mx-auto md:mx-0 "
                    onClick={openModal}
                  >
                    <span className="text-xs xs:text-sm sm:text-base">
                      Watch Video
                    </span>
                    <FontAwesomeIcon className="" icon={faYoutube} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-6 lg:col-span-5  xl:col-span-5  mt-4 md:mt-0 px-2">
            {headerData?.image ? (
              <img
                className="loadAnimation w-full  h-full max-h-[500px] mx-auto md:mx-0"
                src={globalUrl + headerData?.image}
                // src="https://images.pexels.com/photos/17394284/pexels-photo-17394284/free-photo-of-car-parked.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load"
                alt="header image"
              />
            ) : (
              <div className=" flex items-center justify-center m-auto w-[400px] h-[400px] bg-gray-300 rounded-full   mx-auto md:mx-0 dark:bg-gray-700">
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
            )}
          </div>
        </div>
      </div>
      <div className="absolute bottom-[80px] w-full  justify-between items-center hidden lg:flex">
        <div className="relative">
          <p className="transform rotate-90 uppercase text-white  absolute left-[-50px] top-[-20px]">
            INFO@TECHLOGIT
          </p>
        </div>
        <div
          className="relative cursor-pointer"
          onClick={() => {
            window.scroll({
              top: 800,
              left: 0,
              behavior: "smooth",
            });
          }}
        >
          <p className="transform rotate-90 uppercase text-white  absolute right-[-30px] top-[-20px]">
            SCROLLDOWN
          </p>
        </div>
      </div>
      <div
        className="absolute top-[50%] right-4  flex flex-col items-center"
        style={{ animation: "bounce 2s infinite" }}
        onMouseEnter={(e) =>
          (e.currentTarget.style.animationPlayState = "paused")
        }
        onMouseLeave={(e) =>
          (e.currentTarget.style.animationPlayState = "running")
        }
      >
        <a
          rel="noopener noreferrer"
          href={
            contactData?.facebook.startsWith("http")
              ? contactData?.facebook
              : `https://facebook.com/${contactData?.facebook}`
          }
          className="text-white text-xl "
          target="_blank"
        >
          <FontAwesomeIcon icon={faFacebookF} />
        </a>
        <a
          rel="noopener noreferrer"
          href={
            contactData?.insta.startsWith("http")
              ? contactData?.insta
              : `https://instagram.com/${contactData?.insta}`
          }
          className="text-white text-xl "
          target="_blank"
        >
          <FontAwesomeIcon icon={faInstagram} />
        </a>
        <a
          rel="noopener noreferrer"
          href={
            contactData?.linkedin.startsWith("http")
              ? contactData?.linkedin
              : `https://twitter.com/${contactData?.linkedin}`
          }
          className="text-white text-xl "
          target="_blank"
        >
          <FontAwesomeIcon icon={faTwitter} />
        </a>
      </div>
      {isModalOpen && videoUrl && (
        <div
          className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50 backdrop"
          onClick={handleBackdropClick}
        >
          <div className="modal rounded-lg relative xs:w-full sm:w-3/4 h-[50vw] lg:h-3/4  shadow-lg">
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${loadVideo(videoUrl)}`}
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
}

export default Header;
