"use client";

import { useState } from "react";
import { Draggable } from "react-beautiful-dnd";
import ViewTaskModal from "./ViewTaskModal";

export default function Task({ task, index, columnId, columns }) {
  const [isViewTaskModalOpen, setIsViewTaskModalOpen] = useState(false);
  const completedSubtasks =
    task.subtasks?.filter((subtask) => subtask.completed).length || 0;
  const totalSubtasks = task.subtasks?.length || 0;

  return (
    <>
      <Draggable draggableId={String(task.id)} index={index}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            onClick={() => setIsViewTaskModalOpen(true)}
            className="bg-white dark:bg-[#2B2C37] rounded-xl shadow-sm cursor-pointer hover:shadow-lg transition-shadow flex flex-col gap-2 p-3 sm:p-6 min-h-[72px] sm:min-h-[88px] border border-transparent hover:border-[#635FC7] w-full"
          >
            <h4 className="font-bold text-base text-[#20212C] dark:text-white mb-1 truncate">
              {task.title}
            </h4>
            {totalSubtasks > 0 && (
              <p className="text-xs text-[#828FA3] font-medium">
                {completedSubtasks} of {totalSubtasks} subtasks
              </p>
            )}
          </div>
        )}
      </Draggable>

      <ViewTaskModal
        isOpen={isViewTaskModalOpen}
        onClose={() => setIsViewTaskModalOpen(false)}
        task={task}
        columnId={columnId}
        columns={columns}
      />
    </>
  );
}
