import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { boardsApi, columnsApi } from "../api/kanban";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function EditBoardModal({ isOpen, onClose, board }) {
  const queryClient = useQueryClient();
  const [boardName, setBoardName] = useState(board?.name || "");
  const [columns, setColumns] = useState([]); // [{id, name}]
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setBoardName(board?.name || "");
    setColumns(
      Array.isArray(board?.columns)
        ? board.columns.map((col) => ({ id: col.id, name: col.name }))
        : []
    );
  }, [board]);

  const updateColumnName = (idx, value) => {
    setColumns((cols) =>
      cols.map((col, i) => (i === idx ? { ...col, name: value } : col))
    );
  };

  const removeColumn = (idx) => {
    setColumns((cols) => cols.filter((_, i) => i !== idx));
  };

  const addColumn = () => {
    setColumns((cols) => [...cols, { id: undefined, name: "" }]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!boardName.trim()) {
      alert("يرجى إدخال اسم اللوحة");
      return;
    }
    if (columns.some((col) => !col.name.trim())) {
      alert("يرجى إدخال اسم لكل عمود");
      return;
    }
    setLoading(true);
    try {
      // 1. تحديث اسم اللوحة
      await boardsApi.update(board.id, { name: boardName });
      // 2. تحديث الأعمدة
      const originalCols = Array.isArray(board?.columns) ? board.columns : [];
      // حذف الأعمدة التي أزيلت
      for (const col of originalCols) {
        if (!columns.find((c) => c.id === col.id)) {
          await columnsApi.delete(col.id);
        }
      }
      // إضافة أو تحديث الأعمدة
      for (let i = 0; i < columns.length; i++) {
        const col = columns[i];
        if (col.id) {
          await columnsApi.update(col.id, { name: col.name, order: i });
        } else {
          await columnsApi.create({
            name: col.name,
            boardId: board.id,
            order: i,
          });
        }
      }
      queryClient.invalidateQueries(["boards"]);
      onClose();
    } catch (err) {
      alert("حدث خطأ أثناء تعديل اللوحة أو الأعمدة");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !board) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="bg-board-dark rounded-2xl shadow-2xl w-full max-w-md flex flex-col px-6 pt-8 pb-6"
        dir="rtl"
      >
        <h2 className="text-2xl font-bold text-white mb-6 text-right">
          Edit Board
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 pb-2">
          <div>
            <label className="block text-sm font-semibold text-white mb-2 text-right">
              Board Name
            </label>
            <input
              type="text"
              value={boardName}
              onChange={(e) => setBoardName(e.target.value)}
              className="w-full p-3 rounded-lg border border-[#20212C] bg-board-dark text-white placeholder:text-[#828FA3] focus:outline-none focus:border-[#635FC7] transition mb-4 text-right"
              placeholder="e.g. Platform Launch"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-white mb-2 text-right">
              Board Columns
            </label>
            {columns.map((col, idx) => (
              <div
                key={col.id || idx}
                className="flex items-center gap-2 mb-3 flex-row-reverse"
              >
                <input
                  type="text"
                  value={col.name}
                  onChange={(e) => updateColumnName(idx, e.target.value)}
                  className="flex-1 p-3 rounded-lg border border-[#20212C] bg-board-dark text-white placeholder:text-[#828FA3] focus:outline-none focus:border-[#635FC7] transition text-right"
                  placeholder="Column Name"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeColumn(idx)}
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
              onClick={addColumn}
              className="w-full py-3 bg-white text-[#635FC7] font-bold rounded-full text-base hover:bg-[#A8A4FF]/20 border-none transition mb-2"
            >
              + Add New Column
            </button>
          </div>
          <button
            type="submit"
            className="w-full py-3 bg-[#635FC7] text-white font-bold rounded-full text-base hover:bg-[#A8A4FF] transition shadow mt-2"
            disabled={loading}
          >
            {loading ? "...Saving" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
