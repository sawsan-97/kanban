import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { boardsApi } from "../api/kanban";

export default function BoardDropdown({ board, onEdit }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deleteBoardMutation = useMutation({
    mutationFn: (id) => boardsApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
    },
  });

  const handleDelete = () => {
    if (window.confirm("هل أنت متأكد من حذف اللوحة؟")) {
      deleteBoardMutation.mutate(board.id);
      setOpen(false);
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-1 rounded hover:bg-gray-200"
        tabIndex={-1}
      >
        ⋮
      </button>
      {open && (
        <div className="absolute left-0 mt-2 w-32 bg-white border rounded shadow-lg z-10">
          <button
            onClick={() => {
              onEdit(board);
              setOpen(false);
            }}
            className="block w-full text-right px-4 py-2 hover:bg-gray-100"
          >
            تعديل
          </button>
          <button
            onClick={handleDelete}
            className="block w-full text-right px-4 py-2 text-red-600 hover:bg-gray-100"
          >
            حذف
          </button>
        </div>
      )}
    </div>
  );
}
