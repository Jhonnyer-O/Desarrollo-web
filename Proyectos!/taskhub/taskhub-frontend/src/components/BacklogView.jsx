import React, { useState } from "react";
import api from "../api/axios";
import { Plus, FolderKanban } from "lucide-react";


const BacklogBoardView = ({ tasks, projects, setProjects, onBackToDashboard }) => {
  const [selectedProject, setSelectedProject] = useState("all");
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");
  const [showProjectForm, setShowProjectForm] = useState(false);

  // Crear un nuevo proyecto al vuelo
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

  // Filtrar tareas por proyecto seleccionado
  const filteredTasks = selectedProject === "all"
    ? tasks
    : tasks.filter((t) => t.projectId === selectedProject);

  const pendingTasks = filteredTasks.filter((t) => t.status === "Pendiente" || !t.status);
  const inProgressTasks = filteredTasks.filter((t) => t.status === "En Progreso");
  const completedTasks = filteredTasks.filter((t) => t.status === "Completada");

  return (
    <div className="space-y-6">
      {/* Header del Backlog */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
            <FolderKanban size={22} />
          </div>
          <div>
            <h2 className="text-lg font-bold text-gray-800">Tablero Backlog de Proyectos</h2>
            <p className="text-xs text-gray-500">Visualiza el flujo de trabajo dividido por tus proyectos.</p>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto justify-end">
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
            onClick={() => setShowProjectForm(!showProjectForm)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-2 rounded-lg text-sm font-medium transition shadow-sm flex items-center gap-1 whitespace-nowrap"
          >
            <Plus size={16} /> Nuevo Proyecto
          </button>
        </div>
      </div>

      {/* Formulario desplegable para crear Proyecto */}
      {showProjectForm && (
        <form onSubmit={handleCreateProject} className="bg-white p-4 rounded-xl border border-indigo-100 shadow-sm space-y-3">
          <h3 className="text-sm font-bold text-gray-800">Crear Nuevo Proyecto</h3>
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
        </form>
      )}

      {/* Columnas Kanban */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Columna Pendientes */}
        <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-200/80 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span> Pendientes ({pendingTasks.length})
            </h3>
          </div>
          <div className="space-y-3">
            {pendingTasks.map((task) => (
              <div key={task.id} className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 space-y-1.5">
                <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
                {task.description && <p className="text-xs text-gray-500">{task.description}</p>}
                <div className="text-[10px] text-gray-400 pt-1 flex justify-between">
                  <span>Prioridad: {task.priority}</span>
                  {task.dueDate && <span>{new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
            {pendingTasks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">No hay tareas pendientes</p>
            )}
          </div>
        </div>

        {/* Columna En Progreso */}
        <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-200/80 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-500"></span> En Progreso ({inProgressTasks.length})
            </h3>
          </div>
          <div className="space-y-3">
            {inProgressTasks.map((task) => (
              <div key={task.id} className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 space-y-1.5">
                <h4 className="font-semibold text-gray-800 text-sm">{task.title}</h4>
                {task.description && <p className="text-xs text-gray-500">{task.description}</p>}
                <div className="text-[10px] text-gray-400 pt-1 flex justify-between">
                  <span>Prioridad: {task.priority}</span>
                  {task.dueDate && <span>{new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
            {inProgressTasks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">No hay tareas en progreso</p>
            )}
          </div>
        </div>

        {/* Columna Completadas */}
        <div className="bg-gray-50/70 rounded-xl p-4 border border-gray-200/80 space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-gray-200">
            <h3 className="font-semibold text-gray-700 text-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span> Completadas ({completedTasks.length})
            </h3>
          </div>
          <div className="space-y-3">
            {completedTasks.map((task) => (
              <div key={task.id} className="bg-white p-3.5 rounded-xl shadow-sm border border-gray-100 space-y-1.5 opacity-80">
                <h4 className="font-semibold text-gray-800 text-sm line-through">{task.title}</h4>
                {task.description && <p className="text-xs text-gray-500">{task.description}</p>}
                <div className="text-[10px] text-gray-400 pt-1 flex justify-between">
                  <span>Prioridad: {task.priority}</span>
                  {task.dueDate && <span>{new Date(task.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
            ))}
            {completedTasks.length === 0 && (
              <p className="text-xs text-gray-400 text-center py-8">No hay tareas completadas</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};