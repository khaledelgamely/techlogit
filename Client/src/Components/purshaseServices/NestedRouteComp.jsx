import { faArrowRight } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "html-react-parser";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { globalUrl } from "../../API/config.jsx";

function NestedRouteComp() {
  const services = useSelector((state) => state.services.services);
  return (
    <div className="sm:col-span-12 md:col-span-9">
      {services?.length > 0 && services != null ? (
        <div className="grid gap-5 xs:grid-cols-2 lg:grid-cols-3 xs:col-span-12 sm:col-span-10 lg:col-span-9">
          {services?.map((item, index) => (
            <Link
              to={`/product-description/${item._id}`}
              key={index}
              className="block" // Set a fixed height for the link container
            >
              <div className="flex flex-col h-full rounded-3xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700">
                <div className="h-[200px] xs:w-full relative overflow-hidden">
                  {/* Set a minimum height for the image container */}
                  <img
                    className="absolute top-0 left-0 w-full h-full object-cover rounded-t-[1.5rem]"
                    src={globalUrl + item.smallImage}
                    alt=""
                  />
                </div>
                <div className="xs:p-2 sm:p-6 flex-grow flex flex-col justify-between">
                  <div>
                    <h5 className="mb-2 xs:text-sm sm:text-xl h-[60px] line-clamp-2 xs:font-[600] sm:font-semibold leading-tight text-neutral-800 dark:text-neutral-50">
                      {item.defaultName}
                    </h5>
                    <div className="text-[#8A8A8A] xs:text-[13px] sm:text-sm ">
                      Starting From{" "}
                      <span className="text-[#1B75BC] font-semibold xs:text-[13px] sm:text-xl ml-3">
                        {item.defaultPrice}$
                      </span>
                    </div>
                    <p className="my-4 text-[#8A8A8A] dark:text-neutral-200 xs:text-[10px] sm:text-base break-words overflow-hidden line-clamp-2">
                      {parse(item.miniDescription)}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="mainBtn w-full text-center xs:text-[10px] sm:text-sm"
                    data-te-ripple-init
                    data-te-ripple-color="light"
                  >
                    Purchase Now
                    <FontAwesomeIcon className="ms-2" icon={faArrowRight} />
                  </button>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="grid gap-5 xs:grid-cols-2 lg:grid-cols-3 xs:col-span-12 sm:col-span-10 lg:col-span-9">
          {services !== null ? (
            Array(6)
              .fill()
              .map((_, index) => (
                <div
                  key={index}
                  className="h-[450px] inline-block  rounded-3xl bg-white shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] dark:bg-neutral-700"
                >
                  {/* Skeleton Loading */}
                  <div className="animate-pulse bg-gray-300 rounded-t-3xl xs:h-[150px] md:h-[190px] xs:w-full"></div>
                  <div className="xs:p-2 sm:p-6">
                    {/* Skeleton Loading */}
                    <div className="animate-pulse bg-gray-300 h-6 w-3/4 mb-2"></div>
                    {/* Skeleton Loading */}
                    <div className="animate-pulse bg-gray-300 h-4 w-1/2 mt-1"></div>
                    {/* Skeleton Loading */}
                    <div className="animate-pulse bg-gray-300 h-4 w-3/4 mt-1"></div>
                    {/* Skeleton Loading */}
                    <div className="animate-pulse bg-gray-300 h-6 w-1/2 mt-4"></div>
                  </div>
                </div>
              ))
          ) : (
            <div className="text-center mt-[10vw] xs:col-span-12">
              <h1 className="text-2xl font-semibold text-gray-600">
                No Services Found
              </h1>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default NestedRouteComp;
