/* eslint-disable react/prop-types */
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

export default function Modal({ onClose, children }) {
  return (
    <div className="fixed top-0 left-0 w-full h-full bg-opacity-50 bg-black flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded-lg shadow-md relative">
        {/* Close icon at top right */}
        <button
          className="absolute top-2 right-2 bg-transparent border-none cursor-pointer mb-5"
          onClick={onClose}
        >
          <FontAwesomeIcon icon={faTimes} size="lg" className="pr-2 pt-1" />
        </button>
        {children}
      </div>
    </div>
  );
}
