"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBoard } from "@/store/boardsSlice";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddBoardModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState(["Todo", "Done"]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newBoard = {
      id: Date.now().toString(),
      name: boardName,
      columns: columns.map((name, index) => ({
        id: `column-${index}`,
        name,
        tasks: [],
      })),
    };
    dispatch(addBoard(newBoard));
    onClose();
  };

  const addColumn = () => {
    setColumns([...columns, ""]);
  };

  const updateColumn = (index, value) => {
    const newColumns = [...columns];
    newColumns[index] = value;
    setColumns(newColumns);
  };

  const removeColumn = (index) => {
    setColumns(columns.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-board-dark rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Add New Board</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Board Name</label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-board-dark"
              placeholder="e.g. Project Board"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Columns</label>
            {columns.map((column, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={column}
                  onChange={(e) => updateColumn(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-board-dark"
                  placeholder="Column name"
                  required
                />
                {columns.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColumn(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addColumn}
              className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              + Add Column
            </button>
          </div>

          <button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded-lg hover:bg-primary-light"
          >
            Create Board
          </button>
        </form>
      </div>
    </div>
  );
}
