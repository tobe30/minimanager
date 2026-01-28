import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getTask } from "../lib/api";
import { useTaskStore } from "../taskstore/taskStore";
import Loading from "../components/Loading";

const CalendarPage = () => {
  // 1️⃣ Backend tasks
  const { data: tasks = [], isLoading } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTask,
  });

  // 2️⃣ Calendar state
  const [currentMonth, setCurrentMonth] = useState(new Date());
    const { selectedDate, setSelectedDate } = useTaskStore();


  // 3️⃣ Helpers
  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDay; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const previousMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  const nextMonth = () =>
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );

  const isToday = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date.getTime() === today.getTime();
  };

  const isSelected = (date) => {
    const sel = new Date(selectedDate);
    sel.setHours(0, 0, 0, 0);
    return date.getTime() === sel.getTime();
  };

  const getTasksForDate = (date) =>
    tasks.filter(
      (task) =>
        task.dueAt &&
        new Date(task.dueAt).toDateString() === new Date(date).toDateString()
    );

  const days = getDaysInMonth(currentMonth);
  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  if(isLoading) {
    return (
      
        <Loading />
     
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Calendar</h1>
        <p className="text-muted-foreground">
          View and manage your tasks by date
        </p>
      </div>

      {/* Calendar */}
      <div className="card bg-base-100 shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <button onClick={previousMonth} className="btn btn-ghost p-2">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-semibold">
            {currentMonth.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h2>
          <button onClick={nextMonth} className="btn btn-ghost p-2">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Weekdays */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekDays.map((day) => (
            <div
              key={day}
              className="text-center text-sm font-medium text-muted-foreground py-2"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((date, idx) => {
            if (!date) return <div key={`empty-${idx}`} className="aspect-square" />;

            const dayTasks = getTasksForDate(date);
            const completedTasks = dayTasks.filter((t) => t.completed).length;
            const completionRate = dayTasks.length
              ? Math.round((completedTasks / dayTasks.length) * 100)
              : 0;

            return (
              <button
                key={date.toISOString()}
                onClick={() => setSelectedDate(date)}
                className={`aspect-square p-2 rounded-lg flex flex-col items-center justify-start gap-1 transition-colors
                  ${isToday(date) ? "ring-2 ring-primary" : ""}
                  ${isSelected(date) ? "bg-primary text-primary-content hover:bg-primary" : "hover:bg-gray-200"}
                `}
              >
                <span className="text-sm font-medium">{date.getDate()}</span>
                {dayTasks.length > 0 && (
                  <div className="flex flex-col items-center gap-0.5">
                    <span
                      className={`text-xs ${
                        isSelected(date)
                          ? "text-primary-content/80"
                          : "text-muted-foreground"
                      }`}
                    >
                      {dayTasks.length} {dayTasks.length === 1 ? "task" : "tasks"}
                    </span>
                    {completionRate === 100 ? (
                      <Check
                        className={`w-4 h-4 ${
                          isSelected(date) ? "text-primary-content" : "text-success"
                        }`}
                      />
                    ) : (
                      <span
                        className={`text-xs font-medium ${
                          isSelected(date)
                            ? "text-primary-content"
                            : completionRate >= 50
                            ? "text-success"
                            : "text-warning"
                        }`}
                      >
                        {completionRate}%
                      </span>
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tasks for Selected Day */}
      <div className="card bg-base-100 shadow p-6">
        <h3 className="text-lg font-semibold mb-4">
          Tasks for{" "}
          {new Date(selectedDate).toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
          })}
        </h3>
        {getTasksForDate(selectedDate).length === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            No tasks scheduled for this day
          </p>
        ) : (
          <div className="space-y-2">
            {getTasksForDate(selectedDate).map((task) => (
              <div
                key={task._id}
                className={`flex items-center gap-3 p-3 rounded-lg bg-gray-100 ${
                  task.completed ? "opacity-60" : ""
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full ${
                    task.priority === "high"
                      ? "bg-error"
                      : task.priority === "medium"
                      ? "bg-warning"
                      : "bg-success"
                  }`}
                />
                <span
                  className={`${task.completed ? "line-through text-muted-foreground" : ""}`}
                >
                  {task.title}
                </span>
                {task.completed && <Check className="w-4 h-4 text-success" />}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CalendarPage;
