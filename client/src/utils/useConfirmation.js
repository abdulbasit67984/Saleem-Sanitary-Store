import { useState, useCallback } from 'react';

/**
 * Custom hook for using the confirmation modal
 * @returns {Object} - { isOpen, modalProps, showConfirmation, hideConfirmation }
 */
const useConfirmation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [modalProps, setModalProps] = useState({
    title: '',
    message: '',
    type: 'confirm',
    confirmText: '',
    cancelText: 'Cancel',
    onConfirm: () => {},
    isLoading: false,
  });

  const showConfirmation = useCallback(({
    title = '',
    message = 'Are you sure you want to proceed?',
    type = 'confirm',
    confirmText = '',
    cancelText = 'Cancel',
    onConfirm = () => {},
  }) => {
    setModalProps({
      title,
      message,
      type,
      confirmText,
      cancelText,
      onConfirm,
      isLoading: false,
    });
    setIsOpen(true);
  }, []);

  const hideConfirmation = useCallback(() => {
    setIsOpen(false);
  }, []);

  const setLoading = useCallback((loading) => {
    setModalProps(prev => ({ ...prev, isLoading: loading }));
  }, []);

  return {
    isOpen,
    modalProps,
    showConfirmation,
    hideConfirmation,
    setLoading,
  };
};

export default useConfirmation;
