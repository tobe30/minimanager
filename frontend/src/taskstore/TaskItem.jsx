import { Check, Pencil, Trash2, Calendar as CalendarIcon } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteTask, updateTask } from "../lib/api";
import toast from "react-hot-toast";

const TaskItem = ({ task, onEdit }) => {
 const queryClient = useQueryClient();

//update mutation toggle
const toggleMutation = useMutation({
  mutationFn: updateTask,
  onSuccess: () => {
    queryClient.invalidateQueries(["tasks"]);
  },
});

const deleteMutation = useMutation({
  mutationFn: deleteTask,
   onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      toast.success("task deleted successfully");
    },
    onError: (err) => 
      toast.error(err.response?.data?.message || "Failed to delete task"),
})

const handleDeleteTask = (e, taskIdToDelete) => {
  e.stopPropagation();
  deleteMutation.mutate(taskIdToDelete);
};



const handleToggle = () => {
  toggleMutation.mutate({
    taskId: task._id,
    data: {
      completed: !task.completed,
      status: task.completed ? "pending" : "completed",
    },
  });
};


  // Simple Tailwind badge for priority
  const renderPriorityBadge = (priority) => {
    let colorClass = "bg-gray-200 text-gray-700";
    if (priority === "high") colorClass = "bg-red-500 text-white";
    if (priority === "medium") colorClass = "bg-yellow-400 text-black";
    if (priority === "low") colorClass = "bg-green-500 text-white";

    return (
      <span
        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorClass}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg bg-base-100 border border-gray-200 hover:border-blue-500 transition-all duration-150 ${
        task.completed ? "opacity-60" : ""
      } group`}
    >
      {/* Completion Checkbox */}
      <button
        onClick={handleToggle}
        className={`w-5 h-5 rounded-md border-2 flex items-center justify-center transition-colors flex-shrink-0 ${
          task.completed
            ? "bg-green-500 border-green-500 text-white"
            : "border-gray-300 hover:border-blue-500"
        }`}
      >
        {task.completed && <Check className="w-3 h-3" />}
      </button>

      {/* Task Title & Date */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm font-medium truncate ${
            task.completed ? "line-through text-gray-400" : ""
          }`}
        >
          {task.title}
        </p>
       {task.dueAt && (
  <div className="flex items-center gap-1 mt-0.5 text-xs text-gray-500">
    <CalendarIcon className="w-3 h-3" />
    <span>{new Date(task.dueAt).toLocaleDateString()}</span>
  </div>
)}

      </div>

      {/* Priority Badge */}
      {renderPriorityBadge(task.priority)}

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => onEdit(task)}
          className="p-1.5 hover:bg-gray-200 rounded-md transition-colors"
          aria-label="Edit task"
        >
          <Pencil className="w-4 h-4 text-gray-500" />
        </button>
       <button
            onClick={(e) => handleDeleteTask(e, task._id)}
            className="p-1.5 hover:bg-red-100 rounded-md transition-colors"
            aria-label="Delete task"
>
  <Trash2 className="w-4 h-4 text-red-500" />
</button>

      </div>
    </div>
  );
};

export default TaskItem;
