import * as React from "react";

function upCircle() {
  return (
    <svg
      className="absolute top-[-8%] right-[-12%]  rounded-full -z-50 rotate--180 "
      width="496"
      height="500"
      viewBox="0 0 496 993"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_f_826_6292)">
        <circle
          cx="496"
          cy="496.457"
          r="340"
          fill="#BCDAEF"
          fillOpacity="0.26"
        />
      </g>
      <defs>
        <filter
          id="filter0_f_826_6292"
          x="0"
          y="0.457031"
          width="992"
          height="992"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="BackgroundImageFix"
            result="shape"
          />
          <feGaussianBlur
            stdDeviation="78"
            result="effect1_foregroundBlur_826_6292"
          />
        </filter>
      </defs>
    </svg>
  );
}

const UpCircleIcon = React.memo(upCircle);
export { UpCircleIcon };
