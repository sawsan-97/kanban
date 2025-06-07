"use client";

import { useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardsApi, columnsApi, tasksApi } from "../api/kanban";
import AddTaskModal from "./AddTaskModal";

// مكون بطاقة إضافة عمود جديد خارج دالة Board
function AddColumnCard({
  newColumnName,
  setNewColumnName,
  handleAddColumn,
  setShowAddColumn,
  errorMsg,
}) {
  return (
    <div className="min-w-[280px] max-w-xs w-80 flex flex-col bg-[#2B2C37] rounded-xl p-4 shadow-md justify-center items-center">
      <h2 className="text-lg font-bold mb-4 text-white">Add New Column</h2>
      {errorMsg && <div className="text-red-500 mb-2">{errorMsg}</div>}
      <input
        type="text"
        className="border p-2 rounded w-full mb-4"
        placeholder="Column name"
        value={newColumnName}
        onChange={(e) => setNewColumnName(e.target.value)}
      />
      <div className="flex gap-2">
        <button
          className="bg-[#635FC7] text-white px-4 py-2 rounded"
          onClick={handleAddColumn}
        >
          Save
        </button>
        <button
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
          onClick={() => setShowAddColumn(false)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default function Board({ activeBoardId, boardsData, isSidebarOpen }) {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [localColumns, setLocalColumns] = useState([]);

  const activeBoard = boardsData.find((board) => board.id === activeBoardId);

  const queryClient = useQueryClient();

  const addColumnMutation = useMutation({
    mutationFn: (data) => columnsApi.create(data),
    onSuccess: (data) => {
      console.log("Column added successfully:", data);
      queryClient.invalidateQueries(["boards"]);
      setShowAddColumn(false);
      setNewColumnName("");
      setErrorMsg("");
    },
    onError: (error) => {
      setErrorMsg("حدث خطأ أثناء إضافة العمود");
      console.error("Error adding column:", error);
    },
  });

  const handleAddColumn = async () => {
    if (!newColumnName.trim()) return;
    setErrorMsg("");
    addColumnMutation.mutate({
      boardId: String(activeBoard.id),
      name: newColumnName,
      order: localColumns.length,
    });
  };

  // تأكد أن الأعمدة دائمًا Array ومرتبة حسب order
  const columns = Array.isArray(activeBoard?.columns)
    ? [...activeBoard.columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  useEffect(() => {
    if (JSON.stringify(columns) !== JSON.stringify(localColumns)) {
      setLocalColumns(columns);
    }
  }, [columns, localColumns]);

  // منطق السحب والإفلات للتاسك
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (
      !destination ||
      (source.droppableId === destination.droppableId &&
        source.index === destination.index)
    ) {
      return;
    }

    // نسخ الأعمدة محلياً (نسخة عميقة)
    const updatedColumns = localColumns.map((col) => ({
      ...col,
      tasks: [...col.tasks],
    }));
    const sourceColIdx = updatedColumns.findIndex(
      (col) => String(col.id) === String(source.droppableId)
    );
    const destColIdx = updatedColumns.findIndex(
      (col) => String(col.id) === String(destination.droppableId)
    );
    if (sourceColIdx === -1 || destColIdx === -1) return;

    const sourceTasks = Array.from(updatedColumns[sourceColIdx].tasks);
    const [removed] = sourceTasks.splice(source.index, 1);

    if (sourceColIdx === destColIdx) {
      // إعادة ترتيب داخل نفس العمود
      sourceTasks.splice(destination.index, 0, removed);
      updatedColumns[sourceColIdx].tasks = sourceTasks;
    } else {
      // نقل بين عمودين
      const destTasks = Array.from(updatedColumns[destColIdx].tasks);
      destTasks.splice(destination.index, 0, removed);
      updatedColumns[sourceColIdx].tasks = sourceTasks;
      updatedColumns[destColIdx].tasks = destTasks;
    }
    setLocalColumns(updatedColumns);

    // تحديث المهمة في السيرفر
    try {
      await tasksApi.update(String(draggableId), {
        columnId: String(destination.droppableId),
        order: destination.index,
      });
      // جلب البيانات من السيرفر بعد نجاح التحديث
      queryClient.invalidateQueries(["boards"]);
    } catch (err) {
      alert("حدث خطأ أثناء نقل المهمة!");
    }
  };

  if (!activeBoard) {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-10 bg-transparent">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">No Active Board</h2>
          <p className="text-secondary">
            Select a board from the sidebar or create a new one
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-2 sm:px-10 py-0 sm:py-0 overflow-x-auto">
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={`flex flex-col sm:flex-row-reverse gap-4 sm:gap-8 min-h-[60vh] sm:min-h-[80vh] items-start min-w-0 w-full ${
            isSidebarOpen ? "sm:ml-72" : ""
          }`}
        >
          {localColumns.length > 0 &&
            localColumns.map((column, idx) => (
              <div className="flex-1 min-w-[220px]" key={String(column.id)}>
                <Column
                  column={column}
                  colorIndex={idx}
                  activeBoard={activeBoard}
                  columns={localColumns}
                />
              </div>
            ))}
          {showAddColumn ? (
            <div className="min-w-[280px] max-w-xs w-80 h-[56px] mt-10 flex flex-col items-center justify-center bg-transparent border-none rounded-[24px]">
              <input
                type="text"
                className="w-full p-3 rounded-lg border border-[#635FC7] bg-white dark:bg-board-dark text-[#20212C] dark:text-white placeholder:text-[#828FA3] focus:outline-none focus:border-[#635FC7] transition mb-2"
                placeholder="New column name"
                value={newColumnName}
                onChange={(e) => setNewColumnName(e.target.value)}
                autoFocus
              />
              <div className="flex gap-2 w-full">
                <button
                  className="flex-1 py-2 bg-[#635FC7] text-white font-bold rounded-[20px] text-base hover:bg-[#A8A4FF] dark:hover:bg-[#635FC7]/80 transition shadow"
                  onClick={handleAddColumn}
                  disabled={
                    !newColumnName.trim() || addColumnMutation.isLoading
                  }
                >
                  Save
                </button>
                <button
                  className="flex-1 py-2 bg-gray-200 dark:bg-gray-700 text-[#635FC7] font-bold rounded-[20px] text-base hover:bg-gray-300 dark:hover:bg-gray-600 transition shadow"
                  onClick={() => {
                    setShowAddColumn(false);
                    setNewColumnName("");
                  }}
                >
                  Cancel
                </button>
              </div>
              {errorMsg && (
                <div className="text-red-500 mt-2 text-sm w-full text-center">
                  {errorMsg}
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => setShowAddColumn(true)}
              className="min-w-[280px] max-w-xs w-80 h-[56px] mt-10 flex items-center justify-center bg-transparent border-none text-[#635FC7] text-lg font-bold rounded-[24px] hover:bg-[#635FC7]/10 transition-colors shadow-none outline-none"
              style={{ border: "none" }}
            >
              <PlusIcon className="h-6 w-6 mr-2" /> Add New Column
            </button>
          )}
        </div>
      </DragDropContext>
    </div>
  );
}
