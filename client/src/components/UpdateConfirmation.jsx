
/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";

const UpdateConfirmation = ({ message, onConfirm, onCancel, isOpen }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-20 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Confirmation</h3>
        <p className="text-gray-600 text-sm mb-6">{message}</p>
        <div className="flex justify-between">
          <button 
            className="px-4 py-2 text-white bg-gray-500 rounded hover:bg-gray-600 transition"
            onClick={onConfirm}
          >
            Confirm
          </button>
          <button 
            className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600 transition"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

UpdateConfirmation.propTypes = {
  message: PropTypes.string.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  isOpen: PropTypes.bool.isRequired,
};

export default UpdateConfirmation;
