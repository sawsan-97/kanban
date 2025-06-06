"use client";

import Sidebar from "@/components/Sidebar";
import Board from "@/components/Board";
import { useSelector } from "react-redux";
import { PlusIcon } from "@heroicons/react/24/solid";
import { useState } from "react";

export default function Home() {
  const { activeBoard, isSidebarOpen } = useSelector((state) => state.boards);
  const [showAddTask, setShowAddTask] = useState(false);

  return (
    <main className="flex h-screen bg-[#F4F7FD] dark:bg-[#20212C] text-[#20212C] dark:text-white">
      <Sidebar />
      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-72" : ""
        }`}
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between px-10 py-6 border-b border-[#E4EBFA] dark:border-[#3E3F4E] bg-white dark:bg-[#2B2C37] shadow-sm min-h-[96px]">
          <h2 className="text-2xl font-bold tracking-wide text-[#20212C] dark:text-white">
            {activeBoard ? activeBoard.name : ""}
          </h2>
          {activeBoard && (
            <button
              onClick={() => setShowAddTask(true)}
              className="flex items-center gap-2 bg-[#635FC7] text-white px-6 py-3 rounded-full hover:bg-[#A8A4FF] transition-colors font-semibold shadow-md"
            >
              <PlusIcon className="h-5 w-5" />
              <span>Add New Task</span>
            </button>
          )}
        </div>
        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center bg-[#F4F7FD] dark:bg-[#20212C]">
          {activeBoard ? (
            activeBoard.columns.length === 0 ? (
              <div className="text-center">
                <p className="mb-8 text-lg text-[#828FA3] dark:text-[#828FA3] font-medium">
                  This board is empty. Create a new column to get started.
                </p>
                <button className="bg-[#635FC7] text-white px-8 py-3 rounded-full hover:bg-[#A8A4FF] transition-colors font-semibold shadow-md">
                  + Add New Column
                </button>
              </div>
            ) : (
              <Board />
            )
          ) : null}
        </div>
      </div>
    </main>
  );
}
