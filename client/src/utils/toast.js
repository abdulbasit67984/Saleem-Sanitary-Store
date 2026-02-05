import { toast } from 'react-toastify';

const defaultOptions = {
  position: "bottom-right",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showSuccessToast = (message, options = {}) => {
  toast.success(message, { ...defaultOptions, ...options });
};

export const showErrorToast = (message, options = {}) => {
  toast.error(message, { ...defaultOptions, ...options });
};

export const showWarningToast = (message, options = {}) => {
  toast.warning(message, { ...defaultOptions, ...options });
};

export const showInfoToast = (message, options = {}) => {
  toast.info(message, { ...defaultOptions, ...options });
};

export const showLoadingToast = (message = "Loading...") => {
  return toast.loading(message, { position: "top-right" });
};

export const updateToast = (toastId, { type, message, isLoading = false }) => {
  toast.update(toastId, {
    render: message,
    type: type,
    isLoading: isLoading,
    ...defaultOptions,
  });
};

export const dismissToast = (toastId) => {
  toast.dismiss(toastId);
};

export default {
  success: showSuccessToast,
  error: showErrorToast,
  warning: showWarningToast,
  info: showInfoToast,
  loading: showLoadingToast,
  update: updateToast,
  dismiss: dismissToast,
};
