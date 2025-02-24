/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";
import Button from "./Button";

const SuccessResponseMessage = ({ isOpen, onClose, message }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded shadow-lg text-center relative">
                <button 
                    className="absolute top-0 pt-1 right-2 hover:text-red-700"
                    onClick={onClose}
                >
                    &#10008;
                </button>
                <h2 className="text-lg font-thin p-4">{message}</h2>
                <Button
                className="px-4 text-xs"
                onClick={onClose}>OK</Button>
            </div>
        </div>
    );
};

export default SuccessResponseMessage;
