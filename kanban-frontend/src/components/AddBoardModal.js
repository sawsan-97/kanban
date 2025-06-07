"use client";

import { useState } from "react";
import { useDispatch } from "react-redux";
import { addBoard } from "@/store/boardsSlice";
import { XMarkIcon } from "@heroicons/react/24/outline";
import { boardsApi } from "../api/kanban";
import { useQueryClient } from "@tanstack/react-query";
import React from "react";

export default function AddBoardModal({ isOpen, onClose }) {
  const queryClient = useQueryClient();
  const [boardName, setBoardName] = useState("");
  const [columns, setColumns] = useState([{ name: "Todo" }, { name: "Doing" }]);
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) {
      setBoardName("");
      setColumns([{ name: "Todo" }, { name: "Doing" }]);
    }
  }, [isOpen]);

  const handleColumnChange = (idx, value) => {
    setColumns((cols) =>
      cols.map((col, i) => (i === idx ? { ...col, name: value } : col))
    );
  };

  const handleAddColumn = () => {
    setColumns((cols) => [...cols, { name: "" }]);
  };

  const handleRemoveColumn = (idx) => {
    setColumns((cols) => cols.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) {
      alert("Please enter a board name");
      return;
    }
    if (columns.some((col) => !col.name.trim())) {
      alert("Please enter a name for all columns");
      return;
    }
    setLoading(true);
    try {
      await boardsApi.create({
        name: boardName,
        // columns: columns.map((col) => ({ name: col.name })), // مؤقتاً لا ترسل الأعمدة
      });
      queryClient.invalidateQueries(["boards"]);
      onClose();
    } catch (err) {
      alert("An error occurred while adding the board");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-board-dark rounded-2xl shadow-2xl w-full max-w-md flex flex-col px-6 pt-8 pb-6">
        <h2 className="text-2xl font-bold text-[#20212C] dark:text-white mb-6">
          Add New Board
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-2">
          <div>
            <label className="block text-sm font-semibold text-[#20212C] dark:text-white mb-2">
              Board Name
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full p-3 rounded-lg border border-[#E4EBFA] bg-white dark:bg-board-dark text-[#20212C] dark:text-white placeholder:text-[#828FA3] focus:outline-none focus:border-[#635FC7] transition mb-4"
              placeholder="e.g. Web Design"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#20212C] dark:text-white mb-2">
              Board Columns
            </label>
            {columns.map((col, idx) => (
              <div key={idx} className="flex items-center gap-2 mb-3">
                <input
                  type="text"
                  value={col.name}
                  onChange={(e) => handleColumnChange(idx, e.target.value)}
                  className="flex-1 p-3 rounded-lg border border-[#E4EBFA] bg-white dark:bg-board-dark text-[#20212C] dark:text-white placeholder:text-[#828FA3] focus:outline-none focus:border-[#635FC7] transition"
                  placeholder="Column Name"
                  required
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColumn(idx)}
                  className="text-[#828FA3] hover:text-red-500"
                  tabIndex={-1}
                  aria-label="Remove column"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={handleAddColumn}
              className="w-full py-3 bg-white text-[#635FC7] font-bold rounded-full text-base hover:bg-[#A8A4FF]/20 border border-[#E4EBFA] transition mb-2"
            >
              + Add New Column
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#635FC7] text-white font-bold rounded-full text-base hover:bg-[#A8A4FF] transition shadow mt-2"
            disabled={loading}
          >
            {loading ? "...Saving" : "Create New Board"}
          </button>
        </form>
      </div>
    </div>
  );
}
