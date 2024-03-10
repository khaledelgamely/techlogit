import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import {
  faArrowUp,
  faEnvelope,
  faPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { handleClickOutside } from "../../../utils/handleClickOutside";

function FloatingIcons() {
  const [isOpen, setIsOpen] = useState(false);
  const iconRef = useRef(null);
  const WhatsApp = import.meta.env.VITE_WHATSAPP;
  const email = import.meta.env.VITE_EMAIL;

  useEffect(() => {
    document.addEventListener("click", (e) => {
      handleClickOutside(e, iconRef, setIsOpen);
    });
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const variants = {
    open: { opacity: 1, scale: 1 },
    closed: { opacity: 0, scale: 0 },
  };

  return (
    <div className="fixed bottom-2 left-2 z-20" ref={iconRef}>
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-main-color text-white w-[50px] h-[50px] rounded-full"
        >
          <FontAwesomeIcon icon={faPlus} />
        </button>
        {isOpen && (
          <motion.div
            className="absolute top-[-12rem] left-0  mt-2 rounded-lg "
            initial="closed"
            animate={isOpen ? "open" : "closed"}
          >
            <motion.a
              href={WhatsApp}
              className=" w-[50px] h-[50px] rounded-full bg-main-color text-white mb-3 grid place-content-center"
              transition={{ duration: 0.2 }}
              variants={variants}
            >
              <FontAwesomeIcon icon={faWhatsapp} />
            </motion.a>
            <motion.a
              href={email}
              className=" w-[50px] h-[50px] rounded-full bg-main-color text-white mb-3 grid place-content-center"
              transition={{ duration: 0.2 }}
              variants={variants}
            >
              <FontAwesomeIcon icon={faEnvelope} />
            </motion.a>
            <motion.span
              onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className=" w-[50px] h-[50px] rounded-full bg-main-color text-white mb-3 grid place-content-center cursor-pointer"
              transition={{ duration: 0.2 }}
              variants={variants}
            >
              <FontAwesomeIcon icon={faArrowUp} />
            </motion.span>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export default FloatingIcons;
