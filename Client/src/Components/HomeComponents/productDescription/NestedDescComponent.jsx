import React from "react";
import { useSelector } from "react-redux";
import parse from "html-react-parser";

const NestedDescComponent = () => {
  const singleService = useSelector((state) => state.services.singleService);

  return (
    <div>
      <p className="text-[#8A8A8A] text-sm font-[300] leading-[25.6px] max-w-[95%] mb-12">
        {singleService?.botDescription && parse(singleService?.botDescription)}
      </p>
      <div className="mb-20 mt-5 flex xs:flex-col md:flex-row xs:w-[100%] lg:w-[80%] md:gap-16">
        {singleService?.leftDetailsItems?.length > 0 ? (
          <div className= 'xs:w-[70%] md:w-[50%]'>
            <h5 className="font-semibold text-2xl mb-4">
              {singleService.leftDetailsTitle}
            </h5>
            <ul className="text-[#8A8A8A] mb-8 list-disc">
              {singleService?.leftDetailsItems?.map((item, index) => (
                <li
                  className="text-sm p-0 m-0 ms-2 font-[300] leading-[25.6px]"
                  key={index}
                >
                  {item.content}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}
        {singleService?.rightDetailsItems?.length > 0 ? (
          <div className= 'xs:w-[70%] md:w-[50%]'>
            <h5 className="font-semibold text-2xl mb-4">
              {singleService.rightDetailsTitle}
            </h5>
            <ul className="text-[#8A8A8A] mb-8 list-decimal">
              {singleService?.rightDetailsItems?.map((item, index) => (
                <li
                  className="text-sm p-0 m-0 ms-2 font-[300] leading-[25.6px]"
                  key={index}
                >
                  {item.content}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default NestedDescComponent;
