import MainHeader from "../../Shared/MainHeader/MainHeader";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { images } from "../../constants";
import "./HowItWork.css";
import NavBar from "../../Shared/NavBar/NavBar";
import Footer from "../../Shared/Footer/Footer";
import { useEffect } from "react";
import SEO from "../../utils/Seo.jsx";
import { Link } from "react-router-dom";
function HowItWork() {
  const howItWorkCards = [
    {
      image: images.services,
      header: "Choose the service you need",
      text: "You can choose from a wide range of IT services on our service page, or you can ask us for a custom service",
    },
    {
      image: images.signup,
      header: "Login and get started ",
      text: "Simply log in to techlogit , to track the status of your services, and to live chat with our experts who will provide the service for you ",
    },
    {
      image: images.payment,
      header: "Pay upfront or pay on completion",
      text: "Pay upfront and get 10% discount and immediately live chat with an expert , or pay later and we'll contact you in 24 hours to process your service and you'll pay upon completion      ",
    },
    {
      image: images.chat,
      header: "Start Live Chat With Expert",
      text: "We have a team of experts who can implement the service you need , we will connect you with the right expert to get started right away      ",
    },
    {
      image: images.orders,
      header: "Track Your Service",
      text: "you can track the progress of your services implementation at any time , This will allow you to follow your project step-by-step",
    },
  ];
  useEffect(() => {
    const topOfPage = document.documentElement;
    topOfPage.scrollIntoView({ behavior: "smooth" });
  }, []);
  return (
    <>
      <SEO
        title="My Page Title"
        description="Description of My Page"
        ogTitle="My Page Title for Sharing"
        ogDescription="My Page Description for Sharing"
        ogType="website"
        ogImage="URL to My Page Image"
        ogUrl="URL of My Page"
        siteName="My Site Name"
      />
      <div className="bg-How_Work -mt-10 pt-10   bg-center">
        <NavBar />
        <div className=" xs:w-[97%] md:w-[90%] lg:w-[80%] m-auto mb-10 mt-[6rem] ">
          <MainHeader text="How it works" />
          <div className="text-center mb-10">
            <p className="text-second-color w-3/4 mx-auto mb-8">
              Techlogit: Your One-Stop Destination for All Digital Needs – Offering Expert Assistance, Seamless Project Tracking, Live Support, and Flexible Payment Plans for a Wide Range of Online and Technology-Related Services."
            </p>
            <>
              <div className="text-[18px] font-[500] ">
                <svg
                  className="inline-block me-2 text-sm"
                  xmlns="http://www.w3.org/2000/svg"
                  height="1em"
                  viewBox="0 0 512 512"
                >
                  <path d="M464 256A208 208 0 1 1 48 256a208 208 0 1 1 416 0zM0 256a256 256 0 1 0 512 0A256 256 0 1 0 0 256zM232 120V256c0 8 4 15.5 10.7 20l96 64c11 7.4 25.9 4.4 33.3-6.7s4.4-25.9-6.7-33.3L280 243.2V120c0-13.3-10.7-24-24-24s-24 10.7-24 24z" />
                </svg>
                In as quick as 10 minutes*
              </div>
            </>
          </div>
          {/* here data come from api */}
          <div className="flex flex-col relative mb-10 ">
            <div className="md:timeline">
              <div className="outer">
                {/* <!-- .... cardWork before this --> */}
                {howItWorkCards.map((card, index) => (
                  <div className="cards md:w-full " key={index}>
                    <div
                      className={`work-info  ${index === 0 ? "first-work-info" : ""
                        }`}
                    >
                      <div
                        key={index}
                        className={` pb-5 shadow-sm mb-3 rounded-lg flex flex-col items-center justify-between gap-4 md:gap-8 ${index % 2 != 0 ? "md:flex-row-reverse" : "md:flex-row"
                          } `}
                      >
                        <img
                          src={card.image}
                          alt="how it work"
                          className="xs:w-full xs:h-full md:w-[420px] md:h-[318px] md:mt-6 border-[4px] border-t-[15px] border-black rounded-[15px] "
                        />
                        <div>
                          <div className="px-5">
                            <h1 className="text-main-color font-body font-bold xs:text-[16px] md:text-[24px] pb-3">
                              {card.header}
                            </h1>
                            <p className="text-second-color font-body xs:text-[11px] md:text-[16px] font-[300] ">
                            {card.text}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {/* <!-- ..... you can add more div with "cardWork" class --> */}
              </div>
            </div>
          </div>

          <div className="textContent text-center mt-4 xs:w-[95%] md:w-[80%] m-auto">
            <h2 className="text-[20px] md:text-[40px] text-white mb-3 leading-[40px] md:leading-[52.08px] font-bold xs:font-body">
              Done! <br />
              That took 10 minutes and you've <br />
              successfully requested your service
            </h2>
            <Link to={`/services`} className="px-10 py-3  bg-white rounded-[3rem] text-main-color">
              Start now
            </Link>
          </div>
        </div>
        <Footer />
      </div>
    </>
  );
}

export default HowItWork;
