import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createColumn } from "../api/kanban";

const NewColumn = ({ boardId, onClose }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const queryClient = useQueryClient();

  const createColumnMutation = useMutation({
    mutationFn: createColumn,
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      onClose();
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createColumnMutation.mutateAsync({
        boardId,
        name,
      });
    } catch (error) {
      console.error("Error creating column:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-w-0 w-full sm:min-w-[280px] sm:max-w-xs sm:w-80 flex flex-col bg-white dark:bg-[#2B2C37] rounded-xl p-2 sm:p-4 shadow-md">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <h3 className="text-base sm:text-lg font-semibold text-[#20212C] dark:text-white">
          إضافة عمود جديد
        </h3>
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div>
          <label className="block text-sm font-semibold text-[#20212C] dark:text-white mb-2">
            اسم العمود
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 rounded-lg border border-[#3E3F4E] bg-white dark:bg-board-dark text-[#20212C] dark:text-white placeholder:text-[#828FA3] focus:outline-none focus:border-[#635FC7] transition"
            placeholder="مثال: قيد التنفيذ"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-[#635FC7] text-white font-bold rounded-[20px] text-base hover:bg-[#A8A4FF] dark:hover:bg-[#635FC7]/80 transition shadow"
          disabled={loading}
        >
          {loading ? "...جاري الإضافة" : "إضافة العمود"}
        </button>
      </form>
    </div>
  );
};

export default NewColumn;
