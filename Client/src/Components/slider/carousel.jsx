/* eslint-disable react/prop-types */
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
library.add(faStar);
import "./carousel.css";
import { globalUrl } from "../../API/config";
import parse from "html-react-parser";

const Slider = ({ data }) => {
  const responsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1200 },
      items: 2,
    },
    tablet: {
      breakpoint: { max: 1200, min: 900 },
      items: 1,
    },
    mobile: {
      breakpoint: { max: 900, min: 700 },
      items: 1,
    },
    small: {
      breakpoint: { max: 700, min: 450 },
      items: 1,
    },
    verysmall: {
      breakpoint: { max: 450, min: 0 },
      items: 1,
    },
  };

  return (
    <div className="px-5">
      <Carousel
        responsive={responsive}
        autoPlay={true}
        autoPlaySpeed={5000}
        infinite={true}
        customLeftArrow={
          <button className="react-multiple-carousel__arrow react-multiple-carousel__arrow--left" />
        }
        customRightArrow={
          <button className="react-multiple-carousel__arrow react-multiple-carousel__arrow--right" />
        }
        keyBoardControl={true}
        customTransition="transform .9s ease-in-out"
        transitionDuration={1000}
      >
        {data?.map((item, index) => (
          <div
            className="bg-red-800 w-full h-[12rem] rounded-[25px] overflow-hidden"
            key={item._id}
          >
            <div className="bg-white shadow-md h-[100%] flex">
              <div className="image h-full w-[150px]">
                <img
                  src={globalUrl + item.image}
                  alt="slider"
                  className="w-full h-full"
                />
              </div>

              <div className="content flex-1 px-[2rem] py-[1rem] flex flex-col-reverse md:flex-col">
                <div className="rating">
                  {[..."#".repeat(item.rating)].map((_, index) => {
                    return (
                      <FontAwesomeIcon
                        key={`${item._id}-star-${index}`}
                        icon="star"
                        className="text-yellow-500 text-lg mb-2"
                      />
                    );
                  })}
                </div>
                <div className="review w-full text-md text-700 text-[#8a8a8a] h-[80px] overflow-auto my-2">
                  {parse(item.review)}
                </div>
                <div>
                  <p>{item.csName}</p>
                  <p className="text-[#8a8a8a]">{item.csJobTitle}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </Carousel>
    </div>
  );
};

export default Slider;

// {
//   data?.map((item, index) => (
//     <div className="w-full xs:h-[80%]" key={index}>
//       <div className="bg-white rounded-[25px] shadow-md flex xs:mx-3 sm:mx-5 overflow-hidden h-[200px] md:h-[250px]">
//         <div className="xs:w-[40%] h-[250px] md:w-[40%] lg:w-[30%] overflow-hidden">
//           <img
//             className="h-[290px] rounded-tl-3xl rounded-bl-3xl"
//             src={globalUrl + item.image}
//             alt="slider"
//           />
//         </div>
//         <div className="xs:w-[60%] md:w-[80%] lg:w-[70%] p-3 md:h-[80%]">
//           <div className="rating">
//             <div className="absolute top-5 cardTitle font-semibold sm:text-lg xl:text-2xl">
//               {item.csName}
//             </div>
// <div className="w-full text-md text-700 text-[#8a8a8a] mt-[65px] mb-[30px] max-h-12 overflow-x-auto lg:h-auto">
//   {item.review}
// </div>
//             <div className="flex flex-row absolute bottom-5">
//               {Array.from({ length: parseInt(item.rating) }).map(
//                 (_, starsIndex) => (
// <FontAwesomeIcon
//   key={starsIndex}
//   icon="star"
//   className="text-yellow-500 text-lg mb-2"
// />
//                 )
//               )}
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   ));
// }
