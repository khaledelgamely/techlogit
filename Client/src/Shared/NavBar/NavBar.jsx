/* eslint-disable no-constant-condition */
import {
  faArrowRight,
  faBars,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { images } from "../../constants";
import "./NavBar.css";
import defaultProfilePicture from "../../assets/download.png";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { Collapse, Dropdown, initTE, Tab } from "tw-elements";
import Tech_Logit, { globalUrl } from "../../API/config";
import {
  addUnseen,
  ResetRedux,
  setUnseen,
  updateUserConversation,
} from "../../store/Slices/userSlice";
import { handleClickOutside } from "../../utils/handleClickOutside";

function NavBar() {
  const socket = useSelector((state) => {
    return state.user?.socket;
  });
  const userConversationsRedux = useSelector((state) => {
    return state.user?.userConversations;
  });
  const unseenConvo = useSelector((state) => {
    return state.user?.unseen;
  });
  const { user } = useSelector((state) => state.user);
  console.log(user);
  const orders = useSelector((state) => state.user?.user?.orders);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedLink, setSelectedLink] = useState(null);
  const [scrolling, setScrolling] = useState(false);
  const [openDropDawn, setOpenDropDawn] = useState(false);
  const getchats = useRef(false);
  const [paidOrders, setPaidOrders] = useState([]);
  const [unPaidOrders, setUnPaidOrders] = useState([]);
  const [unChated, setUnChated] = useState(null);
  const token = Cookies.get("token");
  const dispatch = useDispatch();
  const location = useLocation();
  const splitedLocation = location.pathname.split("/")[1];
  const isLogin = token && user?.email != "";
  const [openProfileDropDown, setOpenProfileDropDown] = useState(false);
  const dropDawnRef = useRef(null);
  const dropDawnProfileRef = useRef(null);
  const [allPaidOrdersAlternatively, setAllPaidOrdersAlternatively] =
    useState(null);

  const splitPaidAndUnpaid = () => {
    const paid = [];
    const unpaid = [];
    orders?.forEach((order) => {
      if (order.payment === "paid") {
        paid.push(order);
      } else {
        unpaid.push(order);
      }
    });
    setPaidOrders(paid);
    setUnPaidOrders(unpaid);
  };
  useEffect(() => {
    splitPaidAndUnpaid();
  }, [orders, userConversationsRedux]);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      socket?.on("getMessageFromAdmin", (message) => {
        dispatch(addUnseen(message.conversation));
        dispatch(
          updateUserConversation({
            conversationId: message.conversation,
            lastMessageOn: message.createdAt,
            lastMessage: {
              content: message.content,
              _id: message._id,
              isFromAdmin: true,
            },
          })
        );
      });
    }
  }, [dispatch, socket]);

  useEffect(() => {
    if (
      !paidOrders ||
      !userConversationsRedux ||
      paidOrders.length === 0 ||
      userConversationsRedux.length === 0
    ) {
      return;
    }
    let orderWithUnseenConversation = [];
    let orderWithConversation = [];
    let orderWithoutConversation = paidOrders.slice();

    userConversationsRedux.forEach((conversation) => {
      const orderIndex = orderWithoutConversation.findIndex(
        (order) => order._id === conversation.order?._id
      );
      if (orderIndex !== -1) {
        const updatedOrder = {
          ...orderWithoutConversation[orderIndex],
          lastMessageOn: conversation.lastMessageOn,
          lastMessage: conversation.lastMessage,
        };

        if (unseenConvo?.includes(conversation._id)) {
          orderWithUnseenConversation.push(updatedOrder);
        } else {
          orderWithConversation.push(updatedOrder);
        }
        // Remove the order from orderWithoutConversation
        orderWithoutConversation.splice(orderIndex, 1);
      }
    });
    // Sort and map the arrays
    orderWithConversation.sort(
      (a, b) => new Date(b.lastMessageOn) - new Date(a.lastMessageOn)
    );
    orderWithUnseenConversation.sort(
      (a, b) => new Date(b.lastMessageOn) - new Date(a.lastMessageOn)
    );
    orderWithoutConversation.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    setUnChated(
      orderWithoutConversation.map((order) => ({ ...order, unSeenStyle: true }))
    );
    setAllPaidOrdersAlternatively([
      ...orderWithUnseenConversation.map((order) => ({
        ...order,
        unSeenStyle: true,
      })),
      ...orderWithoutConversation.map((order) => ({
        ...order,
        unSeenStyle: true,
      })),
      ...orderWithConversation,
    ]);
  }, [paidOrders, unseenConvo, userConversationsRedux]);

  const Links = [
    { item: "Home", linkTo: "/" },
    { item: "Services", linkTo: "/services" },
    { item: "Our Projects", linkTo: "/OurProjects" },
    { item: "How it Works", linkTo: "/how-it-work" },
    { item: "Contact Us", linkTo: "/ContactUs" },
  ];

  useEffect(() => {
    if (user._id) {
      if (unseenConvo.length == 0 && user._id != "") {
        const getUnseenConversaations = async () => {
          try {
            const response = await Tech_Logit.get(
              `conversations/${user._id}/unseenConversations`
            );
            dispatch(setUnseen(response.data.unseenConversations));
          } catch (error) {
            console.log(error);
          }
        };

        getUnseenConversaations();
      }
    }
  }, [dispatch, unseenConvo.length, user._id]);
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 0) {
        setScrolling(true);
      } else {
        setScrolling(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleLinkClick = (item) => {
    if (selectedLink !== item) {
      setSelectedLink(item);
    }
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    document.addEventListener("click", (e) => {
      handleClickOutside(e, dropDawnRef, setOpenDropDawn);
      handleClickOutside(e, dropDawnProfileRef, setOpenProfileDropDown);
    });
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);
  const openCustomDropDawn = () => {
    getchats.current = !getchats.current;
    setOpenDropDawn(!openDropDawn);
  };
  useEffect(() => {
    initTE({ Collapse, Dropdown, Tab });
  }, [openDropDawn]);
  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[21]  pb-1 px-2
      ${
        scrolling || location.pathname !== "/"
          ? "bg-white text-main-color shadow-sm transition-all duration-300 pt-2 "
          : "bg-transparent lg:text-white pt-2 "
      }`}
    >
      <div className="navbar mx-auto xs:px-3 sm:px-3 lg:px-[2vw] xl:px-[5.2vw]">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link className="pe-[2.5vw]" to="/">
              <div className="logo">
                <img
                  src={images.logo}
                  alt="logo"
                  className="w-[76px] h-[58px] max-w-[100%]"
                />
              </div>
            </Link>
            <div className=" relative hidden pt-2 lg:flex sm:space-x-6 xl:space-x-8 text-sm md:text-[0.9rem] xl:text-[1rem] xl:font-normal xl:leading-3 xl:tracking-tight flex-2">
              {Links.map((link, index) => (
                <button
                  className={`
                 hover:text-main-color  hover:cursor-pointer relative
                 ${
                   `/${splitedLocation}` == link.linkTo
                     ? "text-main-color"
                     : "underLineHover"
                 } 
                 `}
                  key={index}
                  onClick={() => handleLinkClick(link.item)}
                >
                  <div
                    className={`${
                      `/${splitedLocation}` == link.linkTo
                        ? 'absolute before:content-[""]  -bottom-[0.71rem] left-[50%] translate-x-[-50%] w-[170%] h-[2.5px] bg-blue-500'
                        : ""
                    } `}
                  ></div>
                  <Link
                    className="pb-1 inline-block"
                    to={link.linkTo}
                    key={link.item}
                  >
                    {link.item}
                  </Link>
                </button>
              ))}
            </div>
          </div>
          <div className="hidden xs:flex items-center space-x-4">
            {/* here we will check if user login or not */}
            {!isLogin ? (
              <>
                <Link to="/signIn">
                  <button className="hidden lg:block">Log In</button>
                </Link>
                <Link to="/signUp">
                  <button
                    className={`hidden lg:block border-2 rounded-[3rem] px-4 py-3 ${
                      scrolling ? " border-black " : "bg-transparent"
                    }`}
                  >
                    Sign Up
                  </button>
                </Link>
              </>
            ) : null}
            <Link to="/ContactUs">
              <button className="hidden lg:flex mainBtn items-center px-4">
                Request a Service
                <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
              </button>
            </Link>
            {/* here we will check if user login or not */}
            {isLogin ? (
              <div className="flex items-center justify-between">
                <div className="relative" ref={dropDawnRef}>
                  <span
                    className="flex items-center cursor-pointer "
                    onClick={() => openCustomDropDawn()}
                  >
                    <span
                      className="[&>svg]:w-5"
                      style={{
                        borderRight: "2px solid #9E9E9E",
                        paddingRight: "17px",
                      }}
                    >
                      <svg
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          clipRule="evenodd"
                          d="M12 2.75C6.89137 2.75 2.75 6.89137 2.75 12C2.75 13.4811 3.09753 14.8788 3.7148 16.1181C3.96254 16.6155 4.05794 17.2103 3.90163 17.7945L3.30602 20.0205C3.19663 20.4293 3.57066 20.8034 3.97949 20.694L6.20553 20.0984C6.78973 19.9421 7.38451 20.0375 7.88191 20.2852C9.12121 20.9025 10.5189 21.25 12 21.25C17.1086 21.25 21.25 17.1086 21.25 12C21.25 6.89137 17.1086 2.75 12 2.75ZM1.25 12C1.25 6.06294 6.06294 1.25 12 1.25C17.9371 1.25 22.75 6.06294 22.75 12C22.75 17.9371 17.9371 22.75 12 22.75C10.2817 22.75 8.65552 22.3463 7.21315 21.6279C6.99791 21.5207 6.77814 21.4979 6.59324 21.5474L4.3672 22.143C2.84337 22.5507 1.44927 21.1566 1.857 19.6328L2.4526 17.4068C2.50208 17.2219 2.47933 17.0021 2.37213 16.7869C1.65371 15.3445 1.25 13.7183 1.25 12ZM7.25 10.5C7.25 10.0858 7.58579 9.75 8 9.75H16C16.4142 9.75 16.75 10.0858 16.75 10.5C16.75 10.9142 16.4142 11.25 16 11.25H8C7.58579 11.25 7.25 10.9142 7.25 10.5ZM7.25 14C7.25 13.5858 7.58579 13.25 8 13.25H13.5C13.9142 13.25 14.25 13.5858 14.25 14C14.25 14.4142 13.9142 14.75 13.5 14.75H8C7.58579 14.75 7.25 14.4142 7.25 14Z"
                          fill="#979899"
                        />
                      </svg>
                    </span>
                    {(unseenConvo?.length > 0 || unChated?.length > 0) && (
                      <span className="absolute -mt-4 ml-2.5 rounded-full bg-main-color px-[0.35em] py-[0.15em] text-[0.6rem] font-bold leading-none text-white top-[10px] left-[-3px]">
                        {unseenConvo?.length + unChated?.length}
                      </span>
                    )}
                  </span>
                  {openDropDawn && (
                    <>
                      <div
                        className="triangle-up absolute top-[40px] w-0 h-0 left-[-30px]"
                        style={{
                          borderLeft: "40px solid transparent",
                          borderRight: "40px solid transparent",
                          borderBottom: "40px solid #ffffff",
                        }}
                      ></div>
                      {/*Request a service*/}

                      <div className=" pt-6 absolute  bg-white dropDownChat text-black rounded-md shadow-md top-[60px]">
                        <div className=" px-5 flex justify-between items-center">
                          <h3 className=" font-[600] font-body  text-[18px]">
                            Recent Services
                          </h3>
                          <Link to={"/orders"} onClick={openCustomDropDawn}>
                            <span className="  text-main-color text-sm cursor-pointer">
                              View All
                            </span>
                          </Link>
                        </div>
                        <ul
                          className=" px-5 flex list-none flex-row flex-wrap  "
                          role="tablist"
                          data-te-nav-ref
                        >
                          <li
                            role="presentation "
                            className="list-none m-0 w-[62px]"
                          >
                            <a
                              href="#tabs-home"
                              className="mt-2 block border-x-0 border-b-4 border-t-0 border-transparent pb-2 pt-4 text-[16px] font-[500] capitalize leading-tight text-neutral-500  hover:border-transparent focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                              data-te-toggle="pill"
                              data-te-target="#tabs-home"
                              data-te-nav-active
                              role="tab"
                              aria-controls="tabs-home"
                              aria-selected="true"
                            >
                              paid
                            </a>
                          </li>
                          <li
                            role="presentation "
                            className="list-none ms-5 w-[68px]"
                          >
                            <a
                              href="#tabs-profile"
                              className="mt-2 block border-x-0 border-b-4 border-t-0 border-transparent pb-2 pt-4 text-[16px] font-[500] capitalize leading-tight text-neutral-500  hover:border-transparent focus:isolate focus:border-transparent data-[te-nav-active]:border-primary data-[te-nav-active]:text-primary dark:text-neutral-400 dark:hover:bg-transparent dark:data-[te-nav-active]:border-primary-400 dark:data-[te-nav-active]:text-primary-400"
                              data-te-toggle="pill"
                              data-te-target="#tabs-profile"
                              role="tab"
                              aria-controls="tabs-profile"
                              aria-selected="false"
                            >
                              unpaid
                            </a>
                          </li>
                        </ul>
                        <div className="bg-[#1B75BC0D]">
                          <div
                            className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block max-h-[300px] overflow-y-auto"
                            id="tabs-home"
                            role="tabpanel"
                            aria-labelledby="tabs-home-tab"
                            data-te-tab-active
                          >
                            {allPaidOrdersAlternatively.length == 0 ? (
                              <div className="text-sm text-gray-500 py-3 text-center">
                                There ara no paid services yet
                              </div>
                            ) : (
                              allPaidOrdersAlternatively.map((ele, index) => (
                                <>
                                  <Link to={`/chat?orderId=${ele._id}`}>
                                    <div
                                      key={index}
                                      className={`flex items-center justify-between  border-b-2 py-3 px-5 ${
                                        ele.unSeenStyle ? "bg-[#1b76bb26]" : ""
                                      }`}
                                      onClick={openCustomDropDawn}
                                    >
                                      <div className="flex">
                                        <img
                                          className="h-12 w-12 rounded-full"
                                          src={
                                            globalUrl +
                                            ele?.service?.defaultLargeImage
                                          }
                                          alt="Your Alt Text"
                                        />
                                        <div className="ml-2">
                                          <div className="capitalize break-words tracking-wide text-[16px] mb-1  text-main-color font-[400]">
                                            {ele.title.slice(0, 15)}
                                            {ele.title.length > 15 && (
                                              <button> ...</button>
                                            )}
                                          </div>
                                          <p className="capitalize tracking-wide text-[12px] text-[#979899]">
                                            {!ele.lastMessage &&
                                              ele.status !== "completed" &&
                                              "Tab To Chat..!"}
                                            {!ele.lastMessage?.isFromAdmin &&
                                              ele.status !== "completed" &&
                                              ele.lastMessage &&
                                              "you: "}

                                            {ele.status !== "completed"
                                              ? ele.lastMessage?.content.slice(
                                                  0,
                                                  20
                                                )
                                              : "Click View history"}
                                            {ele.lastMessage?.content.length >
                                              20 && <button>...</button>}
                                          </p>
                                        </div>
                                      </div>
                                      <div className=" capitalize tracking-wide text-[12px] text-[#979899]">
                                        <p>
                                          {new Date(
                                            ele?.createdAt
                                          ).toDateString()}
                                        </p>
                                        <p
                                          className={` ${
                                            ele?.unSeenStyle
                                              ? "bg-main-color w-[13px] h-[13px] rounded-full text-white grid place-content-center mt-2 ms-auto"
                                              : "hidden"
                                          }  `}
                                        ></p>
                                      </div>
                                    </div>
                                  </Link>
                                </>
                              ))
                            )}
                          </div>
                          <div
                            className="hidden opacity-100 transition-opacity duration-150 ease-linear data-[te-tab-active]:block max-h-[300px] overflow-y-auto"
                            id="tabs-profile"
                            role="tabpanel"
                            aria-labelledby="tabs-profile-tab"
                          >
                            {unPaidOrders.length == 0 ? (
                              <div className="text-sm text-gray-500 py-3 text-center">
                                There are no unpaid services yet
                              </div>
                            ) : (
                              unPaidOrders.map((ele, index) => (
                                <>
                                  <Link to={`/order/${ele._id}`}>
                                    <div
                                      key={index}
                                      className={`flex items-center justify-between  border-b-2 py-3 px-5 `}
                                      onClick={openCustomDropDawn}
                                    >
                                      <div className="flex">
                                        <img
                                          className="h-12 w-12 rounded-full"
                                          src={
                                            globalUrl +
                                            ele?.service?.defaultLargeImage
                                          }
                                          alt="Your Alt Text"
                                        />
                                        <div className="ml-2">
                                          <div className="capitalize break-words tracking-wide text-[16px] mb-1  text-main-color font-[400]">
                                            {ele.title.slice(0, 20)}
                                            {ele.title.length > 20 && (
                                              <button> ...</button>
                                            )}
                                          </div>
                                          <p className="capitalize tracking-wide text-[12px] text-[#979899]">
                                            {"Pay Now To Chat..!"}
                                          </p>
                                        </div>
                                      </div>
                                      <div className=" capitalize tracking-wide text-[12px] text-[#979899]">
                                        <p>
                                          {new Date(
                                            ele?.createdAt
                                          ).toDateString()}
                                        </p>
                                      </div>
                                    </div>
                                  </Link>
                                </>
                              ))
                            )}
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className="relative  " ref={dropDawnProfileRef}>
                  <span
                    className="flex items-center cursor-pointer"
                    onClick={() => {
                      setOpenProfileDropDown(!openProfileDropDown);
                    }}
                  >
                    <b
                      className={`mx-3 userName ${
                        scrolling || location.pathname !== "/"
                          ? " text-main-color "
                          : " text-white"
                      }`}
                    >
                      {`${user?.firstName} ${user?.lastName}`}
                    </b>
                    <img
                      src={
                        user.profilePic
                          ? globalUrl + user.profilePic
                          : defaultProfilePicture
                      }
                      className="h-8 w-8 rounded-full  "
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  {openProfileDropDown && (
                    <>
                      <div
                        className="triangle-up absolute top-[45px] w-0 h-0 right-[30px]"
                        style={{
                          borderLeft: "10px solid transparent",
                          borderRight: "10px solid transparent",
                          borderBottom: "18px solid #ffffff",
                        }}
                      ></div>
                      <div className="p-4 absolute  left-[-4rem] bg-white w-[250px] text-black rounded-md shadow-md top-[60px]">
                        <div className="grid grid-cols-1 divide-y">
                          {/*<Link
                            to={"/dashbord"}
                            className="font-body border-main-color p-1 w-fit rounded-md text-main-color mb-2 cursor-pointer text-sm  tracking-wider"
                            style={{
                              border: "1px dashed",
                            }}
                          >
                            Dashboard
                          </Link>*/}
                          <Link
                            to={"/orders"}
                            className="py-2 cursor-pointer text-sm font-body  tracking-wider"
                          >
                            Orders
                          </Link>
                          {/*<Link
                            to={"/Payment"}
                            className="py-2 cursor-pointer text-sm font-body  tracking-wider"
                          >
                            Payment Methods
                          </Link>*/}
                          {/*<Link
                            to="/profile"
                            className="py-2 cursor-pointer text-sm font-body tracking-wider"
                          >
                            Account Details
                        </Link>*/}
                          <Link
                            to={"/"}
                            className="pt-2 cursor-pointer text-sm font-body  tracking-wider"
                            onClick={() => {
                              Cookies.remove("token");
                              localStorage.removeItem("authenticated");
                              dispatch(ResetRedux());
                            }}
                          >
                            Logout
                          </Link>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : null}

            {!isLogin && (
              <Link to="/ContactUs">
                <button className="lg:hidden bg-main-color rounded-[3rem] text-white flex items-center text-center px-4 w-[180px] py-3 sm:w-fit text-[13px] sm:text-[18px]">
                  Request a Service
                  <FontAwesomeIcon icon={faArrowRight} className="ml-3" />
                </button>
              </Link>
            )}
            <div className="lg:hidden flex  items-center ">
              <FontAwesomeIcon
                icon={faBars}
                className={`cursor-pointer rotate-180  text-3xl text-main-color`}
                onClick={() => setMobileMenuOpen(true)}
              />
            </div>
          </div>
        </div>
      </div>
      <div
        className={`app__navbar-menu md:flex ${mobileMenuOpen ? "open" : ""} `}
      >
        {mobileMenuOpen && (
          <span
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="absolute top-2 left-0 bg-[#000000cf] w-[100%] h-screen lg:hidden"
          />
        )}

        <motion.div
          className="bg-white relative "
          style={{ padding: "0" }}
          initial={{ x: "-100%" }}
          animate={{ x: mobileMenuOpen ? "0" : "-100%" }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          <FontAwesomeIcon
            icon={faTimes}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="absolute right-2 top-4  p-5 text-gray-600"
          />
          <img
            src={images.logo}
            alt="logo"
            className="self-center ps-5 mt-6 mr-auto"
          />
          <ul className="pt-8 ">
            {Links.map((link, index) => (
              <motion.li
                className="w-full text-left xs:text-[12px]  "
                style={{
                  borderBottom: "3px solid #ededed",
                  margin: " 0",
                  padding: "1rem 0",
                }}
                key={index}
                whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link
                  className=" ps-5   hover:text-blue-400 xs:text-[12px] "
                  to={link.linkTo}
                  style={{
                    textTransform: "capitalize",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.item}
                </Link>
              </motion.li>
            ))}
            {!isLogin && (
              <motion.li
                className="w-full text-left  "
                style={{
                  borderBottom: "3px solid #ededed",
                  margin: " 0",
                  padding: "1.2rem 0",
                }}
                whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                transition={{ duration: 0.4, delay: 6 * 0.1 }}
              >
                <Link
                  className="xs:text-md sm:text-lg ps-5   hover:text-blue-400 "
                  to={"/signin"}
                  style={{
                    textTransform: "capitalize",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
              </motion.li>
            )}
            {isLogin && (
              <motion.li
                className="w-full text-left  "
                style={{
                  borderBottom: "3px solid #ededed",
                  margin: " 0",
                  padding: "1.2rem 0",
                }}
                whileInView={{ x: [-100, 0], opacity: [0, 1] }}
                transition={{ duration: 0.4, delay: 6 * 0.1 }}
              >
                <Link
                  className="xs:text-md sm:text-lg ps-5   hover:text-blue-400 "
                  to="/ContactUs"
                  style={{
                    textTransform: "capitalize",
                    fontWeight: "600",
                    fontSize: "14px",
                  }}
                >
                  Request a service
                </Link>
              </motion.li>
            )}
            {isLogin ? (
              <div className="w-full flex-1 flex items-end">
                <div className="flex items-center mr-5">
                  <img
                    className="h-12 w-12 rounded-full mr-3"
                    src="https://mdbootstrap.com//img/Photos/Square/1.jpg"
                    alt="Your Alt Text"
                  />
                  <span className="font-bold text-main-color ">
                    {`${user?.firstName} ${user?.lastName}`}
                  </span>
                </div>
                <Link
                  to={"/"}
                  onClick={() => {
                    Cookies.remove("token");
                    dispatch(ResetRedux());
                    localStorage.removeItem("authenticated");
                  }}
                  type="button"
                  className="inline-block  bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] rounded-lg"
                >
                  Logout
                </Link>
              </div>
            ) : (
              <div className="w-full flex-1 flex flex-col items-center justify-end">
                <Link to="/signUp" className="w-full flex justify-center">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-[90%] m-auto rounded-[3rem] px-4 py-2 my-2 text-white bg-main-color "
                  >
                    Sign Up
                  </button>
                </Link>
              </div>
            )}
          </ul>
        </motion.div>
      </div>
    </nav>
  );
}

export default NavBar;
