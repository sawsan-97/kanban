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
    <div className="flex-1 p-8 overflow-x-auto">
      <DragDropContext onDragEnd={() => {}}>
        <div className="flex gap-8 min-h-[80vh]">
          {activeBoard.columns.map((column, idx) => (
            <Column key={column.id} column={column} colorIndex={idx} />
          ))}
          <button
            onClick={() => setShowAddColumn(true)}
            className="min-w-[280px] max-w-xs w-80 h-[80vh] flex flex-col items-center justify-center bg-[#E4EBFA] dark:bg-[#2B2C37] border-2 border-dashed border-[#635FC7] text-[#635FC7] rounded-xl hover:bg-[#A8A4FF]/10 dark:hover:bg-[#635FC7]/10 transition-colors font-semibold shadow-md"
          >
            <PlusIcon className="h-8 w-8 mb-2" />
            <span className="text-lg">+ Add New Column</span>
          </button>
        </div>
      </DragDropContext>
    </div>
  );
}
