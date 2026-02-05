/* eslint-disable no-unused-vars */
import React from "react";
import PropTypes from "prop-types";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, Trash2, Edit3, PlusCircle, HelpCircle, X } from "lucide-react";

/**
 * Beautiful confirmation modal for delete, update, add operations
 * @param {Object} props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {function} props.onConfirm - Callback when user confirms
 * @param {function} props.onCancel - Callback when user cancels
 * @param {string} props.title - Modal title
 * @param {string} props.message - Modal message
 * @param {string} props.type - Type of operation: 'delete' | 'update' | 'add' | 'warning' | 'confirm'
 * @param {string} props.confirmText - Text for confirm button
 * @param {string} props.cancelText - Text for cancel button
 * @param {boolean} props.isLoading - Whether the action is loading
 */
const ConfirmationModal = ({
  isOpen,
  onConfirm,
  onCancel,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  type = "confirm",
  confirmText,
  cancelText = "Cancel",
  isLoading = false,
}) => {
  // Configuration based on type
  const typeConfig = {
    delete: {
      icon: Trash2,
      iconBg: "bg-red-100",
      iconColor: "text-red-600",
      confirmBg: "bg-red-600 hover:bg-red-700",
      confirmText: confirmText || "Delete",
      title: title || "Delete Confirmation",
    },
    update: {
      icon: Edit3,
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
      confirmBg: "bg-blue-600 hover:bg-blue-700",
      confirmText: confirmText || "Update",
      title: title || "Update Confirmation",
    },
    add: {
      icon: PlusCircle,
      iconBg: "bg-green-100",
      iconColor: "text-green-600",
      confirmBg: "bg-green-600 hover:bg-green-700",
      confirmText: confirmText || "Confirm",
      title: title || "Add Confirmation",
    },
    warning: {
      icon: AlertTriangle,
      iconBg: "bg-amber-100",
      iconColor: "text-amber-600",
      confirmBg: "bg-amber-600 hover:bg-amber-700",
      confirmText: confirmText || "Proceed",
      title: title || "Warning",
    },
    confirm: {
      icon: HelpCircle,
      iconBg: "bg-purple-100",
      iconColor: "text-purple-600",
      confirmBg: "bg-purple-600 hover:bg-purple-700",
      confirmText: confirmText || "Confirm",
      title: title || "Confirmation",
    },
  };

  const config = typeConfig[type] || typeConfig.confirm;
  const IconComponent = config.icon;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center z-[9999]"
          onClick={(e) => {
            if (e.target === e.currentTarget && !isLoading) onCancel();
          }}
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onCancel}
              disabled={isLoading}
              className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              <X className="w-5 h-5 text-gray-400" />
            </button>

            {/* Content */}
            <div className="p-6 pt-8">
              {/* Icon */}
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.1 }}
                  className={`p-4 rounded-full ${config.iconBg}`}
                >
                  <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
                </motion.div>
              </div>

              {/* Title */}
              <motion.h3
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
                className="text-xl font-semibold text-gray-900 text-center mb-2"
              >
                {config.title}
              </motion.h3>

              {/* Message */}
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 text-center text-sm leading-relaxed mb-6"
              >
                {message}
              </motion.p>

              {/* Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
                className="flex gap-3"
              >
                <button
                  onClick={onCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 font-medium rounded-xl hover:bg-gray-200 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {cancelText}
                </button>
                <button
                  onClick={onConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-3 text-white font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${config.confirmBg}`}
                >
                  {isLoading ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      <span>Processing...</span>
                    </>
                  ) : (
                    config.confirmText
                  )}
                </button>
              </motion.div>
            </div>

            {/* Bottom decorative bar */}
            <div className={`h-1 ${config.confirmBg.split(' ')[0]}`} />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

ConfirmationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onConfirm: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  title: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.oneOf(["delete", "update", "add", "warning", "confirm"]),
  confirmText: PropTypes.string,
  cancelText: PropTypes.string,
  isLoading: PropTypes.bool,
};

export default ConfirmationModal;
