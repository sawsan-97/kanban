"use client";

import Sidebar from "@/components/Sidebar";
import Board from "@/components/Board";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { boardsApi } from "../api/kanban";
import { useSelector } from "react-redux";
import AddTaskModal from "@/components/AddTaskModal";
import { PlusIcon } from "@heroicons/react/24/solid";

export default function Home() {
  const [activeBoardId, setActiveBoardId] = useState(null);
  const { data: boardsData = [], isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: () => boardsApi.getAll().then((res) => res.data),
  });
  const isSidebarOpen = useSelector((state) => state.boards.isSidebarOpen);
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  const activeBoard = boardsData.find((board) => board.id === activeBoardId);
  const columns = Array.isArray(activeBoard?.columns)
    ? [...activeBoard.columns].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    : [];

  return (
    <main
      className={`flex h-screen bg-[#F4F7FD] dark:bg-[#20212C] text-[#20212C] dark:text-white transition-all duration-300 ease-in-out ${
        isSidebarOpen ? "sm:pl-72" : ""
      }`}
    >
      <Sidebar
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
        boardsData={boardsData}
      />
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <div
          className={`sticky top-0 left-0 right-0 z-30 w-full flex flex-row-reverse items-center justify-between bg-[#F4F7FD] dark:bg-[#20212C] px-2 sm:px-10 pt-3 sm:pt-4 pb-2 sm:pb-3 border-b border-[#E4EBFA] dark:border-[#3E3F4E] shadow-sm ${
            isSidebarOpen ? "sm:pl-72" : ""
          }`}
        >
          <h1 className="text-xl sm:text-2xl font-bold text-[#20212C] dark:text-white text-left w-full">
            {activeBoard?.name || "No Board Selected"}
          </h1>
          {columns.length > 0 && (
            <button
              onClick={() => setIsAddTaskModalOpen(true)}
              className="flex items-center gap-2 bg-[#635FC7] dark:bg-[#A8A4FF] text-white px-5 py-2 rounded-[20px] font-semibold text-base hover:bg-[#A8A4FF] dark:hover:bg-[#635FC7] transition border-none shadow-none"
            >
              <PlusIcon className="h-5 w-5" />
              Add New Task
            </button>
          )}
        </div>
        <AddTaskModal
          isOpen={isAddTaskModalOpen}
          onClose={() => setIsAddTaskModalOpen(false)}
          columnId={columns[0]?.id}
          activeBoard={activeBoard}
        />
        <div className="mb-6"></div>
        <Board
          activeBoardId={activeBoardId}
          boardsData={boardsData}
          hideHeader
        />
      </div>
    </main>
  );
}
