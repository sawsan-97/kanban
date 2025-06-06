"use client";

import { useDispatch, useSelector } from "react-redux";
import { XMarkIcon, EllipsisHorizontalIcon } from "@heroicons/react/24/outline";

export default function ViewTaskModal({ isOpen, onClose, task, columnId }) {
  const dispatch = useDispatch();
  const { activeBoard } = useSelector((state) => state.boards);

  if (!isOpen) return null;

  const completedSubtasks =
    task.subtasks?.filter((subtask) => subtask.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-board-dark rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">{task.title}</h2>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded">
              <EllipsisHorizontalIcon className="h-6 w-6" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>
        </div>

        <p className="text-secondary mb-6">{task.description}</p>

        {task.subtasks && task.subtasks.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold mb-4">
              Subtasks ({completedSubtasks} of {totalSubtasks})
            </h3>
            <div className="space-y-2">
              {task.subtasks.map((subtask) => (
                <div
                  key={subtask.id}
                  className="flex items-center gap-2 bg-gray-50 dark:bg-gray-800 p-3 rounded"
                >
                  <input
                    type="checkbox"
                    checked={subtask.completed}
                    onChange={() => {}}
                    className="w-4 h-4 rounded border-gray-300"
                  />
                  <span
                    className={`text-sm ${
                      subtask.completed ? "line-through text-secondary" : ""
                    }`}
                  >
                    {subtask.title}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold mb-2">Status</h3>
          <select
            className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-board-dark"
            value={columnId}
            onChange={() => {}}
          >
            {activeBoard?.columns.map((column) => (
              <option key={column.id} value={column.id}>
                {column.name}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
