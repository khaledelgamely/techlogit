import { useState } from "react";
import "./style.css";
import MotionWrap from "../../../Wrapper/MotionWrap";
import { useSelector } from "react-redux";
import { globalUrl } from "../../../API/config";
import { getHomeContent } from "../../../store/Slices/homeSlice";
import parse from "html-react-parser";
import { styleLastWord } from "../../../utils/styleLastWord";
import Icon from "../../../Icon/index.jsx";
import { DownCircleIcon, UpCircleIcon } from "../../../Icon/Icons/index.jsx";

function Our_Portfolio() {
  const [activeButtonIndex, setActiveButtonIndex] = useState(0);
  const { projectsCategories } = useSelector((state) => state.projects);
  const { projects } = useSelector((state) => state.projects);
  const filtration = (id, projects) => {
    return projects.filter((project) => project?.projectCategory?._id === id);
  };
  const initialProjects = filtration(projectsCategories[0]?._id, projects);
  const [allProjects, setAllProjects] = useState(initialProjects);
  const handleButtonClick = (index, id, projects) => {
    setActiveButtonIndex(index);
    const filterProject = filtration(id, projects);
    setAllProjects(filterProject);
  };
  const HomeData = useSelector(getHomeContent);
  const portfolio = HomeData?.portfolio;
  return (
    <div className=" relative">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-6 ">
          <Icon SvgIcon={DownCircleIcon} />
          <Icon SvgIcon={UpCircleIcon} />

          <h1 className="text-[28px] lg:text-[40px] font-semibold text-center my-7 mt-16">
            {styleLastWord("Our Portfolio")}
          </h1>
          <p className="text-[14px] md:text-lg leading-8 text-gray-400 mx-auto w-[90%] my-5">
            {portfolio?.description ? (
              parse(portfolio?.description)
            ) : (
              <div className="animate-pulse w-[100%] m-auto   justify-center">
                <div className="h-[20px] m-auto my-3 w-[100%] bg-gray-300 rounded"></div>
                <div className="h-[20px] m-auto my-3 w-[80%] bg-gray-300 rounded"></div>
              </div>
            )}
          </p>
        </div>
        {/* // to make filter dynamic */}

        <div className="flex justify-center gap-3 items-center space-x-3 hidden-scrollbar mx-1 relative z-10">
          <div className="flex items-center space-x-3 hidden-scrollbar overflow-y-hidden custom-scrollbar">
            {!projectsCategories?.length > 0 ? (
              // Skeleton for Categoriess
              Array.from({ length: 5 }, (_, index) => (
                <div
                  key={index}
                  className="xs:w-[120px] sm:w-[170px] pt-4 pb-2 inline-block me-2"
                >
                  <div className="animate-pulse">
                    <div className="h-[40px] w-full bg-gray-300 rounded-[3rem]"></div>
                  </div>
                </div>
              ))
            ) : (
              // Render Categories when loaded
              <div className=" flex justify-center gap-3 items-center space-x-3 hidden-scrollbar mx-1 relative z-10">
                <div className="flex items-center space-x-3 hidden-scrollbar custom-scrollbar">
                  {projectsCategories?.map((category, index) => (
                    <divs
                      key={category?._id}
                      className={` min-w-fit ${
                        activeButtonIndex === index
                          ? "active_button"
                          : "unactive_button"
                      }`}
                      onClick={() =>
                        handleButtonClick(index, category._id, projects)
                      }
                    >
                      {category?.title}
                    </divs>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        {/* //  projects */}
        {portfolio ? (
          <div className="overflow-x-scroll flex md:grid lg:grid-cols-3 md:grid-cols-2 gap-5 mt-5 md:overflow-x-hidden relative z-20 py-12">
            {allProjects.length == 0 ? (
              <h1 className="text-2xl font-semibold text-gray-600 text-center col-span-12">
                There is no projects
              </h1>
            ) : (
              allProjects?.map((item, index) => (
                <div key={index}>
                  <div className="flex flex-col justify-center items-center text-center  w-[300px] md:w-full">
                    <img
                      src={globalUrl + item?.smallImage}
                      className="w-[334px] h-[211px] mx-auto mb-4"
                      alt=""
                    />
                    <p className="text-[22px] text-gray-400 mb-2">
                      {item?.projectCategory?.title}
                    </p>
                    <h2 className="text-2xl tracking-tight text-gray-900  mb-4 font-[500]">
                      {item?.title}
                    </h2>
                    <button className="hidden border-2 border-icon text-icon px-4 py-2 rounded-3xl mt-3">
                      View Details
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-16 mt-5">
            {[...Array(6)].map((_, index) => (
              <div
                className="mb-4 rounded-3xl overflow-hidden shadow-lg animate-pulse"
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
        )}
      </div>
    </div>
  );
}

export default MotionWrap(Our_Portfolio);
