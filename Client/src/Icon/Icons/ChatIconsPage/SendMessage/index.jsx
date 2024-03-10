import * as React from "react";

function sendMessage() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className=" w-10 h-10 bg-icon p-3 px-0 rounded-full text-white"
      viewBox="0 0 45.6 45.6"
    >
      <g>
        <path
          d="M20.7,26.7a1.4,1.4,0,0,1-1.2-.6,1.6,1.6,0,0,1,0-2.4L42.6.5a1.8,1.8,0,0,1,2.5,0,1.8,1.8,0,0,1,0,2.5L21.9,26.1A1.6,1.6,0,0,1,20.7,26.7Z"
          fill="#FFF"
        />
        <path
          d="M29.1,45.6a1.8,1.8,0,0,1-1.6-1L19.4,26.2,1,18.1a1.9,1.9,0,0,1-1-1.7,1.8,1.8,0,0,1,1.2-1.6L43.3.1a1.7,1.7,0,0,1,1.8.4,1.7,1.7,0,0,1,.4,1.8L30.8,44.4a1.8,1.8,0,0,1-1.6,1.2ZM6.5,16.7l14.9,6.6a2,2,0,0,1,.9.9l6.6,14.9L41,4.6Z"
          fill="#FFF"
        />
      </g>
    </svg>
  );
}

const SendMessageIcon = React.memo(sendMessage);
export { SendMessageIcon };
