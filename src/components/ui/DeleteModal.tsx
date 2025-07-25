import React from 'react';
import Modal from '../ui/modal';

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDelete: () => void;
  message?: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({ isOpen, onClose, onDelete, message }) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 w-[90vw] max-w-[400px] flex flex-col items-center">
        <div className="text-2xl text-red-600 mb-4">⚠️</div>
        <div className="text-lg font-semibold mb-2 text-center">
          Are you sure you want to delete?
        </div>
        <div className="text-gray-600 dark:text-gray-300 mb-6 text-center">
          {message || 'This action cannot be undone.'}
        </div>
        <div className="flex gap-4 w-full justify-center">
          <button
            className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 transition"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 transition"
            onClick={() => {
              onDelete();
              onClose();
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteModal;
