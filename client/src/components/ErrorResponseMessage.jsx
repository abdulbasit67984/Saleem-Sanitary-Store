/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from "react";

const ErrorResponseMessage = ({ isOpen, onClose, errorMessage }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20">
            <div className="bg-white p-6 rounded shadow-lg text-center relative border border-red-500">
                <button
                    className="absolute top-0 pt-1 right-2 text-red-700 hover:text-red-900"
                    onClick={onClose}
                >
                    &#10008;
                </button>
                <h2 className="text-lg font-semibold text-red-700 p-2">Error</h2>
                <p className="text-gray-700">{errorMessage}</p>
                <button
                    className="px-4 py-2 mt-3 text-white bg-primary rounded hover:bg-primaryHover transition"
                    onClick={onClose}
                >
                    OK
                </button>
            </div>
        </div>
    );
};

export default ErrorResponseMessage;