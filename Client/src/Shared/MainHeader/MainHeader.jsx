import React from "react";
import { styleLastWord } from "../../utils/styleLastWord.jsx";

function MainHeader({ text }) {
  return (
    <h3 className="font-[700] mb-10  text-center xs:text-[24px] md:text-[28px] lg:text-[40px] line-40 xs:font-body">
      {styleLastWord(text)}
    </h3>
  );
}

export default MainHeader;
