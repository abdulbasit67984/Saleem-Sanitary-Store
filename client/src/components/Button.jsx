/* eslint-disable no-unused-vars */
import React from "react";

export default function Button({
    children,
    type = "button",
    bgColor = "bg-primary hover:bg-primaryHover ",
    textColor = "text-white",
    className = "text-white bg-primary",
    ...props
}) {
    return (
        <button className={`${className} py-2 rounded-lg duration-200 ${bgColor} ${textColor} `} {...props}>
            {children}
        </button>
    );
}