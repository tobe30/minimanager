import { ClipboardCheck, CheckCircle2, TrendingUp } from "lucide-react";
import { useTaskStore } from "../taskstore/taskStore";
import { useQuery } from "@tanstack/react-query";
import { getTask } from "../lib/api";
import Loading from "../components/Loading";

const Dashboard = () => {
  const { selectedDate } = useTaskStore();

    const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTask,
  });

  // Filter tasks for the selected date
  const todayTasks = tasks.filter(
    (t) =>
      t.dueAt &&
      new Date(t.dueAt).toDateString() === new Date(selectedDate).toDateString()
  );

  const completedTasks = todayTasks.filter((t) => t.completed).length;
  const completionRate = todayTasks.length
    ? Math.round((completedTasks / todayTasks.length) * 100)
    : 0;

  const stats = {
    total: todayTasks.length,
    completed: completedTasks,
    percentage: completionRate,
  };

  /* ---------------- COMPONENTS ---------------- */

  const ProgressBar = ({ value, color }) => (
    <div className="w-full bg-base-200 rounded-lg h-3 overflow-hidden">
      <div
        className={`${color} h-full rounded-lg transition-all duration-500`}
        style={{ width: `${value}%` }}
      />
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, iconBg, iconColor }) => (
    <div className="bg-white border border-gray-100 rounded-xl p-5 flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-400 font-medium">{title}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
    </div>
  );

  /* ---------------- UI ---------------- */

  if(isLoading) {
      return (
        
          <Loading />
       
      )
    }

  return (
    <div className="space-y-6 p-4">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm opacity-70">Overview of your daily work progress</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          title="Total Tasks Today"
          value={stats.total}
          icon={ClipboardCheck}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Completed Tasks"
          value={stats.completed}
          icon={CheckCircle2}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          title="Completion Rate"
          value={`${stats.percentage}%`}
          icon={TrendingUp}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />
      </div>

      {/* Daily Progress */}
      <div className="bg-base-100 rounded-xl shadow p-6">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-lg font-semibold">Daily Progress</h2>
            <p className="text-sm opacity-70">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
          <span className="text-3xl font-bold text-blue-500">{stats.percentage}%</span>
        </div>

        <ProgressBar value={stats.percentage} color="bg-yellow-500" />
      </div>
    </div>
  );
};

export default Dashboard;
