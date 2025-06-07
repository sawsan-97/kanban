"use client";

import { useState } from "react";
import { Droppable } from "react-beautiful-dnd";
import { PlusIcon } from "@heroicons/react/24/solid";
import Task from "./Task";
import AddTaskModal from "./AddTaskModal";

const columnColors = [
  "bg-[#49C4E5]", // blue
  "bg-[#8471F2]", // purple
  "bg-[#67E2AE]", // green
  "bg-[#E9A6A6]", // red
  "bg-[#F5D76E]", // yellow
];

export default function Column({
  column,
  colorIndex = 0,
  activeBoard,
  columns,
}) {
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);

  return (
    <div className="min-w-[280px] max-w-xs w-80 flex flex-col bg-[#2B2C37] rounded-xl p-4 shadow-md">
      {/* Header: Adjust direction based on column name language */}
      {/^([A-Za-z0-9 _-]+)$/.test(column.name) ? (
        <div
          className="flex flex-row items-center gap-2 mb-6 mt-2 px-2"
          dir="ltr"
        >
          <span
            className={`w-3 h-3 rounded-full ${
              columnColors[colorIndex % columnColors.length]
            }`}
          ></span>
          <h3 className="font-semibold text-xs tracking-widest uppercase text-[#828FA3]">
            {column.name}{" "}
            <span className="font-normal">({column.tasks.length})</span>
          </h3>
        </div>
      ) : (
        <div
          className="flex flex-row-reverse items-center gap-2 mb-6 mt-2 px-2"
          dir="rtl"
        >
          <span
            className={`w-3 h-3 rounded-full ${
              columnColors[colorIndex % columnColors.length]
            }`}
          ></span>
          <h3 className="font-semibold text-xs tracking-widest uppercase text-[#828FA3]">
            {column.name}{" "}
            <span className="font-normal">({column.tasks.length})</span>
          </h3>
        </div>
      )}
      <Droppable droppableId={column.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="flex flex-col gap-5 flex-1 min-h-[120px]"
          >
            {column.tasks.map((task, index) => (
              <Task
                key={task.id}
                task={task}
                index={index}
                columnId={column.id}
                columns={columns}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <button
        onClick={() => setIsAddTaskModalOpen(true)}
        className="mt-6 flex items-center justify-center gap-2 bg-transparent border-none text-[#635FC7] px-4 py-2 rounded-full hover:bg-[#635FC7]/10 transition-colors font-semibold"
        style={{ border: "none" }}
      >
        <PlusIcon className="h-5 w-5" />
        <span>Add Task</span>
      </button>

      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        onClose={() => setIsAddTaskModalOpen(false)}
        columnId={column.id}
        activeBoard={activeBoard}
        columns={columns}
      />
    </div>
  );
}
