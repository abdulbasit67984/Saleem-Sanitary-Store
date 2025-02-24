/* eslint-disable no-unused-vars */
import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-gray-500",
    textColor = "text-white",
    className = "text-white bg-gray-500",
    ...props
}) {
    return (
        <button className={`${className} py-2 rounded-lg hover:bg-gray-700 duration-200 ${bgColor} ${textColor} `} {...props}>
            {children}
        </button>
    );
}