import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "../api/kanban";
import EditBoardModal from "./EditBoardModal";

function DeleteBoardModal({ isOpen, onClose, onDelete, board }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-board-dark rounded-2xl shadow-2xl w-[480px] max-w-full flex flex-col px-6 pt-8 pb-6">
        <h2 className="text-2xl font-bold text-red-500 mb-6">
          Delete this board?
        </h2>
        <p className="text-[#828FA3] mb-8 text-base">
          Are you sure you want to delete the{" "}
          <span className="font-bold text-white">
            &lsquo;{board?.name}&rsquo;
          </span>{" "}
          board? This action will remove all columns and tasks and cannot be
          reversed.
        </p>
        <div className="flex gap-4 mt-4">
          <button
            onClick={onDelete}
            className="flex-1 py-3 bg-red-500 text-white font-bold rounded-[20px] text-base hover:bg-red-600 transition shadow"
          >
            Delete
          </button>
          <button
            onClick={onClose}
            className="flex-1 py-3 bg-white text-[#635FC7] font-bold rounded-[20px] text-base hover:bg-[#A8A4FF]/30 transition shadow"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default function BoardDropdown({ board, onEdit }) {
  const [open, setOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteBoardMutation = useMutation({
    mutationFn: (id) => boardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
    },
  });

  const handleDelete = () => {
    deleteBoardMutation.mutate(board.id);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1 rounded hover:bg-gray-200"
        tabIndex={-1}
      >
        ⋮
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
          <button
            onClick={() => {
              setIsEditModalOpen(true);
              setOpen(false);
            }}
            className="block w-full text-right px-4 py-2 text-black hover:bg-gray-100"
          >
            Edit
          </button>
          <button
            onClick={() => {
              setIsDeleteModalOpen(true);
              setOpen(false);
            }}
            className="block w-full text-right px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            Delete
          </button>
        </div>
      )}
      <EditBoardModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        board={board}
      />
      <DeleteBoardModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onDelete={handleDelete}
        board={board}
      />
    </div>
  );
}
