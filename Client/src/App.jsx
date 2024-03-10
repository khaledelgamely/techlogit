import Cookies from "js-cookie";
import jwt_decode from "jwt-decode";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { io } from "socket.io-client";
import { globalUrl } from "./API/config";
import FloatingIcons from "./Components/HomeComponents/FloatingIcons/FloatingIcons";
import AppRoutes from "./Routers/Routes";
import LoaderHome from "./Shared/Loader/LoaderHome";
import NavBar from "./Shared/NavBar/NavBar";
import { fetchCurrency } from "./store/Slices/currency";
import { fetchHome } from "./store/Slices/homeSlice";
export const SocketUrl = import.meta.env.VITE_SOCKET_URL;
import {
  fetchProjects,
  fetchProjectsCategories,
} from "./store/Slices/projectSlice";
import {
  fetchUser,
  fetchUserConversations,
  setSocket,
} from "./store/Slices/userSlice";

function App() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.user);
  const home = useSelector((state) => state.home?.home);
  const [loading, setLoading] = useState(true);
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    dispatch(fetchHome())
      .then(() => setLoading(false))
      .catch((error) => {
        console.error("Error fetching home data:", error);
        setLoading(false);
      });

    dispatch(fetchCurrency());
    dispatch(fetchProjects());
    dispatch(fetchProjectsCategories());
  }, []);

  useEffect(() => {
    const token = Cookies.get("token");
    if (token) {
      const decodedToken = jwt_decode(token);
      const userId = decodedToken.id;
      dispatch(fetchUserConversations(userId));

      dispatch(fetchUser(userId))
        .then(() => setLoading(false))
        .catch((error) => {
          console.error("Error fetching user data:", error);
          setLoading(false);
        });
      // const socket = io(globalUrl, {
      //   extraHeaders: {
      //     'Access-Control-Allow-Origin': 'https://techlogit.com/'}
      // });
      const socket = io(SocketUrl);
      socket.on("connect", () => {
        console.log("Connected to the server");
      });
      socket.emit("addUser", userId, false);
      dispatch(setSocket(socket));

      const resetSessionTimer = () => {
        if (sessionTimer) {
          clearTimeout(sessionTimer);
        }
        sessionTimer = setTimeout(refreshWebsite, sessionTimeoutDuration);
      };

      const refreshWebsite = () => {
        window.location.reload();
        localStorage.clear();
      };

      const handleUserActivity = () => {
        resetSessionTimer();
      };

      let sessionTimer;

      document.addEventListener("click", handleUserActivity);

      resetSessionTimer();

      return () => {
        document.removeEventListener("click", handleUserActivity);
        clearTimeout(sessionTimer);
      };
    } else {
      setLoading(false);
    }
  }, [dispatch, user?.id]);

  useEffect(() => {
    const loaderTimeout = setTimeout(() => {
      setShowLoader(false);
    }, 2000);
    return () => {
      clearTimeout(loaderTimeout);
    };
  }, []);

  const sessionTimeoutDuration = 60 * 60 * 5000;

  return (
    <>
      <BrowserRouter>
        <NavBar />
        <AppRoutes />
        <FloatingIcons />
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
