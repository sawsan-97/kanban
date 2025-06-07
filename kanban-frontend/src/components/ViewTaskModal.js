"use client";

import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { subtasksApi, tasksApi } from "../api/kanban";
import { useState } from "react";
import EditTaskModal from "./EditTaskModal";

export default function ViewTaskModal({
  isOpen,
  onClose,
  task,
  columnId,
  columns,
}) {
  const dispatch = useDispatch();
  const { activeBoard } = useSelector((state) => state.boards);
  const queryClient = useQueryClient();
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  const updateSubtaskMutation = useMutation({
    mutationFn: ({ id, completed }) => subtasksApi.update(id, { completed }),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: ({ id, columnId }) => tasksApi.update(id, { columnId }),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: (id) => tasksApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      setShowDeleteModal(false);
      onClose();
    },
  });

  const handleDeleteTask = () => {
    deleteTaskMutation.mutate(task.id);
  };

  if (!isOpen || !task) return null;

  const completedSubtasks =
    task.subtasks?.filter((s) => s.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  function DeleteTaskModal({ isOpen, onClose, onDelete }) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-[#2B2C37] rounded-2xl shadow-2xl w-[480px] max-w-full flex flex-col px-6 pt-8 pb-6">
          <h2 className="text-2xl font-bold text-red-500 mb-6">
            Delete this task?
          </h2>
          <p className="text-[#828FA3] mb-8 text-base">
            Are you sure you want to delete the{" "}
            <span className="font-bold text-white">
              &lsquo;{task.title}&rsquo;
            </span>{" "}
            task? This action will remove the task and its subtasks and cannot
            be reversed.
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-board-dark rounded-2xl p-8 w-full max-w-lg shadow-xl relative">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-[#20212C] dark:text-white">
            {task.title}
          </h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <EllipsisHorizontalIcon className="h-6 w-6 text-[#828FA3]" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <span className="text-2xl">×</span>
            </button>
            {menuOpen && (
              <div className="absolute right-8 top-14 bg-white dark:bg-board-dark border border-[#E4EBFA] dark:border-[#3E3F4E] rounded shadow-lg z-50 min-w-[140px]">
                <button
                  onClick={() => {
                    setShowEditModal(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#20212C]/60 text-[#635FC7]"
                >
                  Edit
                </button>
                <button
                  onClick={() => {
                    setShowDeleteModal(true);
                    setMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-[#20212C]/60"
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        </div>
        <p className="text-[#828FA3] dark:text-[#828FA3] mb-6">
          {task.description}
        </p>

        <div className="mb-6">
          <h3 className="text-xs font-bold mb-4 text-[#828FA3]">
            Subtasks ({completedSubtasks} of {totalSubtasks})
          </h3>
          <div className="flex flex-col gap-3">
            {task.subtasks?.map((subtask) => (
              <label
                key={subtask.id}
                className={`flex items-center gap-3 p-3 rounded-lg ${
                  subtask.completed
                    ? "bg-[#635FC7]/10 line-through text-[#828FA3]"
                    : "bg-[#F4F7FD] dark:bg-[#20212C]"
                }`}
              >
                <input
                  type="checkbox"
                  checked={subtask.completed}
                  onChange={() =>
                    updateSubtaskMutation.mutate({
                      id: subtask.id,
                      completed: !subtask.completed,
                    })
                  }
                  className="accent-[#635FC7] w-5 h-5 rounded"
                />
                <span className="text-sm">{subtask.title}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold mb-2 text-[#828FA3]">
            Current Status
          </h3>
          <select
            className="w-full p-3 border border-[#E4EBFA] dark:border-[#3E3F4E] rounded-lg bg-white dark:bg-board-dark text-[#20212C] dark:text-white"
            value={columnId}
            onChange={(e) =>
              updateTaskMutation.mutate({
                id: task.id,
                columnId: e.target.value,
              })
            }
          >
            {columns?.map((col) => (
              <option key={col.id} value={col.id}>
                {col.name}
              </option>
            ))}
          </select>
        </div>
        <DeleteTaskModal
          isOpen={showDeleteModal}
          onClose={() => setShowDeleteModal(false)}
          onDelete={handleDeleteTask}
        />
        {/* نافذة تعديل المهمة (سيتم تنفيذها لاحقًا) */}
        {showEditModal && (
          <EditTaskModal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            task={task}
            columnId={columnId}
            columns={columns}
            activeBoard={activeBoard}
          />
        )}
      </div>
    </div>
  );
}
