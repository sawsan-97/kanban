"use client";

import { useState, useEffect } from "react";
import { Droppable } from "react-beautiful-dnd";
import { PlusIcon } from "@heroicons/react/24/solid";
import Task from "./Task";
import AddTaskModal from "./AddTaskModal";
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { columnsApi } from "../api/kanban";

const columnColors = [
  "bg-[#49C4E5]", // blue
  "bg-[#8471F2]", // purple
  "bg-[#67E2AE]", // green
  "bg-[#E9A6A6]", // red
  "bg-[#F5D76E]", // yellow
];

export default function Column({
  column,
  colorIndex = 0,
  activeBoard,
  columns,
}) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const queryClient = useQueryClient();

  // حذف العمود
  const deleteColumnMutation = useMutation({
    mutationFn: (id) => columnsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      setShowDeleteModal(false);
    },
  });
  const handleDeleteColumn = () => {
    deleteColumnMutation.mutate(column.id);
  };

  // نافذة تأكيد حذف العمود
  function DeleteColumnModal({ isOpen, onClose, onDelete }) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-board-dark rounded-2xl shadow-2xl w-[400px] max-w-full flex flex-col px-6 pt-8 pb-6">
          <h2 className="text-2xl font-bold text-red-500 mb-6">
            Delete this column?
          </h2>
          <p className="text-[#828FA3] mb-8 text-base">
            Are you sure you want to delete the{" "}
            <span className="font-bold text-white">
              &lsquo;{column.name}&rsquo;
            </span>{" "}
            column? This action will remove all tasks in this column and cannot
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

  function EditColumnModal({ isOpen, onClose, column }) {
    const queryClient = useQueryClient();
    const [name, setName] = useState(column?.name || "");
    const [loading, setLoading] = useState(false);

    useEffect(() => {
      setName(column?.name || "");
    }, [column]);

    const updateColumnMutation = useMutation({
      mutationFn: (data) => columnsApi.update(column.id, data),
      onSuccess: () => {
        queryClient.invalidateQueries(["boards"]);
        onClose();
      },
      onError: () => {
        alert("An error occurred while updating the column");
      },
    });

    const handleSubmit = (e) => {
      e.preventDefault();
      if (!name.trim()) {
        alert("Please enter a column name");
        return;
      }
      setLoading(true);
      updateColumnMutation.mutate({ name });
    };

    if (!isOpen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white dark:bg-board-dark rounded-2xl shadow-2xl w-[400px] max-w-full flex flex-col px-6 pt-8 pb-6">
          <h2 className="text-2xl font-bold text-[#20212C] dark:text-white mb-6">
            Edit Column
          </h2>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-2">
            <div>
              <label className="block text-sm font-semibold text-[#20212C] dark:text-white mb-2">
                Column Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 rounded-lg border border-[#3E3F4E] bg-white dark:bg-board-dark text-[#20212C] dark:text-white placeholder:text-[#828FA3] focus:outline-none focus:border-[#635FC7] transition mb-4"
                placeholder="e.g. Doing"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-[#635FC7] text-white font-bold rounded-[20px] text-base hover:bg-[#A8A4FF] transition shadow"
              disabled={loading}
            >
              {loading ? "...Saving" : "Save Changes"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-w-[180px] flex flex-col bg-white dark:bg-[#2B2C37] rounded-xl p-2 sm:p-4 shadow-md">
      {/* Header: Adjust direction based on column name language */}
      <div
        className={`flex items-center gap-2 mb-6 mt-2 px-2 ${
          /^([A-Za-z0-9 _-]+)$/.test(column.name)
            ? "flex-row"
            : "flex-row-reverse"
        }`}
        dir={/^([A-Za-z0-9 _-]+)$/.test(column.name) ? "ltr" : "rtl"}
      >
        <span
          className={`w-3 h-3 rounded-full ${
            columnColors[colorIndex % columnColors.length]
          }`}
        ></span>
        <h3 className="font-semibold text-xs tracking-widest uppercase text-[#828FA3]">
          {column.name}{" "}
          <span className="font-normal">({column.tasks.length})</span>
        </h3>
        <div className="ml-auto relative">
          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <EllipsisHorizontalIcon className="h-5 w-5 text-[#828FA3]" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 top-8 bg-white dark:bg-board-dark border border-[#E4EBFA] dark:border-[#3E3F4E] rounded shadow-lg z-50 min-w-[120px]">
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
      <Droppable droppableId={String(column.id)}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-5 flex-1 min-h-[120px]"
          >
            {column.tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                columns={columns}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button
        onClick={() => setIsAddTaskModalOpen(true)}
        className="mt-6 flex items-center justify-center gap-2 bg-transparent border-none text-[#635FC7] px-4 py-2 rounded-full hover:bg-[#635FC7]/10 transition-colors font-semibold"
        style={{ border: "none" }}
      >
        <PlusIcon className="h-5 w-5" />
        <span>Add Task</span>
      </button>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        columnId={column.id}
        activeBoard={activeBoard}
        columns={columns}
      />
      {/* نافذة تأكيد حذف العمود */}
      <DeleteColumnModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onDelete={handleDeleteColumn}
      />
      {/* نافذة تعديل العمود */}
      {showEditModal && (
        <EditColumnModal
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
          column={column}
        />
      )}
    </div>
  );
}
