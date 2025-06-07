"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addTask } from "@/store/boardsSlice";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, subtasksApi } from "../api/kanban";

export default function AddTaskModal({
  isOpen,
  onClose,
  columnId,
  activeBoard,
}) {
  const dispatch = useDispatch();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([""]);
  const queryClient = useQueryClient();

  const addTaskMutation = useMutation({
    mutationFn: (data) => tasksApi.create(data),
    onSuccess: async (task) => {
      if (subtasks.length > 0 && task?.data?.id) {
        await Promise.all(
          subtasks
            .filter((subtask) => subtask.trim())
            .map((subtask) =>
              subtasksApi.create({
                title: subtask,
                completed: false,
                taskId: task.data.id,
              })
            )
        );
      }
      queryClient.invalidateQueries(["boards"]);
      onClose();
    },
    onError: (error) => {
      alert("حدث خطأ أثناء إضافة المهمة");
      console.error("Error adding task:", error);
    },
  });

  if (!activeBoard) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !columnId) {
      alert("يرجى إدخال عنوان المهمة واختيار عمود");
      return;
    }
    const payload = {
      title: String(title),
      description: String(description || ""),
      order: 0,
      columnId: String(columnId),
    };
    console.log("Task payload:", payload);
    addTaskMutation.mutate(payload);
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, ""]);
  };

  const updateSubtask = (index, value) => {
    const newSubtasks = [...subtasks];
    newSubtasks[index] = value;
    setSubtasks(newSubtasks);
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-board-dark rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Task</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-board-dark"
              placeholder="e.g. Design the UI"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-board-dark"
              placeholder="e.g. Design the main user interface with focus on UX"
              rows="3"
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Subtasks</label>
            {subtasks.map((subtask, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={subtask}
                  onChange={(e) => updateSubtask(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-board-dark"
                  placeholder="e.g. Design homepage"
                />
                {subtasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubtask(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSubtask}
              className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              + Add Subtask
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded-lg hover:bg-primary-light"
          >
            Create Task
          </button>
        </form>
      </div>
    </div>
  );
}
