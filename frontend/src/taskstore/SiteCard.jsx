import { MapPin } from "lucide-react";
import TaskItem from "./TaskItem";

const SiteCard = ({ site, tasks, onEditTask }) => {
  // const { selectedDate, getSiteProgress } = useTaskStore();

  const totalTasks = tasks.length;
  const completedCount = tasks.filter((t) => t.completed).length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedCount / totalTasks) * 100);


  return (
    <div className="card bg-base-100 shadow-md p-5 rounded-2xl">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-blue-500/10">
            <MapPin className="w-5 h-5 text-blue-500" />
          </div>

          <div>
            <h3 className="font-semibold text-base">{site.name}</h3>
            <p className="text-sm text-gray-500">{site.location}</p>
          </div>
        </div>

        <div className="text-right">
          <p className="text-2xl font-bold">
            {completedCount}/{tasks.length}
          </p>
          <p className="text-xs text-gray-500">Tasks completed</p>
        </div>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <progress
          className="progress progress-primary w-full h-3"
          value={progress}
          max="100"
        />
        <p className="text-xs text-gray-500 mt-1 text-right">
          {progress}% completed
        </p>
      </div>

      {/* Tasks */}
      <div className="space-y-2">
        {tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onEdit={onEditTask}
            />
          ))
        ) : (
          <p className="text-sm text-gray-400 text-center py-4">
            No tasks for this site today
          </p>
        )}
      </div>
    </div>
  );
};

export default SiteCard;
