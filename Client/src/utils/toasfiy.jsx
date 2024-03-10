import { toast } from "react-toastify";

export const toastMessage = (type, message) => {
  toast[type](message, {
    position: "top-right",
    autoClose: 3000,
  });
};
