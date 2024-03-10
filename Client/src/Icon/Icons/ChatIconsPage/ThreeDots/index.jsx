import * as React from "react";

function threeDots(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      className="text-icon h-7 w-7 flex xl:hidden"
      viewBox="0 0 42.2 11.1"
    >
      <g>
        <circle
          cx="5.6"
          cy="5.6"
          r="5.6"
          fill="rgb(27 117 188 / var(--tw-text-opacity))"
        />
        <circle
          cx="21.1"
          cy="5.6"
          r="5.6"
          fill="rgb(27 117 188 / var(--tw-text-opacity))"
        />
        <circle
          cx="36.6"
          cy="5.6"
          r="5.6"
          fill="rgb(27 117 188 / var(--tw-text-opacity))"
        />
      </g>
    </svg>
  );
}

const ThreeDotsIcon = React.memo(threeDots);
export { ThreeDotsIcon };
