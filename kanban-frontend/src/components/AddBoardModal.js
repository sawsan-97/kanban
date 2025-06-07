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
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isOpen) setBoardName("");
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) {
      alert("Please enter a board name");
      return;
    }
    setLoading(true);
    try {
      await boardsApi.create({ name: boardName });
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
              placeholder="e.g. Platform Launch"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#635FC7] text-white font-bold rounded-[20px] text-base hover:bg-[#A8A4FF] transition shadow"
            disabled={loading}
          >
            {loading ? "...Saving" : "Create Board"}
          </button>
        </form>
      </div>
    </div>
  );
}
