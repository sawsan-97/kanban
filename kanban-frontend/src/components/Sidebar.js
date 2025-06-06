"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleSidebar, setActiveBoard } from "@/store/boardsSlice";
import {
  EyeIcon,
  EyeSlashIcon,
  PlusIcon,
  Squares2X2Icon,
} from "@heroicons/react/24/solid";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import AddBoardModal from "./AddBoardModal";
import { useTheme } from "next-themes";
import BoardDropdown from "./BoardDropdown";
import { useQuery } from "@tanstack/react-query";
import { boardsApi } from "../api/kanban";
import Board from "./Board";

export default function Sidebar() {
  const dispatch = useDispatch();
  const { boards, activeBoard, isSidebarOpen } = useSelector(
    (state) => state.boards
  );
  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [activeBoardId, setActiveBoardId] = useState(null);
  const { data: boardsData = [], isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: () => boardsApi.getAll().then((res) => res.data),
  });

  if (!isSidebarOpen) {
    return (
      <button
        onClick={() => dispatch(toggleSidebar())}
        className="fixed left-0 top-4 z-50 bg-[#635FC7] p-3 rounded-r-full shadow-lg"
        dir="ltr"
      >
        <EyeIcon className="h-6 w-6 text-white" />
      </button>
    );
  }

  return (
    <>
      <aside
        className="w-72 h-screen flex flex-col justify-between fixed left-0 top-0 z-40 shadow-xl bg-[#F4F7FD] dark:bg-[#20212C] border-r border-[#E4EBFA] dark:border-[#3E3F4E]"
        dir="ltr"
      >
        <div>
          <div className="flex items-center gap-3 px-8 py-8">
            <div className="w-8 h-8 bg-[#635FC7] rounded flex items-center justify-center">
              <Squares2X2Icon className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-wide text-[#20212C] dark:text-white">
              kanban
            </span>
          </div>
          <div className="px-8 text-[#828FA3] text-xs mb-4 tracking-widest font-semibold text-left">
            ALL BOARDS ({boardsData.length})
          </div>
          <nav className="flex flex-col gap-1 px-2">
            {boardsData.map((board) => (
              <div key={board.id} className="flex items-center gap-2">
                <button
                  onClick={() => setActiveBoardId(board.id)}
                  className={`flex-1 flex items-center gap-3 w-full text-left px-8 py-3 rounded-r-full transition-colors font-medium text-base group ${
                    activeBoardId === board.id
                      ? "bg-[#635FC7] text-white shadow-md"
                      : "text-[#828FA3] hover:bg-[#A8A4FF]/10 hover:text-[#635FC7] dark:text-[#828FA3] dark:hover:bg-[#A8A4FF]/10 dark:hover:text-[#635FC7]"
                  }`}
                >
                  <Squares2X2Icon
                    className={`h-5 w-5 ${
                      activeBoardId === board.id
                        ? "text-white"
                        : "text-[#635FC7]"
                    }`}
                  />
                  <span className="truncate text-left">{board.name}</span>
                </button>
                <BoardDropdown
                  board={board}
                  onEdit={() => alert("تعديل اللوحة")}
                />
              </div>
            ))}
            <button
              onClick={() => setIsAddBoardModalOpen(true)}
              className="flex items-center gap-3 w-full text-left px-8 py-3 rounded-r-full text-[#635FC7] bg-transparent hover:bg-[#A8A4FF]/20 font-medium text-base mt-1 dark:text-[#A8A4FF]"
            >
              <Squares2X2Icon className="h-5 w-5 text-[#635FC7] dark:text-[#A8A4FF]" />
              <span>+ Create New Board</span>
            </button>
          </nav>
        </div>
        <div className="px-8 pb-6 flex flex-col gap-4">
          <div className="flex items-center justify-between bg-[#F4F7FD] dark:bg-[#20212C] rounded-lg mb-2 border border-[#E4EBFA] dark:border-[#3E3F4E] w-[251px] h-12 px-6 mx-auto">
            <SunIcon className="h-6 w-6 text-[#828FA3]" />
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="relative w-16 h-8 flex items-center bg-[#635FC7] rounded-full transition-colors focus:outline-none"
              aria-label="Toggle dark mode"
            >
              <span
                className={`absolute left-1 top-1 w-6 h-6 rounded-full bg-white shadow-md transition-transform duration-300 ${
                  theme === "dark" ? "translate-x-8" : ""
                }`}
              />
            </button>
            <MoonIcon className="h-6 w-6 text-[#828FA3]" />
          </div>
          <button
            onClick={() => dispatch(toggleSidebar())}
            className="flex items-center gap-2 text-[#828FA3] text-xs hover:text-[#635FC7] font-medium justify-center dark:text-[#828FA3] dark:hover:text-[#635FC7]"
          >
            <EyeSlashIcon className="h-5 w-5" />
            <span>Hide Sidebar</span>
          </button>
        </div>
      </aside>

      <AddBoardModal
        isOpen={isAddBoardModalOpen}
        onClose={() => setIsAddBoardModalOpen(false)}
      />

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center bg-[#F4F7FD] dark:bg-[#20212C]">
        {!isLoading && boardsData.length > 0 ? (
          <Board activeBoardId={activeBoardId} boardsData={boardsData} />
        ) : (
          <div className="text-center w-full">
            <p className="mb-8 text-lg text-[#828FA3] dark:text-[#828FA3] font-medium">
              This board is empty. Create a new column to get started.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
