import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  X,
  Clock,
  AlertCircle,
} from "lucide-react";

const CalendarView = ({ tasks }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDayData, setSelectedDayData] = useState(null);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];

  const dayNames = ["DOM", "LUN", "MAR", "MIÉ", "JUE", "VIE", "SÁB"];

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => setCurrentDate(new Date());

  const getTasksForDate = (day) => {
    return tasks.filter((task) => {
      if (!task.dueDate) return false;
      const taskDate = new Date(task.dueDate);
      return (
        taskDate.getUTCDate() === day &&
        taskDate.getUTCMonth() === month &&
        taskDate.getUTCFullYear() === year
      );
    });
  };

  const priorityColors = {
    Alta: "bg-red-100 text-red-700 border-red-200",
    Media: "bg-orange-100 text-orange-700 border-orange-200",
    Baja: "bg-blue-100 text-blue-700 border-blue-200",
  };

  const today = new Date();
  const isToday = (day) =>
    today.getDate() === day &&
    today.getMonth() === month &&
    today.getFullYear() === year;

  const renderDays = () => {
    const days = [];

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(
        <div
          key={`empty-${i}`}
          className="h-16 border border-gray-100/60 bg-gray-50/30 rounded-lg"
        ></div>
      );
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayTasks = getTasksForDate(day);
      const hasTasks = dayTasks.length > 0;

      days.push(
        <div
          key={day}
          onClick={() => {
            if (hasTasks) {
              setSelectedDayData({ day, tasks: dayTasks });
            }
          }}
          className={`h-16 p-1.5 border rounded-lg transition-all flex flex-col justify-between ${
            hasTasks ? "cursor-pointer hover:border-indigo-400 hover:shadow-sm" : ""
          } ${
            isToday(day)
              ? "border-indigo-600 bg-indigo-50/30"
              : "border-gray-100 bg-white"
          }`}
        >
          <div className="flex justify-between items-center">
            <span
              className={`text-xs font-semibold ${
                isToday(day)
                  ? "bg-indigo-600 text-white w-5 h-5 rounded-full flex items-center justify-center text-[11px]"
                  : "text-gray-700"
              }`}
            >
              {day}
            </span>
            {hasTasks && (
              <span className="text-[10px] text-gray-400 font-medium">
                {dayTasks.length} {dayTasks.length === 1 ? "tarea" : "tareas"}
              </span>
            )}
          </div>

          <div className="space-y-0.5 overflow-hidden">
            {dayTasks.slice(0, 1).map((t) => (
              <div
                key={t.id}
                className="text-[10px] truncate px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-700 font-medium"
              >
                • {t.title}
              </div>
            ))}
            {dayTasks.length > 1 && (
              <div className="text-[9px] text-indigo-600 font-semibold px-1">
                +{dayTasks.length - 1} más...
              </div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-4 relative">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarIcon size={18} className="text-indigo-600" />
          <h2 className="text-base font-bold text-gray-800">
            {monthNames[month]} {year}
          </h2>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={goToToday}
            className="text-xs font-medium px-2.5 py-1 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 rounded-lg transition-colors"
          >
            Hoy
          </button>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 text-gray-600 transition-colors flex items-center justify-center"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 text-gray-600 transition-colors flex items-center justify-center"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {dayNames.map((d) => (
          <span key={d} className="text-[11px] font-bold text-gray-400 py-1">
            {d}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">{renderDays()}</div>

      {selectedDayData && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
              <div className="flex items-center gap-2">
                <CalendarIcon size={18} className="text-indigo-600" />
                <h3 className="font-bold text-gray-800 text-sm">
                  Tareas del {selectedDayData.day} de {monthNames[month]}
                </h3>
              </div>
              <button
                onClick={() => setSelectedDayData(null)}
                className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-4 max-h-[60vh] overflow-y-auto space-y-3">
              {selectedDayData.tasks.map((task) => (
                <div
                  key={task.id}
                  className="p-3 rounded-lg border border-gray-100 bg-white shadow-sm space-y-2"
                >
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold text-gray-800 text-sm">
                      {task.title}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold border ${
                        priorityColors[task.priority] || priorityColors.Media
                      }`}
                    >
                      {task.priority || "Media"}
                    </span>
                  </div>

                  {task.description && (
                    <p className="text-xs text-gray-600 leading-relaxed">
                      {task.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between pt-1 text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        task.status === "Completada"
                          ? "bg-green-100 text-green-700"
                          : task.status === "En Progreso"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {task.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-gray-50 border-t border-gray-100 text-right">
              <button
                onClick={() => setSelectedDayData(null)}
                className="px-4 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-medium hover:bg-indigo-700 transition-colors"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarView;