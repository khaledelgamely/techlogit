import * as React from "react";

function search() {
  return (
    <svg
      className="me-4"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.65 14.3C11.3227 14.3 14.3 11.3227 14.3 7.65C14.3 3.97731 11.3227 1 7.65 1C3.97731 1 1 3.97731 1 7.65C1 11.3227 3.97731 14.3 7.65 14.3Z"
        stroke="#979899"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15.0007 15.0003L12.4082 12.667"
        stroke="#979899"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

const SearchIcon = React.memo(search);
export { SearchIcon };
