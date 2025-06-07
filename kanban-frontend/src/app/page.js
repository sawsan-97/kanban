"use client";

import Sidebar from "@/components/Sidebar";
import Board from "@/components/Board";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { boardsApi } from "../api/kanban";

export default function Home() {
  const [activeBoardId, setActiveBoardId] = useState(null);
  const { data: boardsData = [], isLoading } = useQuery({
    queryKey: ["boards"],
    queryFn: () => boardsApi.getAll().then((res) => res.data),
  });

  return (
    <main className="flex h-screen bg-[#F4F7FD] dark:bg-[#20212C] text-[#20212C] dark:text-white">
      <Sidebar
        activeBoardId={activeBoardId}
        setActiveBoardId={setActiveBoardId}
        boardsData={boardsData}
      />
      <div className="flex-1 flex flex-col min-h-screen transition-all duration-300 ease-in-out">
        <Board activeBoardId={activeBoardId} boardsData={boardsData} />
      </div>
    </main>
  );
}
