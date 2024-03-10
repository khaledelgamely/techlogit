/* eslint-disable react/no-unescaped-entities */
import {
  faArrowLeft,
  faChevronDown,
  faChevronUp,
  faCircleExclamation,
  faFileAlt,
  faMagnifyingGlass,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Dialog, Transition } from "@headlessui/react";
import parse from "html-react-parser";
import { Fragment, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { TECollapse } from "tw-elements-react";
import { v4 as uuidv4 } from "uuid";
import Tech_Logit, { globalUrl } from "../../API/config";
import { images } from "../../constants/index";
import { removeUnseen } from "../../store/Slices/userSlice";

import Icon from "../../Icon/index.jsx";
import {
  ThreeDotsIcon,
  FileAndLinkIcon,
  GraterThanIcon,
  PersonalsNotepadIcon,
  SearchIcon,
  SendFileAndLinkIcon,
  SendMessageIcon,
} from "../../Icon/Icons/index.jsx";
const Modal = ({ imageUrl, onClose }) => {
  const handleBackgroundClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-[999999]"
      onClick={handleBackgroundClick}
    >
      <div className="relative w-3/4 max-w-2xl mx-auto bg-white p-2 rounded-lg shadow-lg h-[70%]">
        <img
          className="rounded-lg object-contain w-full h-full max-h-70vh"
          src={imageUrl}
          alt="Modal"
        />
      </div>
    </div>
  );
};

function Chat() {
  const { user } = useSelector((state) => state.user);
  const [userConversations, setConversations] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [messages, setMessages] = useState([]);
  const [open, setOpen] = useState(false);
  const cancelButtonRef = useRef(null);
  const [currentChat, setCurrentChat] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [orderId, setOrderId] = useState(null);
  const [showDiv, setShowDiv] = useState(false);
  const [message, setMessage] = useState("");
  const [chatFiles, setChatFiles] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [response, setResponse] = useState("");
  const [conversationsLoading, setConversationsLoading] = useState(false);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const dispatch = useDispatch();
  const [cuurentHeighligth, SetCuurentHeighligth] = useState(null);
  const [scrollInSocket, setScrollInSocket] = useState(false);
  let previousSenderId = null;

  const [modalImage, setModalImage] = useState(null);

  const [openFileModal, setOpenFileModal] = useState(false);
  const modalContentRef = useRef(null);

  const handleClickOutside = (event) => {
    if (
      modalContentRef.current &&
      !modalContentRef.current.contains(event.target)
    ) {
      setOpenFileModal(false);
    }
  };

  const openImageModal = (imageUrl) => {
    setModalImage(imageUrl);
  };

  const closeImageModal = () => {
    setModalImage(null);
  };
  const socket = useSelector((state) => {
    return state.user?.socket;
  });
  function closeModal() {
    setOpen(false);
  }

  function openModal() {
    setOpen(true);
  }
  const lastMessageRef = useRef(null);
  const lastMessageObjectRef = useRef(null);
  let matchingMessageCount = [];
  const currentChatRef = useRef(null);
  const userConversationsRef = useRef([]);
  const messagesFromDb = useRef([]);
  const lastDay = useRef(new Date());
  const todaysDate = useRef(new Date());
  const messagesPages = useRef(1);
  const messagesPerPage = 7;
  const [start, setStart] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  useEffect(() => {
    const topOfPage = document.documentElement;
    topOfPage.scrollIntoView({ behavior: "smooth" });
  }, []);

  //---------------------------------------------------Adding notes---------------------------------------------------
  const [note, setNote] = useState("");
  const [notes, setNotes] = useState([]);
  const handleSendNote = async (conv_Id) => {
    if (note != "") {
      try {
        userConversationsRef.current?.forEach((item) => {
          if (item?._id === conv_Id) {
            item.userNotes.push(note);
          }
        });
        setConversations([...userConversationsRef.current]);
        await Tech_Logit.post(
          `conversations/${user?._id}/notes/${conv_Id}`,
          { content: note },
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        setNotes([...notes, note]);
        setNote("");
      } catch (err) {
        console.log(err);
      }
    }
  };
  //-----------------------------------------------------------------------------------------------

  const unseenConvo = useSelector((state) => {
    return state.user?.unseen;
  });

  const handleImageSelect = (event) => {
    const fileInput = event.target;
    const files = fileInput.files;

    if (files.length > 0) {
      const image = files[0];
      setSelectedImage(image);
    }
    scrollMessage?.current?.scrollTo({
      top: scrollMessage?.current?.scrollHeight,
    });
  };

  const handleSendMessage = async () => {
    const temporaryMessage = {
      _id: new Date().getTime(),
      content: message,
      isFromAdmin: false,
      profilePic: user?.profilePic,
      conversation: currentChat?._id,
      msgType: "text",
      sender: { _id: user?._id },
      createdAt: Date.now(),
      status: "sending",
    };
    if (
      !areDatesOnSameDay(
        new Date(lastMessageObjectRef.current?.createdAt),
        new Date()
      )
    ) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { content: "diff", date: "Today" },
        temporaryMessage,
      ]);
      lastDay.current = new Date();
    } else {
      setMessages((prevMessages) => [...prevMessages, temporaryMessage]);
    }
    setMessage("");
    lastMessageObjectRef.current = temporaryMessage;
    try {
      const formData = new FormData();
      formData.append("content", message);
      formData.append("conversation", currentChat?._id);
      formData.append("msgType", "text");
      formData.append("sender", user?._id);
      const newConvos = userConversationsRef.current.map((conversation) => {
        if (conversation?._id === currentChat?._id) {
          return {
            ...conversation,
            lastMessage: {
              content: message,
              isFromAdmin: false,
            },
            lastMessageOn: Date.now(),
          };
        }
        return conversation;
      });
      setConversations((prev) =>
        prev.map((conversation) => {
          if (conversation?._id === currentChat?._id) {
            return {
              ...conversation,
              lastMessage: {
                content: message,
                isFromAdmin: false,
              },
              lastMessageOn: Date.now(),
            };
          }
          return conversation;
        })
      );
      userConversationsRef.current = [...newConvos];
      const response = await Tech_Logit.post(
        `/messages/${user?._id}`,
        formData
      );

      setResponse(response.data);
      socket?.emit("sendMessageToAdmins", {
        message: response.data,
      });
    } catch (error) {
      console.error("Error sending data:", error);
      setMessages((prevMessages) =>
        prevMessages.map((msg) =>
          msg?._id === temporaryMessage?._id
            ? { ...msg, status: "failed" }
            : msg
        )
      );
    }
  };
  useEffect(() => {
    socket?.on("getMessageFromAdmin", (message) => {
      const openConversation = async (message) => {
        lastMessageRef.current = message?._id;
        let isExists = false;
        userConversationsRef.current?.forEach((conversation) => {
          if (conversation?._id == message.conversation) {
            isExists = true;
          }
        });
        if (isExists) {
          if (currentChatRef.current?._id == message.conversation) {
            if (
              !areDatesOnSameDay(
                new Date(lastMessageObjectRef.current?.createdAt),
                new Date()
              )
            ) {
              setMessages((prevMessages) => [
                ...prevMessages,
                { content: "diff", date: "Today" },
                message,
              ]);
              lastDay.current = new Date();
            } else {
              setMessages((prevMessages) => [...prevMessages, message]);
            }

            lastMessageObjectRef.current = message;
            let newConversations = userConversationsRef.current?.map(
              (conversation) => {
                if (conversation?._id == message.conversation) {
                  conversation.lastMessage = {
                    content:
                      message.msgType === "text"
                        ? message.content
                        : message.msgType,
                    isFromAdmin: true,
                  };
                  conversation.lastMessageOn = Date.now();
                }
                return conversation;
              }
            );
            setConversations([...newConversations]);
            userConversationsRef.current = [...newConversations];
            Tech_Logit.patch("conversations/" + user?._id, {
              convId: message.conversation,
            });
            dispatch(removeUnseen(message.conversation));
          } else {
            let newConversations = userConversationsRef.current?.map(
              (conversation) => {
                if (conversation?._id == message.conversation) {
                  conversation.lastMessage = {
                    content:
                      message.msgType === "text"
                        ? message.content
                        : message.msgType,
                    isFromAdmin: true,
                  };
                  conversation.lastMessageOn = Date.now();
                }
                return conversation;
              }
            );
            setConversations([...newConversations]);
            userConversationsRef.current = [...newConversations];
          }
        } else {
          try {
            const res = await Tech_Logit.get("conversations/" + user?._id);
            const newConvos = res.data.data.sort(
              (a, b) => new Date(b.lastMessageOn) - new Date(a.lastMessageOn)
            );
            setConversations([...newConvos]);
            userConversationsRef.current = [...newConvos];
          } catch (err) {
            console.log(err);
          }
        }
      };
      setScrollInSocket(true);

      if (
        lastMessageRef.current != message?._id &&
        window.location.href.includes("chat")
      ) {
        openConversation(message);
      }
    });
  }, [socket]);

  const handleSendImage = async () => {
    try {
      const formData = new FormData();
      // Add the text message to the FormData
      formData.append("conversation", currentChat?._id);
      if (selectedImage.type.includes("image")) {
        formData.append("msgType", "image");
      } else {
        formData.append("msgType", "file");
      }
      formData.append("sender", user?._id);
      // formData.append('sender', '6513344eafc6365da4324162');
      // Add the image to the FormData if an image is selected
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await Tech_Logit.post(
        `/messages/${user?._id}`,
        formData
      );
      let newConversations = userConversationsRef.current?.map(
        (conversation) => {
          if (conversation?._id == currentChat?._id) {
            conversation.lastMessage = {
              content: selectedImage.type.includes("image") ? "image" : "file",
              isFromAdmin: false,
            };
            conversation.lastMessageOn = Date.now();
          }
          return conversation;
        }
      );
      setConversations([...newConversations]);
      userConversationsRef.current = [...newConversations];
      socket?.emit("sendMessageToAdmins", {
        message: response.data,
      });
      if (
        !areDatesOnSameDay(
          new Date(lastMessageObjectRef.current?.createdAt),
          new Date()
        )
      ) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { content: "diff", date: "Today" },
          response.data,
        ]);
        lastDay.current = new Date();
      } else {
        setMessages((prevMessages) => [...prevMessages, response.data]);
      }
      lastMessageObjectRef.current = response.data;
      setMessage("");
      // Handle the API response as needed
      setResponse(response.data);
    } catch (error) {
      console.error("Error sending data:", error);
    }
    scrollMessage?.current?.scrollTo({
      top: scrollMessage?.current?.scrollHeight,
    });
    setNewMessage(!newMessage);
  };

  const divRef = useRef(null);
  const navigate = useNavigate();
  const scrollMessage = useRef(null);
  useEffect(() => {
    const getConversations = async () => {
      try {
        setConversationsLoading(true);
        const res = await Tech_Logit.get("conversations/" + user?._id);
        setConversationsLoading(false);
        setStart(true);
        const convosFromDb = res?.data?.data?.sort(
          (a, b) => new Date(b.lastMessageOn) - new Date(a.lastMessageOn)
        );
        setConversations([...convosFromDb]);
        userConversationsRef.current = [...convosFromDb];
      } catch (err) {
        console.log(err);
      }
    };
    user?._id && getConversations();
  }, [user?._id]);

  // select each section in order to hide and show it
  const conversitions = useRef(null);
  const conversition = useRef(null);
  const conversition_information = useRef(null);

  // function to back to conversitions section
  const backToConversitions = () => {
    if (conversition?.current != null) {
      conversition.current.classList.add("xs:hidden", "md:block");
      conversitions.current.classList.remove("xs:hidden");
    }
  };
  // function to open chat section
  const openChat = (conv) => {
    lastDay.current = new Date();
    if (conversitions?.current != null) {
      conversitions?.current?.classList.add("xs:hidden", "md:block");
      conversition?.current?.classList.remove("xs:hidden");
    }
    navigate(`?orderId=${conv?.order?._id}`);
    setCurrentChat(conv);
    currentChatRef.current = conv;
    conv?.userNotes && setNotes([...conv.userNotes]);
    setShowDiv(true);
    setSearchKeyword("");
    setNote("");
    setMessage("");
    try {
      Tech_Logit.patch("conversations/" + user?._id, {
        convId: conv._id,
      });
      dispatch(removeUnseen(conv?._id));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        let newMessages = [];
        messagesFromDb.current = [];
        lastDay.current = new Date();
        setMessages([]);
        setMessagesLoading(true);
        const res = await Tech_Logit.get(
          `messages/${user?._id}/${currentChat?._id}`
          // `messages/${currentChat?._id}?limit=10&page=${page}`
        );
        setMessagesLoading(false);
        if (res?.data?.data?.length != 0 &&
          res?.data?.conversation == currentChatRef.current?._id) {
          messagesFromDb.current = res.data.data.sort(
            (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          );
          lastMessageObjectRef.current =
            messagesFromDb.current[messagesFromDb.current.length - 1];
          if (messagesFromDb.current.length <= messagesPerPage) {
            newMessages = [...messagesFromDb.current];
            messagesFromDb.current = [];
          } else {
            newMessages = [
              ...messagesFromDb.current.slice(
                messagesFromDb.current.length - messagesPerPage,
                messagesFromDb.current.length
              ),
            ];
            messagesFromDb.current.splice(
              messagesFromDb.current.length - messagesPerPage,
              messagesFromDb.current.length
            );
          }
          const reversedArray = [...newMessages].reverse();
          lastDay.current = new Date(reversedArray[0].createdAt);
          reversedArray.forEach((message) => {
            if (
              !areDatesOnSameDay(new Date(message.createdAt), lastDay.current)
            ) {
              const indexToAdd = newMessages.findIndex(
                (obj) => obj._id === message._id
              );
              newMessages.splice(indexToAdd + 1, 0, {
                content: "diff",
                date: checkDay(lastDay.current),
              });
              lastDay.current = new Date(message.createdAt);
            }
          });
          if (messagesFromDb.current.length == 0) {
            for (const message of newMessages) {
              if (message._id !== undefined) {
                newMessages.unshift({
                  content: "diff",
                  date: checkDay(new Date(message.createdAt)),
                });
                break;
              }
            }
          }
          setMessages((prevMessages) => [...newMessages, ...prevMessages]);
          // setMessages([...messagesFromDb.current]);
        }
      } catch (err) {
        console.log(err);
      }
    };
    if (currentChat != null) getMessages();
  }, [currentChat, user?._id]);

  const handleScroll = () => {
    if (
      scrollMessage.current.scrollTop === 0 &&
      messagesFromDb.current.length !== 0
    ) {
      let newMessages = [];
      messagesPages.current += 1;
      if (messagesFromDb.current.length <= messagesPerPage) {
        newMessages = [...messagesFromDb.current];
        messagesFromDb.current = [];
      } else {
        newMessages = [
          ...messagesFromDb.current.slice(
            messagesFromDb.current.length - messagesPerPage,
            messagesFromDb.current.length
          ),
        ];
        messagesFromDb.current.splice(
          messagesFromDb.current.length - messagesPerPage,
          messagesFromDb.current.length
        );
      }
      const reversedArray = [...newMessages].reverse();
      lastDay.current = new Date(reversedArray[0].createdAt);
      reversedArray.forEach((message) => {
        if (!areDatesOnSameDay(new Date(message.createdAt), lastDay.current)) {
          const indexToAdd = newMessages.findIndex(
            (obj) => obj._id === message._id
          );
          newMessages.splice(indexToAdd + 1, 0, {
            content: "diff",
            date: checkDay(lastDay.current),
          });
          lastDay.current = new Date(message.createdAt);
        }
      });
      if (messagesFromDb.current.length == 0) {
        for (const message of newMessages) {
          if (message._id !== undefined) {
            newMessages.unshift({
              content: "diff",
              date: checkDay(new Date(message.createdAt)),
            });
            break;
          }
        }
      }
      setMessages((prevMessages) => [...newMessages, ...prevMessages]);
    }
  };
  const checkDay = (messageOn) => {
    if (isToday(messageOn)) {
      // Less than a day ago
      return `Today`;
    } else if (isYesterday(messageOn)) {
      // Yesterday
      return "Yesterday";
    } else if (isThisWeek(messageOn)) {
      // This week
      return `${messageOn.toLocaleDateString([], {
        weekday: "short",
      })}`;
    } else {
      const month = new Intl.DateTimeFormat("en-US", {
        month: "short",
      }).format(messageOn);
      // Earlier than a week
      return `${messageOn.getDate()}/${month}/${messageOn.getFullYear()}`;
    }
  };
  function areDatesOnSameDay(date1, date2) {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }
  // function to open information chat section
  const openInformationChat = () => {
    if (conversition_information?.current != null) {
      conversition_information.current.classList.remove("xs:hidden");
      conversition.current.classList.add("xs:hidden", "md:hidden", "xl:block");
      conversitions.current.classList.add("xs:hidden");
    }
  };
  // function to back to conversition section
  const backToConversition = () => {
    if (conversition_information?.current != null) {
      conversition_information.current.classList.add("xs:hidden");
      conversition.current.classList.remove("xs:hidden", "md:hidden");
      conversitions.current.classList.add("md:block");
    }
  };

  // function to open and close  accordion in information chat section
  const [activeElement, setActiveElement] = useState("");
  const handleClick = (value) => {
    if (value === activeElement) {
      setActiveElement("");
    } else {
      setActiveElement(value);
    }
  };

  //--------------------------------------------------check if the conversation of the order found or not-----------------------
  const urlParamsss = new URLSearchParams(window.location.search);
  useEffect(() => {
    const getOrder = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const orderId = urlParams.get("orderId");
      setOrderId(orderId);
      const foundOrder = user?.orders?.find((order) => order?._id === orderId);
      if (!foundOrder && orderId) navigate("*");
    };
    user?._id && getOrder();
  }, [user?._id, urlParamsss]);
  useEffect(() => {
    const findConv = () => {
      if (orderId != null) {
        let foundConversation;
        userConversationsRef.current?.forEach((item) => {
          if (item?.order?._id === orderId && item.client === user?._id) {
            foundConversation = item;
          }
        });
        if (foundConversation) {
          openChat(foundConversation);
        } else {
          const createConverstation = async () => {
            try {
              const res = await Tech_Logit.post(`conversations/${user?._id}`, {
                order: orderId,
              });
              setConversations((prev) => [res.data, ...prev]);
              userConversationsRef.current = [
                res.data,
                ...userConversationsRef.current,
              ];
              openChat(res.data);
            } catch (err) {
              console.log(err);
            }
          };
          createConverstation();
        }
      }
    };
    start && findConv();
  }, [orderId, start]);

  //-------------------------------------------------------------------------------------------------------------------------------
  useEffect(() => {
    const lastIndex = messages.findIndex((message) => {
      if (message.seen === false) {
        return true; // Stop searching when the condition is met
      }
      return false;
    });
    // Scroll to the bottom smoothly if there's a message with status === false
    if (divRef.current && lastIndex !== -1) {
      const lastMessage = divRef?.current?.children[lastIndex + 1];
      scrollMessage?.current?.scrollTo({
        top: 400,
      });
    } else {
      if (messages.length === 7) {
        scrollMessage?.current?.scrollTo({
          top: scrollMessage?.current?.scrollHeight,
        });
      } else {
        scrollMessage?.current?.scrollTo({
          top: 400,
        });
      }
    }
  }, [messages]);
  useEffect(() => {
    if (selectedImage) {
      // If selectedImage has a value (i.e., an image is selected), execute handleSendImage
      handleSendImage();
    }
  }, [selectedImage]);

  const handleSearchChange = (e) => {
    // Set a new typingTimeout to perform search after a delay
    setSearchKeyword(e.target.value);
    SetCuurentHeighligth(null);
    setIndexSearch(0);
  };

  const [indexSearch, setIndexSearch] = useState(0);
  const arrowDown = () => {
    if (indexSearch < matchingMessageCount.length) {
      const newIndexSearch = indexSearch + 1;
      const lastMessage =
        divRef?.current?.children[matchingMessageCount[newIndexSearch - 1]];
      scrollMessage?.current?.scrollTo({
        top: lastMessage?.offsetTop - 100,
        behavior: "smooth",
      });
      setIndexSearch(newIndexSearch);
      SetCuurentHeighligth(matchingMessageCount[newIndexSearch - 1]);
    } else if (indexSearch === matchingMessageCount.length) {
      // If at the last index, wrap around to index 1
      const firstMessage = divRef?.current?.children[matchingMessageCount[0]];
      scrollMessage?.current?.scrollTo({
        top: firstMessage?.offsetTop - 100,
        behavior: "smooth",
      });
      setIndexSearch(1); // Start at index 1
      SetCuurentHeighligth(matchingMessageCount[0]);
    }
  };

  const arrowUp = () => {
    if (indexSearch > 1) {
      const newIndexSearch = indexSearch - 1;
      const lastMessage =
        divRef?.current?.children[matchingMessageCount[newIndexSearch - 1]];
      scrollMessage?.current?.scrollTo({
        top: lastMessage?.offsetTop - 100,
        behavior: "smooth",
      });
      setIndexSearch(newIndexSearch);
      SetCuurentHeighligth(matchingMessageCount[newIndexSearch - 1]);
    } else if (indexSearch === 1) {
      // If at index 1, wrap around to the last index
      const lastIndex = matchingMessageCount.length - 1;
      const lastMessage =
        divRef?.current?.children[matchingMessageCount[lastIndex]];
      scrollMessage?.current?.scrollTo({
        top: lastMessage?.offsetTop - 100,
        behavior: "smooth",
      });
      setIndexSearch(lastIndex + 1); // Start at the last index
      SetCuurentHeighligth(matchingMessageCount[lastIndex]);
    }
  };

  function isToday(date) {
    return (
      date.getDate() === todaysDate.current.getDate() &&
      date.getMonth() === todaysDate.current.getMonth() &&
      date.getFullYear() === todaysDate.current.getFullYear()
    );
  }

  function isThisWeek(date) {
    const oneWeekAgo = new Date(todaysDate.current);
    oneWeekAgo.setDate(todaysDate.current.getDate() - 7);

    return date >= oneWeekAgo && date < todaysDate.current;
  }

  function isYesterday(date) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return (
      date.getDate() === yesterday.getDate() &&
      date.getMonth() === yesterday.getMonth() &&
      date.getFullYear() === yesterday.getFullYear()
    );
  }

  function formatDate(date) {
    const day = date.getDate();
    const month = date.getMonth() + 1; // Months are 0-based, so add 1
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }
  useEffect(() => {
    if (matchingMessageCount.length === 0) {
      setIndexSearch(0);
      SetCuurentHeighligth(null);
    }
  }, [matchingMessageCount]);
  function getReadmeFileNameFromUrl(url) {
    const parts = url.split("/");
    const fileName = parts[parts.length - 1];

    // Split the last part by underscores to get "README.md"
    const fileNameParts = fileName.split("_");
    const readmeFileName = fileNameParts[fileNameParts.length - 1];

    return readmeFileName;
  }
  const openFilesChat = async (e) => {
    if (e.target.tagName.toLowerCase() == "button") {
      try {
        const res = await Tech_Logit.get(
          `messages/${user?._id}/getFiles/${currentChat?._id}`
        );
        if (res?.data?.length != 0) {
          setChatFiles(
            res.data.sort(
              (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
            )
          );
        }
        setOpenFileModal(true);
      } catch (err) {
        console.log(err);
      }
    }
  };
  useEffect(() => {
    scrollMessage?.current?.scrollTo({
      top: scrollMessage?.current?.scrollHeight,
    });
  }, [newMessage]);
  useEffect(() => {
    if (scrollInSocket) {
      scrollMessage?.current?.scrollTo({
        top: scrollMessage?.current?.scrollHeight,
      });
      setScrollInSocket(false);
    }
  }, [messages]);
  return (
    <div className=" bg-chat h-[calc(100vh-65px)] bg-cover  grid grid-cols-12 xs:gap-5 sm:gap-5 lg:gap-8 p-0 pt-5  md:p-7  px-15 mt-[65px]">
      {conversationsLoading ? (
        <>
          {/* part one */}
          <div className="conversations max-h-full overflow-hidden rounded-2xl xs:col-span-12 md:col-span-4 lg:col-span-5 xl:col-span-3 bg-white">
            <div className="relative rounded-3xl shadow-sm drop-shadow-smooth p-3 bg-gray-200">
              <div className="py-3 px-10 pr-4 h-full w-full rounded-3xl focus:outline-none focus:ring-2 focus:ring-gray-300 focus:border-gray-300"></div>
            </div>
            <div className="h-full max-h-[90%] overflow-hidden m-auto mt-1 pt-2 rounded-3xl shadow-sm drop-shadow-smooth bg-white w-[98%]">
              <div className="min-h-full">
                {Array(7)
                  .fill(
                    <div className="bg-gray-200 animate-pulse p-4 cursor-pointer">
                      <div className="grid grid-cols-10">
                        <div className="flex items-center space-x-3 col-span-7">
                          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                          <div className="w-full">
                            <div className="w-4/5 h-4 bg-gray-300 mb-2"></div>
                            <div className="w-3/4 h-4 bg-gray-300"></div>
                          </div>
                        </div>
                        <div className="flex items-end justify-center flex-col col-span-3">
                          <div className="w-10 h-4 bg-gray-300 mb-2"></div>
                          <div className="w-3 h-3 bg-gray-300 rounded-full"></div>
                        </div>
                      </div>
                      <hr className="w-4/5 h-0.5 mt-3 bg-gray-300 mx-auto" />
                    </div>
                  )
                  .map((item, index) => (
                    <div key={index}>{item}</div>
                  ))}
              </div>
            </div>
          </div>
          {/* part two */}
          <div
            ref={conversition}
            className="xs:hidden md:block conversition max-h-full overflow-hidden col-span-12 md:col-span-8 lg:col-span-7 xl:col-span-6"
          >
            <div className="flex items-center justify-between pe-7 cursor-pointer">
              <div className="flex items-center space-x-4 col-span-7 ms-3">
                <div
                  className="chat__previous flex md:hidden"
                  onClick={backToConversitions}
                >
                  <FontAwesomeIcon
                    className="text-icon w-6 h-6"
                    icon={faArrowLeft}
                  />
                </div>
                <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                <div className="font-medium flex justify-center items-center dark:text-white truncate">
                  <div className="me-2 font-semibold w-20 bg-gray-300 h-5 rounded-full"></div>
                  <div className="bg-green-400 rounded-full w-2 h-2"></div>
                </div>
              </div>
              <Icon SvgIcon={ThreeDotsIcon} onClick={openInformationChat} />
            </div>
            <div className="h-full max-h-[90%] relative overflow-hidden m-auto mt-3 p-3 pt-7 rounded-3xl shadow-sm drop-shadow-smooth bg-white w-[98%]">
              <div
                className="h-[85%] overflow-hidden m-auto mt-5 px-3 w-[98%]"
                ref={scrollMessage}
              >
                <div className="min-h-full w-full">
                  {Array(4)
                    .fill(
                      <div className="p-4">
                        <div className="flex space-x-4">
                          <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                          <div className="w-2/3 bg-gray-300 h-6 rounded-full"></div>
                        </div>
                        <div className="w-3/4 h-4 mt-2 bg-gray-300 rounded-full"></div>
                        <div className="w-4/5 h-4 mt-2 bg-gray-300 rounded-full"></div>
                      </div>
                    )
                    .map((item, index) => (
                      <div key={index}>{item}</div>
                    ))}
                </div>
              </div>
              <div className="pt-2 sm:mb-0">
                <div className="relative flex items-center">
                  <div className="w-[90%] m-auto h-12 mt-2 bg-gray-300 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <div
            ref={conversitions}
            className=" conversitions max-h-[100%] overflow-hidden  rounded-2xl xs:col-span-12  md:col-span-4 lg:col-span-5 xl:col-span-3"
          >
            {/* // section search with icon */}
            <div className="relative  rounded-3xl  shadow-sm drop-shadow-smooth p-2 ">
              <input
                type="text"
                onChange={(e) => setFilterValue(e.target.value)}
                className=" py-3 px-10 pr-4 main-color h-full w-full rounded-3xl  focus:outline-none focus:ring-2 focus:ring-main-color focus:border-main-color "
                placeholder="Search ...."
              />
              <div className="absolute inset-y-0 left-3 pl-3 flex items-center pointer-events-none">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </div>
            </div>
            {/* // section user's converstions */}
            <div className="h-full max-h-[90%] overflow-auto m-auto   p-3 rounded-3xl shadow-sm drop-shadow-smooth bg-white  w-[98%] ">
              <div className="min-h-full  ">
                {userConversations
                  .filter((item, index) => {
                    if (filterValue == "") {
                      return item;
                    } else if (
                      item.order.title
                        .toLowerCase()
                        .includes(filterValue.toLowerCase())
                    ) {
                      return item;
                    }
                  })
                  .slice(0, 20)
                  .map((item, index) => (
                    <div
                      key={index}
                      className={`${
                        currentChat?._id === item?._id
                          ? "bg-sky-100 rounded-2xl"
                          : ""
                      }`}
                    >
                      <div
                        className="grid grid-cols-10 p-4  cursor-pointer "
                        onClick={() => openChat(item)}
                      >
                        <div className="flex items-center space-x-3 col-span-7">
                          <img
                            className="w-10 h-10 rounded-full mb"
                            src={globalUrl + item.order?.service?.smallImage}
                            alt=""
                          />
                          <div className="w-full">
                            <div className="text-sm text-gray-500 dark:text-white truncate  w-[95%]">
                              {item.order?.service?.defaultName}
                            </div>
                            <div className="text-sm text-gray-500 dark:text-gray-400 truncate ">
                              {!item?.lastMessage?.isFromAdmin &&
                                item?.lastMessage &&
                                "you: "}
                              {item?.lastMessage?.content}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-end justify-center flex-col col-span-3">
                          <div className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {(() => {
                              const now = new Date();
                              const timestamp = new Date(item.lastMessageOn);
                              const timeDifference = (now - timestamp) / 1000; // Time difference in seconds
                              if (timeDifference < 3600) {
                                // Less than an hour ago
                                return `${timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`;
                              } else if (timeDifference < 86400) {
                                // Less than a day ago
                                return `${timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`;
                              } else if (isToday(timestamp)) {
                                // Today
                                return `${timestamp.toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}`;
                              } else if (isYesterday(timestamp)) {
                                // Yesterday
                                return "Yesterday";
                              } else if (isThisWeek(timestamp)) {
                                // This week
                                return `${timestamp.toLocaleDateString([], {
                                  weekday: "short",
                                })}`;
                              } else {
                                const month = new Intl.DateTimeFormat("en-US", {
                                  month: "short",
                                }).format(timestamp);
                                // Earlier than a week
                                return `${timestamp.getDate()}/${month}/${timestamp.getFullYear()}`;
                              }
                            })()}
                          </div>
                          {unseenConvo?.includes(item?._id) && (
                            <div className="text-sm text-white rounded-full w-3 h-3  flex items-center justify-center bg-main-color"></div>
                          )}
                        </div>
                      </div>
                      <hr className="w-[90%] m-auto mt-3" />
                    </div>
                  ))}
              </div>
            </div>
          </div>
          {messagesLoading ? (
            <div
              ref={conversition}
              className="  md:block conversition  overflow-hidden   col-span-12 md:col-span-8 lg:col-span-7 xl:col-span-6   "
            >
              <div className="flex items-center justify-between pe-7 cursor-pointer">
                <div className="flex items-center space-x-4 col-span-7 ms-3">
                  <div
                    className="chat__previous flex md:hidden"
                    onClick={backToConversitions}
                  >
                    <FontAwesomeIcon
                      className="text-icon w-6 h-6"
                      icon={faArrowLeft}
                    />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                  <div className="font-medium flex justify-center items-center dark:text-white truncate">
                    <div className="me-2 font-semibold w-20 bg-gray-300 h-5 rounded-full"></div>
                    <div className="bg-green-400 rounded-full w-2 h-2"></div>
                  </div>
                </div>
                <Icon SvgIcon={ThreeDotsIcon} onClick={openInformationChat} />
              </div>
              <div className="h-full max-h-[90%] relative overflow-hidden m-auto mt-3 p-3 pt-7 rounded-3xl shadow-sm drop-shadow-smooth bg-white w-[98%]">
                <div
                  className="h-[85%] overflow-hidden m-auto mt-5 px-3 w-[98%]"
                  ref={scrollMessage}
                >
                  <div className="min-h-full w-full">
                    {Array(4)
                      .fill(
                        <div className="p-4">
                          <div className="flex space-x-4">
                            <div className="w-10 h-10 rounded-full bg-gray-300"></div>
                            <div className="w-2/3 bg-gray-300 h-6 rounded-full"></div>
                          </div>
                          <div className="w-3/4 h-4 mt-2 bg-gray-300 rounded-full"></div>
                          <div className="w-4/5 h-4 mt-2 bg-gray-300 rounded-full"></div>
                        </div>
                      )
                      .map((item, index) => (
                        <div key={index}>{item}</div>
                      ))}
                  </div>
                </div>
                <div className="pt-2 sm:mb-0">
                  <div className="relative flex items-center">
                    <div className="w-[90%] m-auto h-12 mt-2 bg-gray-300 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {currentChat ? (
                <div
                  ref={conversition}
                  className="  md:block conversition max-h-[100%] overflow-auto   col-span-12 md:col-span-8 lg:col-span-7 xl:col-span-6   "
                >
                  {/* // online section  */}
                  <div className="flex items-center justify-between pe-7 cursor-pointer">
                    <div className="flex items-center space-x-4 col-span-7 ms-3">
                      <div
                        className="chat__previous flex md:hidden"
                        onClick={backToConversitions}
                      >
                        <FontAwesomeIcon
                          className="text-icon w-6 h-6"
                          icon={faArrowLeft}
                        />
                      </div>
                      <img
                        className="w-10 h-10 rounded-full"
                        src={
                          globalUrl + currentChat?.order?.service?.smallImage
                        }
                        alt=""
                      />
                      <div className="font-medium flex justify-center items-center dark:text-white truncate ">
                        <div className=" hidden md:block me-2 font-semibold">
                          {currentChat?.order?.title}
                        </div>
                        <div className=" md:hidden me-2 font-semibold">
                          {currentChat?.order?.title?.substring(0, 15) + "..."}
                        </div>
                        <div className="bg-green-400 rounded-full w-2 h-2"></div>
                      </div>
                    </div>

                    <Icon
                      SvgIcon={ThreeDotsIcon}
                      onClick={openInformationChat}
                    />
                  </div>
                  {/* // converstions section  */}

                  <div className="h-full max-h-[90%] relative overflow-hidden m-auto mt-3  p-3 pt-7 rounded-3xl  bg-white  w-[98%] ">
                    <div
                      className="h-[85%] overflow-auto m-auto mt-5  px-3 w-[98%]"
                      ref={scrollMessage}
                      onScroll={handleScroll}
                    >
                      <div className="min-h-full w-full   ">
                        <div className=" w-full p-4 " ref={divRef}>
                          {messages?.map((message, index) => {
                            if (message.content == "diff") {
                              return (
                                <div
                                  key={uuidv4()}
                                  className="inline-flex items-center justify-center w-full relative"
                                >
                                  <hr className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                                  <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
                                    {message.date}
                                  </span>
                                </div>
                              );
                            }
                            const content = message?.content;
                            const isMatching = content
                              ?.toLowerCase()
                              ?.includes(searchKeyword.toLowerCase());
                            const currentSenderId = message?.sender?._id;
                            const isSameSender =
                              currentSenderId === previousSenderId;
                            // Render the sender's image only when the sender changes or for the first message
                            const renderSenderImage =
                              !isSameSender || index === 0;
                            if (isMatching && searchKeyword !== "") {
                              if (cuurentHeighligth === null) {
                                matchingMessageCount.push(index);
                                SetCuurentHeighligth(matchingMessageCount[0]);
                                setIndexSearch(1);
                                const lastMessage =
                                  divRef?.current?.children[
                                    matchingMessageCount[0]
                                  ];
                                scrollMessage?.current?.scrollTo({
                                  top: lastMessage?.offsetTop - 200,
                                  behavior: "smooth",
                                });
                              }
                              matchingMessageCount.push(index);
                            }
                            // Update the previousSenderId
                            previousSenderId = currentSenderId;
                            return message?.sender?._id !== user?._id ? (
                              <div key={uuidv4()}>
                                <div
                                  className="flex   space-x-4 col-span-7 pt-2"
                                  key={uuidv4()}
                                >
                                  {/* sender section */}
                                  <div>
                                    <img
                                      className={`w-10 h-10  m-auto rounded-full ${
                                        renderSenderImage ? "" : "invisible"
                                      }`}
                                      src={
                                        message.sender?.profilePic
                                          ? globalUrl +
                                            message.sender?.profilePic
                                          : images.person
                                      }
                                      alt=""
                                    />
                                    <p
                                      style={{ maxWidth: "70px" }}
                                      className={`text-sm mt-2 text-gray-500 dark:text-gray-400 text-center  ${
                                        renderSenderImage ? "" : " invisible"
                                      } `}
                                    >
                                      {new Date(
                                        message?.createdAt
                                      ).toLocaleTimeString("en-US", {
                                        hour: "2-digit",
                                        minute: "2-digit",
                                        hour12: true,
                                      })}
                                    </p>
                                  </div>
                                  <div className="flex flex-row max-w-[90%] ">
                                    {message.content && (
                                      <div
                                        className={`font-medium max-w-[300px]  dark:text-white rounded-2xl rounded-tl-none  bg-third-color p-3  message  break-words `}
                                      >
                                        <p
                                          className={`max-w-full ${
                                            cuurentHeighligth === index
                                              ? "bg-yellow-300 px-2"
                                              : ""
                                          }`}
                                        >
                                          {message.content}
                                        </p>
                                      </div>
                                    )}
                                    {message.msgType === "image" && (
                                      <img
                                        onClick={() => {
                                          openImageModal(
                                            globalUrl + message.image
                                          );
                                        }}
                                        className="w-[300px] h-[200px] mt-1 mb-1 ml-2"
                                        src={globalUrl + message.image}
                                      />
                                    )}
                                    {message.msgType === "file" && (
                                      <div>
                                        <a
                                          href={globalUrl + message.image}
                                          className="mr-2 mt-4"
                                          download
                                        >
                                          <FontAwesomeIcon
                                            className="mr-3 mt-4 d-block"
                                            icon={faFileAlt}
                                            aria-label="message not sent"
                                          />
                                          {getReadmeFileNameFromUrl(
                                            globalUrl + message.image
                                          )}
                                        </a>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div
                                className="flex flex-row-reverse    space-x-4 col-span-7"
                                key={uuidv4()}
                              >
                                {/* receiver section */}
                                <div>
                                  <img
                                    className={`w-10 h-10  m-auto rounded-full ${
                                      renderSenderImage ? "" : "invisible"
                                    }`}
                                    src={
                                      message.sender?.profilePic
                                        ? globalUrl + message.sender?.profilePic
                                        : images.person
                                    }
                                    alt=""
                                  />
                                  <p
                                    style={{ maxWidth: "70px" }}
                                    className={`text-sm mt-2 text-gray-500 dark:text-gray-400 text-center  ${
                                      renderSenderImage ? "" : " invisible"
                                    } `}
                                  >
                                    {new Date(
                                      message?.createdAt
                                    ).toLocaleTimeString("en-US", {
                                      hour: "2-digit",
                                      minute: "2-digit",
                                      hour12: true,
                                    })}
                                  </p>
                                </div>

                                <div className="  flex justify-center   items-center h-full max-w-[90%]">
                                  {message?.status &&
                                    message.status == "failed" && (
                                      <>
                                        <div className="bg-white text-red-500 h-full flex items-center mr-2 mt-4 ">
                                          <span className="error-text mx-auto">
                                            Message not sent
                                          </span>
                                        </div>
                                        <FontAwesomeIcon
                                          className="mr-2 mt-4"
                                          icon={faCircleExclamation}
                                          aria-label="message not sent"
                                        />
                                      </>
                                    )}
                                  {message.content && (
                                    <div
                                      className={`font-medium  text-white rounded-2xl rounded-tr-none  bg-main-color  p-3 mt-5 me-3 message   break-words `}
                                    >
                                      <p
                                        className={`max-w-[300px] ${
                                          cuurentHeighligth === index
                                            ? "bg-yellow-300 px-2 text-black"
                                            : ""
                                        }`}
                                      >
                                        {message.content}
                                      </p>
                                    </div>
                                  )}
                                  {message.msgType === "image" && (
                                    <img
                                      onClick={() => {
                                        openImageModal(
                                          globalUrl + message.image
                                        );
                                      }}
                                      className="w-[300px] h-[200px] mt-1 mb-1 mr-2"
                                      src={globalUrl + message.image}
                                    />
                                  )}
                                  {message.msgType === "file" && (
                                    <div>
                                      <a
                                        href={globalUrl + message.image}
                                        className="mr-2 mt-4"
                                        download
                                      >
                                        {getReadmeFileNameFromUrl(
                                          globalUrl + message.image
                                        )}
                                        <FontAwesomeIcon
                                          className="ml-3 mt-4 d-block"
                                          icon={faFileAlt}
                                          aria-label="message not sent"
                                        />
                                      </a>
                                    </div>
                                  )}
                                </div>
                              </div>
                            );
                          })}

                          {/* sender section */}
                        </div>
                        {searchKeyword && (
                          <p className="absolute top-[12px] right-[30px]">
                            {indexSearch} of {matchingMessageCount.length}
                          </p>
                        )}
                        {matchingMessageCount.length > 0 && (
                          <button
                            className="absolute top-[12px] right-[85px] z-30 "
                            onClick={() => {
                              arrowDown();
                            }}
                          >
                            <FontAwesomeIcon icon={faChevronDown} />
                          </button>
                        )}
                        {matchingMessageCount.length > 0 && (
                          <button
                            className="absolute top-[12px] z-30 right-[110px]"
                            onClick={() => {
                              arrowUp();
                            }}
                          >
                            <FontAwesomeIcon icon={faChevronUp} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* // chatting typing sectiom  */}
                    <div className="  pt-2 sm:mb-0 ">
                      {currentChat?.order?.status == "completed" ? (
                        <div className="flex items-center justify-center bg-gray-200 rounded-3xl">
                          <div className="text-red-500 text-1xl font-bold text-center py-2">
                            CONGRATS..! YOUR ORDER IS COMPLETED.
                          </div>
                        </div>
                      ) : (
                        <div className="relative flex  items-center  ">
                          <textarea
                            rows={1}
                            placeholder="Write your message!"
                            className=" focus:outline-none  focus:placeholder-gray-400 text-gray-600 placeholder-gray-600 px-7 bg-gray-200 rounded-3xl py-3 xs:w-[80%]  lg:w-[85%]  resize-none overflow-hidden"
                            onChange={(e) => setMessage(e.target.value)}
                            value={message}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                if (message.trim() !== "") {
                                  handleSendMessage();
                                  setNewMessage(!newMessage);
                                }
                                e.preventDefault();
                              }
                            }}
                            onClick={() => {
                              scrollMessage?.current?.scrollTo({
                                top: scrollMessage?.current?.scrollHeight,
                              });
                            }}
                          ></textarea>
                          <input
                            type="file"
                            style={{ display: "none" }}
                            onChange={handleImageSelect}
                            id="imageInput"
                          />
                          <label
                            htmlFor="imageInput"
                            className="xs:mx-1 lg:mx-2 rounded-full h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none flex justify-center items-center cursor-pointer"
                          >
                            <Icon SvgIcon={SendFileAndLinkIcon} />
                          </label>

                          <button
                            onClick={() => {
                              handleSendMessage();
                              scrollMessage?.current?.scrollTo({
                                top: scrollMessage?.current?.scrollHeight,
                              });
                              setNewMessage(!newMessage);
                            }}
                            disabled={!message}
                            className={`custom-form__send-submit flex justify-center items-center ${
                              !message ? "opacity-[.6]" : ""
                            }`}
                          >
                            <Icon SvgIcon={SendMessageIcon} />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  ref={conversition}
                  className=" xs:hidden md:block conversition max-h-full overflow-hidden   col-span-12 md:col-span-8 lg:col-span-7 xl:col-span-6   "
                ></div>
              )}
              {/* // chatting information  */}
              {showDiv && (
                <div
                  ref={conversition_information}
                  className="xs:hidden xs:hidden xl:block  conversition_information max-h-[100%] overflow-auto bg-white rounded-2xl col-span-12 md:col-span-8 lg:col-span-7 xl:col-span-3 drop-shadow-smooth pt-4"
                >
                  <div className="flex items-start justify-center flex-col  space-x-4 col-span-7 ms-5 ">
                    <div
                      className="chat__previous  xl:hidden mb-10"
                      onClick={backToConversition}
                    >
                      <FontAwesomeIcon
                        className="text-icon w-6 h-6"
                        icon={faArrowLeft}
                      />
                    </div>
                    <div>
                      <img
                        className="w-20 h-20 rounded-full mb-20 mt-5"
                        src={
                          globalUrl + currentChat?.order?.service?.smallImage
                        }
                        onClick={() =>
                          openImageModal(
                            globalUrl + currentChat?.order?.service?.smallImage
                          )
                        }
                        alt=""
                      />
                    </div>
                  </div>
                  <hr className="w-[90%] m-auto"></hr>
                  <div id="accordionExample">
                    <div>
                      <h2 className="mb-0" id="headingOne">
                        <button
                          className={`${
                            activeElement === "element1" &&
                            `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                          } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-gray-400 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                          type="button"
                          onClick={() => handleClick("element1")}
                          aria-expanded="true"
                          aria-controls="collapseOne"
                        >
                          <Icon SvgIcon={SearchIcon} />
                          Search Message
                          <span
                            className={`${
                              activeElement === "element1"
                                ? `rotate-[-180deg] -mr-1`
                                : `-rotate-90 fill-[#212529]  dark:fill-white`
                            } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                          >
                            <Icon SvgIcon={GraterThanIcon} />
                          </span>
                        </button>
                      </h2>
                      <TECollapse
                        show={activeElement === "element1"}
                        className="!mt-0 !rounded-b-none !shadow-none"
                      >
                        <div className="flex justify-center items-center">
                          <input
                            type="text"
                            placeholder="search with Keyword "
                            className=" mt-2 p-1 pl-3 border rounded-2xl w-[85%] resize-none overflow-hidden "
                            onChange={handleSearchChange}
                            value={searchKeyword}
                          />
                          <button
                            onClick={backToConversition}
                            className=" md:hidden w-7 h-7 mt-[6px] ml-2 rounded-full bg-gray-800 dark:bg-gray-100 dark:text-gray-800 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-black"
                            aria-label="edit note"
                            role="button"
                          >
                            <img
                              className="dark:hidden"
                              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/4-by-3-multiple-styled-cards-svg1.svg"
                              alt="edit"
                            />
                            <img
                              className="dark:block hidden"
                              src="https://tuk-cdn.s3.amazonaws.com/can-uploader/4-by-3-multiple-styled-cards-svg1dark.svg"
                              alt="edit"
                            />
                          </button>
                        </div>
                      </TECollapse>
                    </div>
                  </div>
                  <hr className="w-[90%] m-auto mt-3" />
                  <div>
                    <h2 className="mb-0" id="headingTwo">
                      <button
                        className={`${
                          activeElement === "element2"
                            ? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                            : `transition-none rounded-b-[15px]`
                        } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-gray-400 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                        type="button"
                        onClick={openFilesChat}
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        <Icon SvgIcon={FileAndLinkIcon} />
                        Files & Links
                        <span
                          className={`${
                            activeElement === "element2"
                              ? `rotate-[-180deg] -mr-1`
                              : `-rotate-90 fill-[#212529] dark:fill-white`
                          } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                        >
                          <Icon SvgIcon={GraterThanIcon} />
                        </span>
                      </button>
                    </h2>
                    <TECollapse
                      show={activeElement === "element2"}
                      className="!mt-0 !rounded-b-none !shadow-none"
                    >
                      <div className="px-5 py-4">
                        <strong>
                          This is the second item's accordion body.
                        </strong>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                        Vestibulum eu rhoncus purus, vitae tincidunt nibh.
                        Vivamus elementum egestas ligula in varius. Proin ac
                        erat pretium, ultricies leo at, cursus ante.
                        Pellentesque at odio euismod, mattis urna ac, accumsan
                        metus. Nam nisi leo, malesuada vitae pretium et, laoreet
                        at lorem. Curabitur non sollicitudin neque.
                      </div>
                    </TECollapse>
                  </div>
                  <hr className="w-[90%] m-auto mt-3" />

                  <div>
                    <h2 className="accordion-header mb-0" id="headingThree">
                      <button
                        className={`${
                          activeElement === "element3"
                            ? `text-primary [box-shadow:inset_0_-1px_0_rgba(229,231,235)] dark:!text-primary-400 dark:[box-shadow:inset_0_-1px_0_rgba(75,85,99)]`
                            : `transition-none rounded-b-[15px]`
                        } group relative flex w-full items-center rounded-t-[15px] border-0 bg-white px-5 py-4 text-left text-base text-gray-400 transition [overflow-anchor:none] hover:z-[2] focus:z-[3] focus:outline-none dark:bg-neutral-800 dark:text-white`}
                        type="button"
                        onClick={() => handleClick("element3")}
                        aria-expanded="true"
                        aria-controls="collapseOne"
                      >
                        <Icon SvgIcon={PersonalsNotepadIcon} />
                        Personals Notepad
                        <span
                          className={`${
                            activeElement === "element3"
                              ? `rotate-[-180deg] -mr-1`
                              : `-rotate-90 fill-[#212529] dark:fill-white`
                          } ml-auto h-5 w-5 shrink-0 fill-[#336dec] transition-transform duration-200 ease-in-out motion-reduce:transition-none dark:fill-blue-300`}
                        >
                          <Icon SvgIcon={GraterThanIcon} />
                        </span>
                      </button>
                    </h2>
                    <TECollapse
                      show={activeElement === "element3"}
                      className="!mt-0 !shadow-none"
                    >
                      <div className="px-5 py-4">
                        <div
                          className="w-full flex flex-col justify-between dark:bg-gray-800 bg-white
                         dark:border-gray-700 rounded-lg border border-gray-400 mb-6 py-5 px-4"
                          style={{ wordWrap: "break-word" }}
                        >
                          <div>
                            {notes?.map((note, index) => (
                              <div key={index} className="my-3">
                                <span className="mr-3 my-2">&#8226;</span>
                                <span className="note-tex my-2">{note}</span>
                                <hr className="my-2" />
                              </div>
                            ))}
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-gray-800 dark:text-gray-100">
                              <textarea
                                placeholder="Add a note"
                                rows={1}
                                className="mt-2 p-1 pl-3 border rounded-2xl w-[85%] resize-none overflow-hidden"
                                onChange={(e) => setNote(e.target.value)}
                                value={note}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") {
                                    handleSendNote(currentChat?._id);
                                    e.preventDefault();
                                  }
                                }}
                                onInput={(e) => {
                                  e.target.style.height = "auto";
                                  e.target.style.height = `${e.target.scrollHeight}px`;
                                }}
                              ></textarea>

                              <button
                                onClick={() => handleSendNote(currentChat?._id)}
                                className="w-8 h-8 rounded-full bg-gray-800 dark:bg-gray-100 dark:text-gray-800 text-white flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-offset-2  focus:ring-black"
                                aria-label="edit note"
                                role="button"
                              >
                                <img
                                  className="dark:hidden"
                                  src="https://tuk-cdn.s3.amazonaws.com/can-uploader/4-by-3-multiple-styled-cards-svg1.svg"
                                  alt="edit"
                                />
                                <img
                                  className="dark:block hidden"
                                  src="https://tuk-cdn.s3.amazonaws.com/can-uploader/4-by-3-multiple-styled-cards-svg1dark.svg"
                                  alt="edit"
                                />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </TECollapse>
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}

      {openFileModal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-[9999]"
          onClick={handleClickOutside}
        >
          <div
            ref={modalContentRef}
            className="max-h-[80%] overflow-y-scroll bg-white w-[50%] p-[20px] flex-col flex items-center z-[9998]"
          >
            {chatFiles?.map((message, index) => {
              if (message.content == "diff") {
                return (
                  <div
                    key={uuidv4()}
                    className="inline-flex items-center justify-center w-full relative"
                  >
                    <hr className="w-full h-px my-8 bg-gray-200 border-0 dark:bg-gray-700" />
                    <span className="absolute px-3 font-medium text-gray-900 -translate-x-1/2 bg-white left-1/2 dark:text-white dark:bg-gray-900">
                      {message.date}
                    </span>
                  </div>
                );
              }

              const currentSenderId = message?.isFromAdmin;
              const isSameSender = currentSenderId == previousSenderId;
              // Render the sender's image only when the sender changes or for the first message
              const renderSenderImage = !isSameSender || index === 0;

              // Update the previousSenderId
              previousSenderId = currentSenderId;
              return !message?.isFromAdmin ? (
                <div key={index}>
                  {matchingMessageCount.length > 0 && (
                    <button
                      className="absolute top-[12px] right-[85px] z-30"
                      onClick={() => {
                        arrowDown();
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronDown} />
                    </button>
                  )}
                  {matchingMessageCount.length > 0 && (
                    <button
                      className="absolute top-[12px] z-30 right-[110px]"
                      onClick={() => {
                        arrowUp();
                      }}
                    >
                      <FontAwesomeIcon icon={faChevronUp} />
                    </button>
                  )}
                  <div className="flex   space-x-4 col-span-7" key={uuidv4()}>
                    {/* sender section */}
                    <div>
                      <img
                        className={`w-10 h-10  m-auto rounded-full ${
                          renderSenderImage ? "" : "invisible"
                        }`}
                        src={
                          message.sender?.profilePic &&
                          globalUrl + message.sender?.profilePic
                        }
                        alt=""
                      />
                      <p
                        style={{
                          maxWidth: "70px",
                        }}
                        className={`text-sm mt-2 text-gray-500 dark:text-gray-400 text-center  ${
                          renderSenderImage ? "" : " invisible"
                        } `}
                      >
                        {new Date(message?.createdAt).toLocaleTimeString(
                          "en-US",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          }
                        )}
                      </p>
                    </div>
                    <div className="flex flex-row max-w-[90%] items-center">
                      {message.content && (
                        <div
                          className={`font-medium max-w-[300px]  dark:text-white rounded-2xl rounded-tl-none  bg-third-color p-3 message  break-words `}
                        >
                          <p
                            className={`max-w-full ${
                              cuurentHeighligth === index
                                ? "bg-yellow-300 px-2"
                                : ""
                            }`}
                          >
                            {message.content}
                          </p>
                        </div>
                      )}
                      {message.msgType === "image" && (
                        <img
                          className="w-[300px] h-[200px] m-2"
                          src={globalUrl + message.image}
                          onClick={
                            () => openImageModal(globalUrl + message.image)
                            // openImageModal(
                            //   globalUrl +
                            //     message.image
                            // )
                          }
                        ></img>
                      )}
                      {message.msgType === "file" && (
                        <div>
                          <a
                            href={globalUrl + message.image}
                            className="mr-2 mt-4"
                            download
                          >
                            <FontAwesomeIcon
                              className="mr-3 mt-4 d-block"
                              icon={faFileAlt}
                              aria-label="message not sent"
                            />
                            {getReadmeFileNameFromUrl(
                              globalUrl + message.image
                            )}
                          </a>
                        </div>
                      )}
                      {message?.status && message.status == "failed" && (
                        <>
                          <FontAwesomeIcon
                            className="ml-2 mt-4"
                            icon={faCircleExclamation}
                            aria-label="message not sent"
                          />
                          <div className="bg-white text-red-500 h-full flex items-center ml-3">
                            <span className="error-text mx-auto">
                              Message not sent
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className="flex flex-row-reverse pt-2   space-x-4 col-span-7"
                  key={uuidv4()}
                >
                  {/* receiver section */}
                  <div>
                    <img
                      className={`w-10 h-10  m-auto rounded-full ${
                        renderSenderImage ? "" : "invisible"
                      }`}
                      src={
                        message.sender?.profilePic &&
                        globalUrl + message.sender?.profilePic
                      }
                      alt=""
                    />
                    <p
                      style={{
                        maxWidth: "70px",
                      }}
                      className={`text-sm mt-2 text-gray-500 dark:text-gray-400 text-center  ${
                        renderSenderImage ? "" : " invisible"
                      } `}
                    >
                      {new Date(message?.createdAt).toLocaleTimeString(
                        "en-US",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )}
                    </p>
                  </div>

                  <div className="  flex justify-center   items-center h-full max-w-[90%]">
                    {message?.status && message.status == "failed" && (
                      <>
                        <div className="bg-white text-red-500 h-full flex items-center mr-2 mt-4 ">
                          <span className="error-text mx-auto">
                            Message not sent
                          </span>
                        </div>
                        <FontAwesomeIcon
                          className="mr-2 mt-4"
                          icon={faCircleExclamation}
                          aria-label="message not sent"
                        />
                      </>
                    )}
                    {message.content && (
                      <div
                        className={`font-medium max-w-[300px]  text-white rounded-2xl rounded-tr-none  bg-main-color  mt-5 me-3 message   break-words `}
                      >
                        <p
                          className={`max-w-full ${
                            cuurentHeighligth === index
                              ? "bg-yellow-300 px-2 text-black"
                              : ""
                          }`}
                        >
                          {message.content}
                        </p>
                      </div>
                    )}
                    {message.msgType === "image" && (
                      <img
                        className="w-[300px] h-[200px] m-2"
                        src={globalUrl + message.image}
                        onClick={
                          () => openImageModal(globalUrl + message.image)
                          // openImageModal(
                          //   globalUrl +
                          //     message.image
                          // )
                        }
                      ></img>
                    )}
                    {message.msgType === "file" && (
                      <div>
                        <a
                          href={globalUrl + message.image}
                          className="mr-2 mt-4"
                          download
                        >
                          {getReadmeFileNameFromUrl(globalUrl + message.image)}
                          <FontAwesomeIcon
                            className="ml-3 mt-4 d-block"
                            icon={faFileAlt}
                            aria-label="message not sent"
                          />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {modalImage && <Modal imageUrl={modalImage} onClose={closeImageModal} />}
    </div>
  );
}

export default Chat;
