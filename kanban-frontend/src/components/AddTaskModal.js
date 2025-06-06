"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTask } from "@/store/boardsSlice";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

export default function AddTaskModal({ isOpen, onClose, columnId }) {
  const dispatch = useDispatch();
  const { activeBoard } = useSelector((state) => state.boards);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([""]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newTask = {
      id: Date.now().toString(),
      title,
      description,
      subtasks: subtasks
        .filter((subtask) => subtask.trim())
        .map((subtask) => ({
          id: Date.now().toString() + Math.random(),
          title: subtask,
          completed: false,
        })),
    };

    dispatch(
      addTask({
        boardId: activeBoard.id,
        columnId,
        task: newTask,
      })
    );

    onClose();
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
