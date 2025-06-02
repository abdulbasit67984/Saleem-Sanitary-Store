/* eslint-disable no-unused-vars */
import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-[#175367] hover:bg-[#1a4452] ",
    textColor = "text-white",
    className = "text-white bg-[#175367]",
    ...props
}) {
    return (
        <button className={`${className} py-2 rounded-lg duration-200 ${bgColor} ${textColor} `} {...props}>
            {children}
        </button>
    );
}