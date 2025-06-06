import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  boards: [],
  activeBoard: null,
  isSidebarOpen: true,
};

export const boardsSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    addBoard: (state, action) => {
      state.boards.push(action.payload);
    },
    setActiveBoard: (state, action) => {
      state.activeBoard = action.payload;
    },
    addColumn: (state, action) => {
      const { boardId, column } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        board.columns.push(column);
      }
    },
    addTask: (state, action) => {
      const { boardId, columnId, task } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        const column = board.columns.find((c) => c.id === columnId);
        if (column) {
          column.tasks.push(task);
        }
      }
    },
    toggleSidebar: (state) => {
      state.isSidebarOpen = !state.isSidebarOpen;
    },
    updateTaskStatus: (state, action) => {
      const { boardId, taskId, newColumnId } = action.payload;
      const board = state.boards.find((b) => b.id === boardId);
      if (board) {
        // Remove task from old column
        board.columns.forEach((column) => {
          column.tasks = column.tasks.filter((task) => task.id !== taskId);
        });
        // Add task to new column
        const newColumn = board.columns.find((c) => c.id === newColumnId);
        if (newColumn) {
          newColumn.tasks.push(action.payload.task);
        }
      }
    },
  },
});

export const {
  addBoard,
  setActiveBoard,
  addColumn,
  addTask,
  toggleSidebar,
  updateTaskStatus,
} = boardsSlice.actions;

export default boardsSlice.reducer;
