import { useState, useEffect } from "react";
import { XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tasksApi, subtasksApi } from "../api/kanban";

export default function EditTaskModal({
  isOpen,
  onClose,
  task,
  columnId,
  columns,
  activeBoard,
}) {
  const queryClient = useQueryClient();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subtasks, setSubtasks] = useState([]); // [{id, title}]
  const [status, setStatus] = useState(columnId || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setSubtasks(
        Array.isArray(task.subtasks)
          ? task.subtasks.map((s) => ({ id: s.id, title: s.title }))
          : []
      );
      setStatus(columnId || "");
    }
  }, [task, columnId]);

  const updateSubtask = (index, value) => {
    setSubtasks((subs) =>
      subs.map((s, i) => (i === index ? { ...s, title: value } : s))
    );
  };

  const addSubtask = () => {
    setSubtasks([...subtasks, { id: undefined, title: "" }]);
  };

  const removeSubtask = (index) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const updateTaskMutation = useMutation({
    mutationFn: (data) => tasksApi.update(task.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(["boards"]);
      onClose();
    },
    onError: () => {
      alert("An error occurred while updating the task");
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !status) {
      alert("Please enter a title and select a status");
      return;
    }
    setLoading(true);
    try {
      // 1. تحديث بيانات التاسك
      await updateTaskMutation.mutateAsync({
        title,
        description,
        columnId: status,
      });
      // 2. حذف السبتاسكات التي أزيلت
      const originalSubs = Array.isArray(task.subtasks) ? task.subtasks : [];
      for (const sub of originalSubs) {
        if (!subtasks.find((s) => s.id === sub.id)) {
          await subtasksApi.delete(sub.id);
        }
      }
      // 3. إضافة أو تحديث السبتاسكات
      for (let i = 0; i < subtasks.length; i++) {
        const sub = subtasks[i];
        if (sub.id) {
          await subtasksApi.update(sub.id, { title: sub.title });
        } else {
          await subtasksApi.create({
            title: sub.title,
            completed: false,
            taskId: task.id,
          });
        }
      }
      queryClient.invalidateQueries(["boards"]);
      onClose();
    } catch (err) {
      alert("An error occurred while updating the task or subtasks");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-board-dark rounded-lg p-4 sm:p-6 w-full max-w-xs sm:max-w-md">
        <div className="flex justify-between items-center mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-bold text-[#20212C] dark:text-white">
            Edit Task
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[#20212C] dark:text-white">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-board-dark text-[#20212C] dark:text-white"
              placeholder="e.g. Design the UI"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[#20212C] dark:text-white">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-board-dark text-[#20212C] dark:text-white"
              placeholder="e.g. It's always good to take a break. This 15 minute break will recharge the batteries a little."
              rows="3"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-[#20212C] dark:text-white">
              Subtasks
            </label>
            {subtasks.map((subtask, index) => (
              <div key={subtask.id || index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={subtask.title}
                  onChange={(e) => updateSubtask(index, e.target.value)}
                  className="flex-1 p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-board-dark text-[#20212C] dark:text-white"
                  placeholder="e.g. Design homepage"
                  required
                />
                {subtasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSubtask(index)}
                    className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded"
                  >
                    <XMarkIcon className="h-5 w-5" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={addSubtask}
              className="w-full p-2 bg-gray-100 dark:bg-gray-800 rounded-lg text-primary hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              + Add New Subtask
            </button>
          </div>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2 text-[#20212C] dark:text-white">
              Status
            </label>
            <select
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded bg-white dark:bg-board-dark text-[#20212C] dark:text-white"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              required
            >
              <option value="" disabled>
                Select status
              </option>
              {columns?.map((col) => (
                <option key={col.id} value={col.id}>
                  {col.name}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-primary text-white rounded-lg hover:bg-primary-light dark:bg-primary dark:hover:bg-primary/80"
            disabled={loading}
          >
            {loading ? "...Saving" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
