"use client";

import { useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardsApi, columnsApi, tasksApi } from "../api/kanban";

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

export default function Board({ activeBoardId, boardsData }) {
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

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
      order: columns.length,
    });
  };

  // تأكد أن الأعمدة دائمًا Array
  const columns = Array.isArray(activeBoard?.columns)
    ? activeBoard.columns
    : [];

  // منطق السحب والإفلات للتاسك
  const onDragEnd = async (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    // إذا لم يتغير العمود أو الترتيب، لا تفعل شيئًا
    if (
      source.droppableId === destination.droppableId &&
      source.index === destination.index
    ) {
      return;
    }
    // إذا تغير العمود
    if (source.droppableId !== destination.droppableId) {
      try {
        await tasksApi.update(draggableId, {
          columnId: destination.droppableId,
          order: destination.index,
        });
        queryClient.invalidateQueries(["boards"]);
      } catch (err) {
        alert("حدث خطأ أثناء نقل المهمة!");
      }
    }
    // (اختياري) إذا أردت دعم ترتيب المهام داخل نفس العمود، أضف منطق هنا
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
    <div className="flex-1 px-10 py-8 overflow-x-auto">
      {/* Board Header */}
      <div className="flex items-center mb-8">
        <h1 className="text-2xl font-bold text-[#20212C] dark:text-white">
          {activeBoard.name}
        </h1>
      </div>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-row-reverse gap-8 min-h-[80vh] items-start pl-16 min-w-0 justify-center">
          {columns.length > 0 &&
            columns.map((column, idx) => (
              <Column
                key={column.id}
                column={column}
                colorIndex={idx}
                activeBoard={activeBoard}
                columns={columns}
              />
            ))}
          {showAddColumn ? (
            <AddColumnCard
              newColumnName={newColumnName}
              setNewColumnName={setNewColumnName}
              handleAddColumn={handleAddColumn}
              setShowAddColumn={setShowAddColumn}
              errorMsg={errorMsg}
            />
          ) : columns.length === 0 ? (
            <div className="flex flex-col items-center justify-center w-full mt-24">
              <p className="mb-8 text-lg text-[#828FA3] dark:text-[#828FA3] font-medium text-center">
                This board is empty. Create a new column to get started.
              </p>
              <button
                className="bg-[#635FC7] text-white px-8 py-3 rounded-full hover:bg-[#A8A4FF] transition-colors font-semibold shadow-md"
                onClick={() => setShowAddColumn(true)}
              >
                + Add New Column
              </button>
            </div>
          ) : (
            <button
              onClick={() => setShowAddColumn(true)}
              className="min-w-[280px] max-w-xs w-80 h-[56px] mt-10 flex items-center justify-center bg-transparent border-none text-[#635FC7] text-lg font-bold rounded-[24px] hover:bg-[#635FC7]/10 transition-colors shadow-none outline-none"
              style={{ border: "none" }}
            >
              <PlusIcon className="h-6 w-6 mr-2" />
              New Column
            </button>
          )}
        </div>
      </DragDropContext>
    </div>
  );
}
