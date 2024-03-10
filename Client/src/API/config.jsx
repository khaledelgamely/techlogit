import axios from "axios";
import Cookies from "js-cookie";
export const globalUrl = import.meta.env.VITE_GLOBAL_URL;

const Tech_Logit = axios.create({
  baseURL: globalUrl,
});
Tech_Logit.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");
    if (token) {
      config.headers.authorization = `Tech__ ${token}`;
    }
    return config;
  },
  (error) => {
    console.log(error);
    return Promise.reject(error);
  }
);

export default Tech_Logit;
