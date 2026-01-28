import { create } from "zustand";


const formatDate = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
};
/* ---------------- MOCK DATA ---------------- */

const initialSites = [
  { id: "site-1", name: "Downtown Office Complex", location: "" },
  { id: "site-2", name: "Industrial Park Unit A", location: "" },
  { id: "site-3", name: "Riverside Mall", location: "" },
  { id: "site-4", name: "Tech Campus Building 3", location: "" },
];

// today as YYYY-MM-DD string for tasks
const today = new Date(); // local time
const todayStr = formatDate(today);

const initialTasks = [
  {
    id: "1",
    title: "Inspect HVAC system",
    priority: "high",
    completed: true,
    dueAt: today, // <- Date object
  },
  {
    id: "2",
    title: "Replace air filters",
    priority: "medium",
    completed: false,
    dueAt: today,
  },
];




export const useTaskStore = create((set, get) => ({
  tasks: initialTasks,
  sites: initialSites,
  selectedDate: new Date(), // keep as Date object

  setSelectedDate: (date) => set({ selectedDate: date }),

  getTasksForDate: (date) => {
  return get().tasks.filter((task) => {
    if (!task.dueAt) return false;

    const taskDate = new Date(task.dueAt);
    taskDate.setHours(0, 0, 0, 0);

    const selDate = new Date(date);
    selDate.setHours(0, 0, 0, 0);

    return taskDate.getTime() === selDate.getTime();
  });
},


}));
