import React, { useState } from "react";
import api from "../api/axios";
import { Plus, FolderKanban, Calendar, Tag, Users } from "lucide-react";

const BacklogBoardView = ({
  tasks,
  projects,
  setProjects,
  availableUsers = [],
  onTaskCreated,
  onBackToDashboard,
  onUpdateTaskStatus,
  onEditAssignees,
}) => {
  const [selectedProject, setSelectedProject] = useState("all");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Estados para la nueva tarea con proyecto integrado
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDesc, setTaskDesc] = useState("");
  const [taskPriority, setTaskPriority] = useState("Media");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskProjectId, setTaskProjectId] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);

  const toggleAssignee = (userId) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  // Crear proyecto
  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;

    try {
      const res = await api.post("/projects", {
        title: newProjectName,
        description: newProjectDesc,
      });
      const createdProj = res.data.project || res.data;
      setProjects([...projects, createdProj]);
      setNewProjectName("");
      setNewProjectDesc("");
      setShowProjectForm(false);
    } catch (err) {
      console.error("Error al crear proyecto:", err);
    }
  };

  // Crear tarea asociada a proyecto (o general) con colaboradores
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) return;

    try {
      const payload = {
        title: taskTitle,
        description: taskDesc,
        priority: taskPriority,
        dueDate: taskDueDate || null,
        projectId: taskProjectId || null,
        status: "Pendiente",
        assigneeIds: selectedAssignees,
      };

      const res = await api.post("/tasks", payload);
      const createdTask = res.data.task || res.data;

      setTaskTitle("");
      setTaskDesc("");
      setTaskPriority("Media");
      setTaskDueDate("");
      setTaskProjectId("");
      setSelectedAssignees([]);
      setShowTaskForm(false);

      if (onTaskCreated) {
        onTaskCreated(createdTask);
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error("Error al crear tarea:", err);
    }
  };

  // Eventos de Drag and Drop
  const handleDragStart = (e, taskId) => {
    e.dataTransfer.setData("taskId", taskId);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData("taskId");
    if (!taskId) return;

    const taskToUpdate = tasks.find((t) => t.id === taskId);
    if (!taskToUpdate || taskToUpdate.status === newStatus) return;

    if (onUpdateTaskStatus) {
      onUpdateTaskStatus(taskToUpdate, newStatus);
    }
  };

  // Filtrado de tareas
  const filteredTasks =
    selectedProject === "all"
      ? tasks
      : tasks.filter((t) => t.projectId === selectedProject);

  const pendingTasks = filteredTasks.filter(
    (t) => t.status === "Pendiente" || !t.status,
  );
  const inProgressTasks = filteredTasks.filter(
    (t) => t.status === "En Progreso",
  );
  const completedTasks = filteredTasks.filter((t) => t.status === "Completada");

  const priorityBorder = {
    Alta: "border-l-red-500",
    Media: "border-l-amber-400",
    Baja: "border-l-blue-400",
  };

  const priorityBadge = {
    Alta: "bg-red-50 text-red-700 border-red-200",
    Media: "bg-orange-50 text-orange-700 border-orange-200",
    Baja: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const renderTaskCard = (task, isCompleted = false) => {
    const projectObj = projects.find((p) => p.id === task.projectId);
    return (
      <div
        key={task.id}
        draggable
        onDragStart={(e) => handleDragStart(e, task.id)}
        className={`bg-white p-3.5 rounded-xl shadow-sm border border-gray-200/80 border-l-4 ${
          priorityBorder[task.priority] || "border-l-amber-400"
        } space-y-2.5 cursor-grab active:cursor-grabbing hover:shadow-md transition ${
          isCompleted ? "opacity-80" : ""
        }`}
      >
        {/* Cabecera: Proyecto + Prioridad | Botón editar colaboradores */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap min-w-0">
            {projectObj && (
              <span className="inline-flex items-center gap-1 text-[10px] bg-indigo-50 text-indigo-700 border border-indigo-200/70 px-2 py-0.5 rounded-md font-medium truncate">
                <Tag size={10} /> {projectObj.title}
              </span>
            )}
            <span
              className={`text-[10px] px-2 py-0.5 rounded-md font-semibold border ${
                priorityBadge[task.priority] || priorityBadge.Media
              }`}
            >
              {task.priority || "Media"}
            </span>
          </div>

          {onEditAssignees && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEditAssignees(task);
              }}
              title="Asignar o editar colaboradores"
              className="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors shrink-0 cursor-pointer"
            >
              <Users size={14} />
            </button>
          )}
        </div>

        {/* Título y descripción */}
        <div className="space-y-1">
          <h4
            className={`font-semibold text-gray-900 text-sm leading-snug ${
              isCompleted ? "line-through text-gray-400" : ""
            }`}
          >
            {task.title}
          </h4>
          {task.description && (
            <p className="text-xs text-gray-500 break-words">
              {task.description}
            </p>
          )}
        </div>

        {/* Colaboradores con avatar de inicial */}
        <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
          {Array.isArray(task.assignees) && task.assignees.length > 0
            ? task.assignees.map((person) => {
                const displayName = person.full_name || person.email;
                const initial = displayName.charAt(0).toUpperCase();
                return (
                  <span
                    key={person.id}
                    title={person.email}
                    className="inline-flex items-center gap-1 text-[10px] bg-emerald-50/90 text-emerald-800 border border-emerald-200/80 pr-2 pl-1 py-0.5 rounded-full font-medium"
                  >
                    <span className="w-3.5 h-3.5 rounded-full bg-emerald-600 text-white text-[8px] font-bold flex items-center justify-center">
                      {initial}
                    </span>
                    {displayName}
                  </span>
                );
              })
            : onEditAssignees && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEditAssignees(task);
                  }}
                  className="text-[10px] text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
                >
                  + Sin colaboradores
                </button>
              )}
        </div>

        {/* Footer: Creador y Fecha límite */}
        <div className="text-[10px] text-gray-400 pt-2 flex justify-between items-center border-t border-gray-100 gap-2">
          {task.creator ? (
            <span
              title={`Creado por ${task.creator.email}`}
              className="truncate"
            >
              Por{" "}
              <strong className="font-medium text-gray-600">
                {task.creator.full_name || task.creator.email}
              </strong>
            </span>
          ) : (
            <span />
          )}

          {task.dueDate && (
            <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200/70 shrink-0">
              <Calendar size={10} />
              {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header del Backlog */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
            <FolderKanban size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">
              Tablero Backlog de Proyectos
            </h2>
            <p className="text-xs text-gray-500">
              Arrastra las tarjetas entre columnas o filtra por proyecto.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
          <select
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
          >
            <option value="all">📁 Todos los Proyectos</option>
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id}>
                {proj.title}
              </option>
            ))}
          </select>

          <button
            type="button"
            onClick={() => {
              setShowProjectForm(false);
              setShowTaskForm(true);
            }}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <Plus size={16} /> Nueva Tarea
          </button>

          <button
            type="button"
            onClick={() => {
              setShowTaskForm(false);
              setShowProjectForm(true);
            }}
            className="bg-gray-800 hover:bg-gray-900 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-1 whitespace-nowrap cursor-pointer"
          >
            <FolderKanban size={16} /> Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* Modal para crear Tarea */}
{showTaskForm && (
  <div
    onClick={() => setShowTaskForm(false)}
    className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4"
  >
    <form
      onSubmit={handleCreateTask}
      onClick={(e) => e.stopPropagation()}
      className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-xl w-full max-w-xl space-y-3.5 max-h-[90vh] overflow-y-auto"
    >
      <div className="flex items-center justify-between border-b border-gray-100 pb-2.5">
        <h3 className="text-base font-bold text-gray-800">
          Crear Tarea en Backlog
        </h3>
        <button
          type="button"
          onClick={() => setShowTaskForm(false)}
          className="text-gray-400 hover:text-gray-600 text-sm font-bold px-1.5 py-0.5 rounded-lg cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <input
          type="text"
          placeholder="Título de la tarea"
          value={taskTitle}
          onChange={(e) => setTaskTitle(e.target.value)}
          required
          className="px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <input
          type="text"
          placeholder="Descripción"
          value={taskDesc}
          onChange={(e) => setTaskDesc(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <select
          value={taskProjectId}
          onChange={(e) => setTaskProjectId(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">Sin Proyecto (General)</option>
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.title}
            </option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Prioridad
          </label>
          <select
            value={taskPriority}
            onChange={(e) => setTaskPriority(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="Baja">Baja</option>
            <option value="Media">Media</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <div>
          <label className="block text-xs font-semibold text-gray-600 mb-1">
            Fecha Límite
          </label>
          <input
            type="date"
            value={taskDueDate}
            onChange={(e) => setTaskDueDate(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      {availableUsers.length > 0 && (
        <div>
          <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 mb-1">
            <Users size={13} className="text-indigo-600" />
            Colaboradores ({selectedAssignees.length})
          </label>
          <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg divide-y divide-gray-100 bg-gray-50">
            {availableUsers.map((person) => {
              const isChecked = selectedAssignees.includes(person.id);
              return (
                <label
                  key={person.id}
                  className="flex items-center justify-between px-3 py-1.5 text-xs cursor-pointer hover:bg-white"
                >
                  <span className="text-gray-700">
                    {person.full_name || person.email}
                  </span>
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleAssignee(person.id)}
                    className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                  />
                </label>
              );
            })}
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
        <button
          type="button"
          onClick={() => setShowTaskForm(false)}
          className="px-3.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-4 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 shadow-sm cursor-pointer"
        >
          Guardar Tarea
        </button>
      </div>
    </form>
  </div>
)}

      {/* Formulario desplegable para crear Proyecto */}
      {showProjectForm && (
        <form
          onSubmit={handleCreateProject}
          className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3"
        >
          <h3 className="text-sm font-bold text-gray-800">
            Crear Nuevo Proyecto
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <input
              type="text"
              placeholder="Nombre del proyecto"
              value={newProjectName}
              onChange={(e) => setNewProjectName(e.target.value)}
              required
              className="px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <input
              type="text"
              placeholder="Descripción breve (opcional)"
              value={newProjectDesc}
              onChange={(e) => setNewProjectDesc(e.target.value)}
              className="px-3 py-2 border rounded-lg text-sm bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setShowProjectForm(false)}
              className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-medium text-white bg-gray-800 rounded-lg hover:bg-gray-900 shadow-sm cursor-pointer"
            >
              Guardar Proyecto
            </button>
          </div>
        </form>
      )}

      {/* Columnas Kanban con soporte Drag and Drop */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna Pendientes */}
        <div
          className="bg-gray-100/70 rounded-xl p-4 border border-gray-200/80 space-y-3 min-h-[400px]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "Pendiente")}
        >
          <div className="flex justify-between items-center pb-2.5 border-b border-gray-200/90">
            <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
              Pendientes
            </h3>
            <span className="text-xs font-semibold bg-white text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">
              {pendingTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task) => renderTaskCard(task, false))}
            {pendingTasks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-white/50">
                Arrastra tareas aquí
              </p>
            )}
          </div>
        </div>

        {/* Columna En Progreso */}
        <div
          className="bg-gray-100/70 rounded-xl p-4 border border-gray-200/80 space-y-3 min-h-[400px]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "En Progreso")}
        >
          <div className="flex justify-between items-center pb-2.5 border-b border-gray-200/90">
            <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span>
              En Progreso
            </h3>
            <span className="text-xs font-semibold bg-white text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">
              {inProgressTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {inProgressTasks.map((task) => renderTaskCard(task, false))}
            {inProgressTasks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-white/50">
                Arrastra tareas aquí
              </p>
            )}
          </div>
        </div>

        {/* Columna Completadas */}
        <div
          className="bg-gray-100/70 rounded-xl p-4 border border-gray-200/80 space-y-3 min-h-[400px]"
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, "Completada")}
        >
          <div className="flex justify-between items-center pb-2.5 border-b border-gray-200/90">
            <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              Completadas
            </h3>
            <span className="text-xs font-semibold bg-white text-gray-600 border border-gray-200 px-2 py-0.5 rounded-full">
              {completedTasks.length}
            </span>
          </div>
          <div className="space-y-3">
            {completedTasks.map((task) => renderTaskCard(task, true))}
            {completedTasks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-12 border-2 border-dashed border-gray-200 rounded-lg bg-white/50">
                Arrastra tareas aquí
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BacklogBoardView;
