import React from "react";
import { FaTrashAlt } from "react-icons/fa";

const ConfirmDeleteModal = ({ isOpen, onClose, onConfirm, itemID }) => {
  if (!isOpen) return null; // Don't render if not open

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <FaTrashAlt className="text-red-500 text-4xl mx-auto mb-3" />
        <h2 className="text-xl font-semibold">Confirm Deletion</h2>
        <p className="text-gray-600 my-3">Are you sure you want to delete item 
            {/* #{itemID} */}
            ?</p>
        
        <div className="flex justify-center space-x-4 mt-4">
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
            onClick={onConfirm}
          >
            Yes, Delete
          </button>
          <button
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
