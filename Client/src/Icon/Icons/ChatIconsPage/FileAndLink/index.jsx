import * as React from "react";

function fileAndLink() {
  return (
    <svg
      className="me-4"
      width="16"
      height="18"
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4.93813 13.3551L10.8563 7.69016C11.5668 7.01001 11.5668 5.90728 10.8563 5.22713C10.1457 4.54699 8.99372 4.54698 8.28317 5.22713L2.4079 10.851C1.05786 12.1433 1.05786 14.2385 2.4079 15.5308C3.75794 16.8231 5.94678 16.8231 7.29681 15.5308L13.2579 9.82478C15.2474 7.92037 15.2474 4.83272 13.2579 2.92831C11.2683 1.0239 8.04267 1.0239 6.05314 2.92831L1.25 7.52596"
        stroke="#979899"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

const FileAndLinkIcon = React.memo(fileAndLink);
export { FileAndLinkIcon };
