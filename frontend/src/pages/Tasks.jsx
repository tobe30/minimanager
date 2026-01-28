import { useState } from "react";
import { Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTask } from "../lib/api";
import { useTaskStore } from "../taskstore/taskStore";
import SiteCard from "../taskstore/SiteCard";
import AddTaskModal from "../taskstore/AddTaskModal";
import Loading from "../components/Loading";

const DailyTasks = () => {
  const { selectedDate } = useTaskStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTask,
  });

  
const handleEditTask = (task) => {
  setEditingTask(task);
  setIsModalOpen(true);
};

  // 🔑 filter tasks by selected date
  const filteredTasks = tasks.filter((task) => {
    if (!task.dueAt) return false;

    return (
      new Date(task.dueAt).toDateString() ===
      new Date(selectedDate).toDateString()
    );
  });

  // 📊 stats
  const stats = {
    total: filteredTasks.length,
    completed: filteredTasks.filter((t) => t.completed).length,
  };

  // 🧩 group by site
  const tasksBySite = filteredTasks.reduce((acc, task) => {
    const siteId = task.site?._id;
    if (!siteId) return acc;

    if (!acc[siteId]) {
      acc[siteId] = {
        ...task.site,
        tasks: [],
      };
    }

    acc[siteId].tasks.push(task);
    return acc;
  }, {});

  const sitesWithTasks = Object.values(tasksBySite);

    if(isLoading) {
    return (
      
        <Loading />
     
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Daily Tasks</h1>
          <p className="text-muted-foreground">
            {stats.completed} of {stats.total} tasks completed
          </p>
        </div>

        <button
  onClick={() => {
    setEditingTask(null);   // 🔥 REQUIRED
    setIsModalOpen(true);
  }}
  className="bg-blue-500 text-white flex items-center gap-2 px-5 py-2 rounded-xl"
>
  <Plus className="w-5 h-5" />
  Add Task
</button>
      </div>

      {/* Tasks */}
      {sitesWithTasks.length > 0 ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {sitesWithTasks.map((site) => (
            <SiteCard
              key={site._id}
              site={site}
              tasks={site.tasks}
              onEditTask={handleEditTask}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-400">
          No tasks for this date
        </p>
      )}

      <AddTaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        editingTask={editingTask}
      />
    </div>
  );
};

export default DailyTasks;
