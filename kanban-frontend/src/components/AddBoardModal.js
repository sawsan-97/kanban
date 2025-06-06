"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBoard } from "@/store/boardsSlice";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function AddBoardModal({ isOpen, onClose }) {
  const dispatch = useDispatch();
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState(["Todo", "Doing"]);

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
      <div className="bg-[#2B2C37] rounded-2xl shadow-2xl w-[480px] max-w-full flex flex-col px-6 pt-8 pb-6">
        <h2 className="text-2xl font-bold text-white mb-6">Add New Board</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-2">
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              Board Name
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full p-3 rounded-lg border border-[#3E3F4E] bg-transparent text-white placeholder:text-[#828FA3] focus:outline-none focus:border-[#635FC7] transition mb-4"
              placeholder="e.g. Web Design"
              required
            />
            <label className="block text-sm font-semibold text-white mb-2">
              Board Columns
            </label>
            <div className="flex flex-col gap-3 mb-4">
              {columns.map((column, index) => (
                <div key={index} className="flex items-center gap-3">
                  <input
                    type="text"
                    value={column}
                    onChange={(e) => updateColumn(index, e.target.value)}
                    className="flex-1 p-3 rounded-lg border border-[#3E3F4E] bg-transparent text-white placeholder:text-[#828FA3] focus:outline-none focus:border-[#635FC7] transition"
                    placeholder="Column name"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeColumn(index)}
                    className="p-2 hover:bg-[#635FC7]/10 rounded-full"
                    tabIndex={-1}
                  >
                    <XMarkIcon className="h-6 w-6 text-[#828FA3]" />
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={addColumn}
              className="w-full py-3 bg-white text-[#635FC7] font-bold rounded-[20px] text-base hover:bg-[#A8A4FF]/30 transition mb-4"
            >
              Add New Column +
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#635FC7] text-white font-bold rounded-[20px] text-base hover:bg-[#A8A4FF] transition shadow"
          >
            Create New Board
          </button>
        </form>
      </div>
    </div>
  );
}
