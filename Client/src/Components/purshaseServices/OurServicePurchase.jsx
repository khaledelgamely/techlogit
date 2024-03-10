/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import MainHeader from "../../Shared/MainHeader/MainHeader.jsx";
import "./ourServicePurchase.css";
import { images } from "../../constants/index";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { Tab, initTE } from "tw-elements";
import { Link, Outlet, useParams } from "react-router-dom";
import Tech_Logit, { globalUrl } from "../../API/config.jsx";
import NestedRouteComp from "./NestedRouteComp.jsx";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  fetchServices,
} from "../../store/Slices/servicesSlice.jsx";

initTE({ Tab });

function OurServicePurchase({ categories }) {
  const [selectedCategoryId, setSelectedCategoryId] = useState();
  const dispatch = useDispatch();

  useEffect(() => {
    if(selectedCategoryId){
      dispatch(fetchServices(selectedCategoryId));
    }
  }, [selectedCategoryId]);


  useEffect(() => {
    const topOfPage = document.documentElement;
    topOfPage.scrollIntoView({ behavior: "smooth" });
    setSelectedCategoryId(categories[0]?._id);
  }, []);

  const handleButtonClick = (id) => {
    setSelectedCategoryId(id);
    const topOfPage = document.documentElement;
    topOfPage.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div className="mt-8 servicePurchase py-10 ">
      <MainHeader text="Our Services" />
      <div className="servicePurchaseContainer break-words container grid md:grid-cols-12 gap-5">
        <ul
          className="tabList hidden-scrollbar break-words flex xs:gap-4 sm:gap-0 list-none overflow-x-auto md:overflow-hidden md:flex-col md:gap-8 sm:col-span-12 md:col-span-3 l"
          role="tablist"
          data-te-nav-ref
        >
          {categories?.map((item, index) => (
            <li
              key={index}
              role="presentation"
              className={`text-center m-0 break-words `}
              style={{ listStyle: "none" }}
            >
              <Link
                // to={item._id}
                className={`xs:w-[110px] max-w-full ${selectedCategoryId == item._id
                  ? "md:bg-[#1B75BC] md:text-white"
                  : "md:bg-white "
                  } rounded-full p-3 md:w-11/12 lg:w-8/12 lg:m-auto my-2 xs:h-[150px] md:h-[150px] flex gap-5 items-center justify-center flex-col border-x-0 border-b-2 border-t-0 border-transparent font-medium leading-tight xs:text-[12px] md:text-[17px] text-neutral-500 hover:isolate hover:border-transparent  md:rounded-xl`}
                role="tab"
                onClick={() => handleButtonClick(item._id)}
              >
                <div
                  className={`flex w-[60px] justify-center items-center xs:p-5 md:p-0 xs:rounded-[50%] md:rounded-none ${selectedCategoryId == item._id
                    ? "bg-[#1B75BC] text-white"
                    : "bg-white"
                    } `}
                >
                  <img
                    src={globalUrl + item.icon}
                    alt=""
                    className="icon xs:min-w-[30px] xs:h-[30px] md:w-auto"
                  />
                </div>
                <p className="max-w-full xs:h-[25px] md:h-auto">
                  {item.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>

        <Outlet />
      </div>
    </div>
  );
}

export default OurServicePurchase;
