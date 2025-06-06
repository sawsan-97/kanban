"use client";

import { useSelector } from "react-redux";
import { DragDropContext } from "react-beautiful-dnd";
import Column from "./Column";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function Board() {
  const { activeBoard } = useSelector((state) => state.boards);
  const [showAddColumn, setShowAddColumn] = useState(false);

  if (!activeBoard) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">لا توجد لوحة نشطة</h2>
          <p className="text-secondary">
            اختر لوحة من القائمة الجانبية أو أنشئ لوحة جديدة
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-10 py-8 overflow-x-auto">
      <DragDropContext onDragEnd={() => {}}>
        <div className="flex flex-row-reverse gap-8 min-h-[80vh] items-start">
          {activeBoard.columns.map((column, idx) => (
            <Column key={column.id} column={column} colorIndex={idx} />
          ))}
          <button
            onClick={() => setShowAddColumn(true)}
            className="min-w-[280px] max-w-xs w-80 h-[56px] mt-10 flex items-center justify-center bg-transparent border-none text-[#635FC7] text-lg font-bold rounded-[24px] hover:bg-[#635FC7]/10 transition-colors shadow-none outline-none"
            style={{ border: "none" }}
          >
            <PlusIcon className="h-6 w-6 mr-2" />
            New Column
          </button>
        </div>
      </DragDropContext>
    </div>
  );
}
