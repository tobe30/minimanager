import { BarChart3, CheckCircle2, Clock, Target } from "lucide-react";
import { useMemo } from "react";
import { getTask } from "../lib/api";
import { useQuery } from "@tanstack/react-query";
import Loading from "../components/Loading";

const Analytics = () => {
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTask,
  });

  // Overall stats
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const overallCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = tasks.filter((t) => t.priority === "high");
  const mediumPriorityTasks = tasks.filter((t) => t.priority === "medium");
  const lowPriorityTasks = tasks.filter((t) => t.priority === "low");

  const highCompleted = highPriorityTasks.filter((t) => t.completed).length;
  const mediumCompleted = mediumPriorityTasks.filter((t) => t.completed).length;
  const lowCompleted = lowPriorityTasks.filter((t) => t.completed).length;

  // Last 7 days
  const last7Days = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });
  }, []);

  // Daily stats for last 7 days
  const dailyStats = useMemo(() => {
    return last7Days.map((date) => {
      const dayTasks = tasks.filter((t) => {
        const taskDate = new Date(t.createdAt);
        return (
          taskDate.getFullYear() === date.getFullYear() &&
          taskDate.getMonth() === date.getMonth() &&
          taskDate.getDate() === date.getDate()
        );
      });

      const completed = dayTasks.filter((t) => t.completed).length;

      return {
        date,
        total: dayTasks.length,
        completed,
        percentage: dayTasks.length > 0 ? Math.round((completed / dayTasks.length) * 100) : 0,
      };
    });
  }, [tasks, last7Days]);

  const maxDailyTasks = Math.max(...dailyStats.map((d) => d.total), 1);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-gray-500">Track your productivity and performance</p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard Icon={BarChart3} title="Total Tasks" value={totalTasks} color="primary" />
        <StatCard Icon={CheckCircle2} title="Completed" value={completedTasks} color="success" />
        <StatCard Icon={Clock} title="Pending" value={totalTasks - completedTasks} color="warning" />
        <StatCard Icon={Target} title="Completion Rate" value={`${overallCompletionRate}%`} color="accent" />
      </div>

      {/* Tasks Per Day Chart */}
      <BarChart last7Days={dailyStats} maxDailyTasks={maxDailyTasks} />

      {/* Daily Completion Rates */}
      <CompletionRates dailyStats={dailyStats} />

      {/* Priority Breakdown & Task Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriorityBreakdown
          high={{ completed: highCompleted, total: highPriorityTasks.length }}
          medium={{ completed: mediumCompleted, total: mediumPriorityTasks.length }}
          low={{ completed: lowCompleted, total: lowPriorityTasks.length }}
        />
        <TaskDistribution
          totalTasks={totalTasks}
          high={highPriorityTasks.length}
          medium={mediumPriorityTasks.length}
          low={lowPriorityTasks.length}
        />
      </div>
    </div>
  );
};

export default Analytics;

/* ---------------- Components ---------------- */

const StatCard = ({ Icon, title, value, color }) => (
  <div className="card bg-base-100 shadow p-4 flex items-center gap-3">
    <div className={`p-2 rounded-full bg-${color}/20 text-${color}`}>
      <Icon size={24} />
    </div>
    <div>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

const BarChart = ({ last7Days, maxDailyTasks }) => (
  <div className="card bg-base-100 shadow p-6">
    <h2 className="text-lg font-semibold mb-4">Tasks Per Day (Last 7 Days)</h2>
    <div className="flex items-end gap-2 h-48">
      {last7Days.map((day, index) => (
        <div key={index} className="flex-1 flex flex-col items-center gap-2">
          <div className="w-full flex flex-col items-center justify-end h-40 gap-1">
            <span className="text-xs font-medium">{day.completed}/{day.total}</span>
            <div
              className="w-full bg-blue-500 rounded-t-md transition-all duration-500"
              style={{ height: `${(day.total / maxDailyTasks) * 100}%`, minHeight: day.total > 0 ? "8px" : "0" }}
            />
          </div>
          <span className="text-xs text-gray-400">
            {day.date.toLocaleDateString("en-US", { weekday: "short" })}
          </span>
        </div>
      ))}
    </div>
  </div>
);

const CompletionRates = ({ dailyStats }) => (
  <div className="card bg-base-100 shadow p-6">
    <h2 className="text-lg font-semibold mb-4">Daily Completion Rates</h2>
    <div className="space-y-4">
      {dailyStats.map((day, index) => (
        <div key={index} className="flex items-center gap-4">
          <span className="text-sm text-gray-400 w-28">
            {day.date.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
          </span>
          <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all"
              style={{ width: `${day.percentage}%` }}
            />
          </div>
          <span className="text-sm font-medium w-8">{day.percentage}%</span>
        </div>
      ))}
    </div>
  </div>
);

const PriorityBreakdown = ({ high, medium, low }) => (
  <div className="card bg-base-100 shadow p-6">
    <h2 className="text-lg font-semibold mb-4">Priority Breakdown</h2>
    {[{ label: "High", data: high, color: "error" }, { label: "Medium", data: medium, color: "warning" }, { label: "Low", data: low, color: "success" }].map((item) => (
      <div key={item.label}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full bg-${item.color}`} />
            <span className="text-sm font-medium">{item.label} Priority</span>
          </div>
          <span className="text-sm text-gray-400">
            {item.data.completed}/{item.data.total} completed
          </span>
        </div>
        <div className="w-full bg-gray-200 h-3 rounded-full overflow-hidden">
          <div
            className={`bg-${item.color} h-3 rounded-full transition-all`}
            style={{ width: `${item.data.total > 0 ? (item.data.completed / item.data.total) * 100 : 0}%` }}
          />
        </div>
      </div>
    ))}
  </div>
);

const TaskDistribution = ({ totalTasks, high, medium, low }) => (
  <div className="card bg-base-100 shadow p-6 flex flex-col items-center">
    <h2 className="text-lg font-semibold mb-4">Task Distribution</h2>
    <div className="relative w-40 h-40">
      <div
        className="w-full h-full rounded-full"
        style={{
          background: totalTasks > 0
            ? `conic-gradient(
                #ef4444 0deg ${(high / totalTasks) * 360}deg,
                #f59e0b ${(high / totalTasks) * 360}deg ${((high + medium) / totalTasks) * 360}deg,
                #22c55e ${((high + medium) / totalTasks) * 360}deg 360deg
              )`
            : "#d1d5db",
        }}
      />
      <div className="absolute inset-4 bg-base-100 rounded-full flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl font-bold">{totalTasks}</p>
          <p className="text-xs text-gray-400">Total</p>
        </div>
      </div>
    </div>
    <div className="flex justify-center gap-6 mt-4">
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#ef4444" }} />
        <span className="text-sm">High ({high})</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#f59e0b" }} />
        <span className="text-sm">Medium ({medium})</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#22c55e" }} />
        <span className="text-sm">Low ({low})</span>
      </div>
    </div>
  </div>
);
