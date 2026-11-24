import { useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import CalendarView from "../components/CalendarView";
import BacklogBoardView from "../components/BacklogBoardView";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import {
  LogOut,
  Plus,
  CheckCircle2,
  Clock,
  PlayCircle,
  Trash2,
  Search,
  Calendar,
  AlertCircle,
  ListTodo,
  CheckCheck,
  LayoutGrid,
  Calendar as CalendarIcon,
  Users,
  Bell,
} from "lucide-react";

const Dashboard = () => {
  const { user, profile, logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [isBacklogMode, setIsBacklogMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Campos del Formulario
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("Media");
  const [dueDate, setDueDate] = useState("");
  const [selectedAssignees, setSelectedAssignees] = useState([]);
  const [editingTask, setEditingTask] = useState(null);
  const [editAssignees, setEditAssignees] = useState([]);
  const [savingAssignees, setSavingAssignees] = useState(false);

  // Filtros y Búsqueda
  const [filterStatus, setFilterStatus] = useState("Todas");
  const [searchTerm, setSearchTerm] = useState("");

  // Vista (Lista o Calendario)
  const [viewMode, setViewMode] = useState("list");

  const [notifications, setNotifications] = useState([]);
  const [showNotificationsDrawer, setShowNotificationsDrawer] = useState(false);
  const [requestNote, setRequestNote] = useState("");
  const [deleteRequestTask, setDeleteRequestTask] = useState(null);
  const [deleteNote, setDeleteNote] = useState("");

  useEffect(() => {
    fetchTasks();
    fetchProjects();
    fetchAvailableUsers();
    fetchNotifications();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await api.get("/projects");
      setProjects(Array.isArray(res.data) ? res.data : res.data.projects || []);
    } catch (err) {
      console.error("Error al obtener proyectos:", err);
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      const tasksData = Array.isArray(res.data)
        ? res.data
        : res.data.tasks || [];
      setTasks(tasksData);
    } catch (err) {
      console.error("Error al obtener tareas:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchAvailableUsers = async () => {
    try {
      const res = await api.get("/tasks/users");
      setAvailableUsers(
        Array.isArray(res.data) ? res.data : res.data.users || [],
      );
    } catch (err) {
      console.error("Error al obtener usuarios disponibles:", err);
    }
  };

  const toggleAssignee = (userId) => {
    setSelectedAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const payload = {
        title,
        description,
        priority,
        dueDate: dueDate || null,
        assigneeIds: selectedAssignees,
        requestNote: requestNote.trim() || null,
      };

      const res = await api.post("/tasks", payload);
      const newTask = res.data.task || res.data;
      setTasks([newTask, ...tasks]);

      setTitle("");
      setDescription("");
      setPriority("Media");
      setDueDate("");
      setSelectedAssignees([]);
      setRequestNote("");
    } catch (err) {
      console.error("Error al crear la tarea:", err);
    }
  };

  const handleUpdateStatus = async (task, newStatus) => {
    if (!task?.id) return;
    try {
      const updatedData = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: task.priority,
        status: newStatus,
      };

      const res = await api.put(`/tasks/${task.id}`, updatedData);
      const updatedTask = res.data.task || res.data;

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id ? { ...t, ...updatedTask, status: newStatus } : t,
        ),
      );
    } catch (err) {
      console.error("Error al actualizar estado:", err);
    }
  };

  const openEditAssigneesModal = (task) => {
    setEditingTask(task);
    const currentIds = Array.isArray(task.assignees)
      ? task.assignees.map((person) => person.id)
      : [];
    setEditAssignees(currentIds);
  };

  const toggleEditAssignee = (userId) => {
    setEditAssignees((prev) =>
      prev.includes(userId)
        ? prev.filter((id) => id !== userId)
        : [...prev, userId],
    );
  };

  const handleSaveAssignees = async (e) => {
    e.preventDefault();
    if (!editingTask?.id) return;

    setSavingAssignees(true);
    try {
      const res = await api.put(`/tasks/${editingTask.id}`, {
        assigneeIds: editAssignees,
        requestNote: requestNote.trim() || null,
      });
      const updatedTask = res.data.task || res.data;

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === editingTask.id
            ? {
                ...t,
                ...updatedTask,
                assignees: updatedTask.assignees ?? t.assignees,
              }
            : t,
        ),
      );
      setEditingTask(null);
      setEditAssignees([]);
      setRequestNote("");
    } catch (err) {
      console.error("Error al actualizar colaboradores:", err);
      alert(
        err.response?.data?.message ||
          "No se pudieron actualizar los colaboradores.",
      );
    } finally {
      setSavingAssignees(false);
    }
  };

  const handleUpdatePriority = async (task, newPriority) => {
    if (!task?.id) return;
    try {
      const updatedData = {
        title: task.title,
        description: task.description,
        dueDate: task.dueDate,
        priority: newPriority,
        status: task.status,
      };

      const res = await api.put(`/tasks/${task.id}`, updatedData);
      const updatedTask = res.data.task || res.data;

      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t.id === task.id
            ? { ...t, ...updatedTask, priority: newPriority }
            : t,
        ),
      );
    } catch (err) {
      console.error("Error al actualizar la prioridad:", err);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!id) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error("Error al eliminar tarea:", err);
      alert(err.response?.data?.message || "No se pudo eliminar la tarea.");
    }
  };

  const handleDeleteAction = async (task) => {
    const currentUserId = user?.id || profile?.id;
    const isCreator =
      task.createdBy === currentUserId || task.creator?.id === currentUserId;
    const isAdmin =
      profile?.role?.toUpperCase() === "ADMIN" ||
      user?.role?.toUpperCase() === "ADMIN";

    if (isCreator || isAdmin) {
      handleDeleteTask(task.id);
    } else {
      setDeleteRequestTask(task);
      setDeleteNote("");
    }
  };

  const handleSendDeleteRequest = async (e) => {
    e.preventDefault();
    if (!deleteRequestTask) return;
    try {
      await api.post(`/notifications/delete-request/${deleteRequestTask.id}`, {
        note: deleteNote.trim() || null,
      });
      setDeleteRequestTask(null);
      setDeleteNote("");
      alert("Solicitud de eliminación enviada al creador de la tarea.");
    } catch (err) {
      console.error("Error al enviar solicitud de eliminación:", err);
      alert(
        err.response?.data?.message ||
          "No se pudo enviar la solicitud de eliminación.",
      );
    }
  };

  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === "Pendiente").length;
    const inProgress = tasks.filter((t) => t.status === "En Progreso").length;
    const completed = tasks.filter((t) => t.status === "Completada").length;
    return { total, pending, inProgress, completed };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filterStatus === "Todas" ? true : task.status === filterStatus;
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description &&
          task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [tasks, filterStatus, searchTerm]);

  const priorityColors = {
    Alta: "bg-red-50 text-red-700 border-red-200",
    Media: "bg-orange-50 text-orange-700 border-orange-200",
    Baja: "bg-blue-50 text-blue-700 border-blue-200",
  };

  const fetchNotifications = async () => {
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error("Error al cargar notificaciones:", err);
    }
  };

  const [respondingId, setRespondingId] = useState(null);

  const handleRespondNotification = async (notificationId, action) => {
    if (respondingId === notificationId) return;
    setRespondingId(notificationId);
    try {
      await api.post(`/notifications/${notificationId}/respond`, { action });
      setNotifications((prev) => prev.filter((n) => n.id !== notificationId));
      if (typeof fetchTasks === "function") {
        fetchTasks();
      }
    } catch (err) {
      console.error("Error al responder notificación:", err);
    } finally {
      setRespondingId(null);
    }
  };

  const [deletingNotifIds, setDeletingNotifIds] = useState([]);

  const handleDeleteNotification = async (notificationId) => {
    if (deletingNotifIds.includes(notificationId)) return;

    const previousNotifications = notifications;
    setDeletingNotifIds((prev) => [...prev, notificationId]);
    setNotifications((prev) => prev.filter((n) => n.id !== notificationId));

    try {
      await api.delete(`/notifications/${notificationId}`);
    } catch (err) {
      // Si el error es 404, significa que ya no existía en la BD; no hace falta revertir
      if (err?.response?.status !== 404) {
        console.error("Error al eliminar notificación:", err);
        setNotifications(previousNotifications);
      }
    } finally {
      setDeletingNotifIds((prev) => prev.filter((id) => id !== notificationId));
    }
  };

  const [showDeleteAllConfirm, setShowDeleteAllConfirm] = useState(false);
  const [deletingAllNotifs, setDeletingAllNotifs] = useState(false);

  const handleDeleteAllNotifications = async () => {
    if (deletingAllNotifs) return;

    const previousNotifications = notifications;
    setDeletingAllNotifs(true);
    setNotifications([]);
    setShowDeleteAllConfirm(false);

    try {
      await api.delete("/notifications/all");
    } catch (err) {
      console.error("Error al eliminar todas las notificaciones:", err);
      setNotifications(previousNotifications);
    } finally {
      setDeletingAllNotifs(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 pb-12">
      {/* Header */}

      <header className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10 shadow-sm">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2 text-indigo-600">
            <CheckCircle2 size={28} className="stroke-[2.5]" />
            <h1 className="text-xl font-bold tracking-tight">TaskHub</h1>
          </div>
          {/* Botón de campana de notificaciones */}

          <div className="flex items-center gap-3">
            {(profile?.role?.toUpperCase() === "ADMIN" ||
              user?.role?.toUpperCase() === "ADMIN") && (
              <button
                onClick={() => navigate("/admin")}
                className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-lg transition-colors font-medium shadow-sm flex items-center gap-1.5"
              >
                Panel Administrador
              </button>
            )}

            <button
              onClick={() => setIsBacklogMode(!isBacklogMode)}
              className="text-sm bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-1.5 rounded-lg transition-colors font-medium border border-indigo-200 flex items-center gap-1.5 shadow-sm"
            >
              <LayoutGrid size={16} />
              {isBacklogMode ? "Panel Principal" : "Modo Backlog"}
            </button>

            {/* Campana de notificaciones junto a los controles de la derecha */}
            {/* Campana de notificaciones junto a los controles de la derecha */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowNotificationsDrawer((prev) => !prev)}
                className="relative p-2 rounded-xl bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 transition cursor-pointer"
                title="Notificaciones"
              >
                <Bell size={18} />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </button>

        
              {showNotificationsDrawer && (
                <div className="fixed right-6 top-16 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 p-4 z-50 space-y-3">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                    <h4 className="text-sm font-bold text-gray-800">
                      Solicitudes pendientes ({notifications.length})
                    </h4>
                    <button
                      type="button"
                      onClick={() => setShowNotificationsDrawer(false)}
                      className="text-xs text-gray-400 hover:text-gray-600 cursor-pointer"
                    >
                      Cerrar
                    </button>
                  </div>


                  {notifications.length > 0 && (
                    <div className="flex items-center justify-between bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-200/70">
                      {!showDeleteAllConfirm ? (
                        <button
                          type="button"
                          onClick={() => setShowDeleteAllConfirm(true)}
                          className="text-[11px] font-medium text-red-600 hover:text-red-700 cursor-pointer ml-auto"
                        >
                          Eliminar todas
                        </button>
                      ) : (
                        <div className="w-full flex items-center justify-between gap-2">
                          <span className="text-[11px] text-gray-700 font-medium leading-tight">
                            ¿Deseas eliminar todas las notificaciones?
                          </span>
                          <div className="flex items-center gap-1.5 shrink-0">
                            <button
                              type="button"
                              onClick={() => setShowDeleteAllConfirm(false)}
                              className="px-2 py-0.5 text-[11px] text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-100 cursor-pointer"
                            >
                              Cancelar
                            </button>
                            <button
                              type="button"
                              disabled={deletingAllNotifs}
                              onClick={handleDeleteAllNotifications}
                              className="px-2 py-0.5 text-[11px] font-medium text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded cursor-pointer"
                            >
                              {deletingAllNotifs ? "Eliminando..." : "Sí, eliminar"}
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {notifications.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-6">
                      No tienes notificaciones pendientes.
                    </p>
                  ) : (
                    <div className="max-h-80 overflow-y-auto space-y-2.5">
                      {notifications.map((notif) => {
                        const requesterName =
                          notif.requester?.full_name ||
                          notif.requester?.email ||
                          "Alguien";
                        const taskTitle = notif.task?.title || "una tarea";
                        const isDelete = notif.type === "DELETE_REQUEST";
                        const isInfoResponse = notif.type === "RESPONSE_INFO";
                        const isBusy = respondingId === notif.id;

                        return (
                          <div
                            key={notif.id}
                            className="relative p-3 pr-8 rounded-xl bg-gray-50 border border-gray-200/70 space-y-2"
                          >
                            {/* Botón X para eliminar notificación */}
                            <button
                              type="button"
                              disabled={deletingNotifIds.includes(notif.id)}
                              onClick={() => handleDeleteNotification(notif.id)}
                              title="Eliminar notificación"
                              className="absolute top-2.5 right-2.5 text-gray-400 hover:text-red-600 disabled:opacity-40 text-xs font-bold leading-none px-1 py-0.5 rounded cursor-pointer"
                            >
                              ✕
                            </button>

                            {isInfoResponse ? (
                              <p className="text-xs text-gray-700 leading-relaxed">
                                {notif.note ||
                                  `${requesterName} respondió a tu solicitud sobre "${taskTitle}".`}
                              </p>
                            ) : (
                              <>
                                <p className="text-xs text-gray-700 leading-relaxed">
                                  <strong className="font-semibold text-gray-900">
                                    {requesterName}
                                  </strong>{" "}
                                  {isDelete
                                    ? "solicita eliminar la tarea "
                                    : "te invitó a colaborar en "}
                                  <strong className="font-semibold text-indigo-700">
                                    "{taskTitle}"
                                  </strong>
                                  .
                                </p>

                                {notif.note && (
                                  <p className="text-[11px] italic text-gray-600 bg-white px-2.5 py-1.5 rounded-lg border border-gray-200/60">
                                    "{notif.note}"
                                  </p>
                                )}

                                <div className="flex items-center justify-end gap-2 pt-1">
                                  <button
                                    type="button"
                                    disabled={isBusy}
                                    onClick={() =>
                                      handleRespondNotification(
                                        notif.id,
                                        "reject",
                                      )
                                    }
                                    className="px-2.5 py-1 text-[11px] font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 disabled:opacity-50 cursor-pointer"
                                  >
                                    Rechazar
                                  </button>
                                  <button
                                    type="button"
                                    disabled={isBusy}
                                    onClick={() =>
                                      handleRespondNotification(
                                        notif.id,
                                        "approve",
                                      )
                                    }
                                    className={`px-2.5 py-1 text-[11px] font-medium text-white rounded-lg disabled:opacity-50 cursor-pointer ${
                                      isDelete
                                        ? "bg-red-600 hover:bg-red-700"
                                        : "bg-emerald-600 hover:bg-emerald-700"
                                    }`}
                                  >
                                    {isDelete
                                      ? "Aprobar eliminación"
                                      : "Aprobar"}
                                  </button>
                                </div>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            <span className="text-sm font-medium text-gray-600">
              Hola,{" "}
              <strong className="text-gray-900">
                {profile?.full_name ||
                  user?.fullName ||
                  user?.name ||
                  "Usuario"}
              </strong>
            </span>

            <button
              onClick={logout}
              className="flex items-center gap-1.5 text-sm bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-700 px-3 py-1.5 rounded-lg transition-colors font-medium"
            >
              <LogOut size={16} />
              Salir
            </button>
          </div>
        </div>
      </header>

      {/* Contenido Principal con Renderizado Condicional */}
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {isBacklogMode ? (
          <BacklogBoardView
            tasks={tasks}
            projects={projects}
            setProjects={setProjects}
            availableUsers={availableUsers}
            onTaskCreated={(createdTask) =>
              setTasks((prev) => [createdTask, ...prev])
            }
            onBackToDashboard={() => setIsBacklogMode(false)}
            onUpdateTaskStatus={handleUpdateStatus}
            onEditAssignees={openEditAssigneesModal}
          />
        ) : (
          <>
            {/* Tarjetas de Estadísticas */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
                  <ListTodo size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Total Tareas
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.total}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-gray-100 text-gray-600 rounded-lg">
                  <Clock size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Pendientes
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.pending}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-lg">
                  <PlayCircle size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    En Progreso
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.inProgress}
                  </p>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
                <div className="p-2.5 bg-green-50 text-green-600 rounded-lg">
                  <CheckCheck size={22} />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium">
                    Completadas
                  </p>
                  <p className="text-xl font-bold text-gray-800">
                    {stats.completed}
                  </p>
                </div>
              </div>
            </div>

            {/* Layout Principal: Form + Tareas/Calendario */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Formulario de Creación */}
              <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <Plus size={20} className="text-indigo-600" />
                  Nueva Tarea
                </h2>
                <form onSubmit={handleCreateTask} className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-gray-50/50"
                      placeholder="Ej: Revisar informes"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                      Descripción
                    </label>
                    <textarea
                      rows="3"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-gray-50/50"
                      placeholder="Detalles de la tarea..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Prioridad
                      </label>
                      <select
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                        className="w-full px-2.5 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-sm bg-gray-50/50"
                      >
                        <option value="Baja">Baja</option>
                        <option value="Media">Media</option>
                        <option value="Alta">Alta</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                        Fecha Límite
                      </label>
                      <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                        className="w-full px-2 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs bg-gray-50/50"
                      />
                    </div>
                  </div>

                  {/* Selector de Colaboradores */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">
                      <Users size={14} className="text-indigo-600" />
                      Colaboradores ({selectedAssignees.length})
                    </label>
                    <div className="max-h-36 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1 bg-gray-50/50">
                      {availableUsers.length === 0 ? (
                        <p className="text-xs text-gray-400 py-1 text-center">
                          No hay usuarios disponibles
                        </p>
                      ) : (
                        availableUsers.map((person) => {
                          const checked = selectedAssignees.includes(person.id);
                          return (
                            <label
                              key={person.id}
                              className={`flex items-center justify-between px-2 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                                checked
                                  ? "bg-indigo-50 text-indigo-800 font-medium"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              <span className="truncate">
                                {person.full_name || person.email}
                              </span>
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleAssignee(person.id)}
                                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                              />
                            </label>
                          );
                        })
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">
                      Nota de solicitud (opcional)
                    </label>
                    <input
                      type="text"
                      value={requestNote}
                      onChange={(e) => setRequestNote(e.target.value)}
                      placeholder="Ej. ¿Me ayudas con esta parte?"
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs bg-gray-50/50"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm"
                  >
                    Guardar Tarea
                  </button>
                </form>
              </div>

              {/* Listado / Calendario */}
              <div className="md:col-span-2 space-y-4">
                <div className="flex items-center justify-between bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                  <h2 className="text-sm font-bold text-gray-700">
                    Vista de Tareas
                  </h2>
                  <div className="flex bg-gray-100 p-1 rounded-lg">
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                        viewMode === "list"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <LayoutGrid size={15} />
                      Lista
                    </button>
                    <button
                      onClick={() => setViewMode("calendar")}
                      className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-md font-medium transition-all ${
                        viewMode === "calendar"
                          ? "bg-white text-indigo-600 shadow-sm"
                          : "text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      <CalendarIcon size={15} />
                      Calendario
                    </button>
                  </div>
                </div>

                {viewMode === "calendar" ? (
                  <CalendarView tasks={tasks} />
                ) : (
                  <>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
                      <div className="relative">
                        <Search
                          size={18}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Buscar tareas por título o descripción..."
                          className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                      </div>

                      <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                        {[
                          "Todas",
                          "Pendiente",
                          "En Progreso",
                          "Completada",
                        ].map((status) => (
                          <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                              filterStatus === status
                                ? "bg-indigo-600 text-white shadow-sm"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                    </div>

                    {loading ? (
                      <p className="text-sm text-gray-500 py-8 text-center">
                        Cargando tareas...
                      </p>
                    ) : filteredTasks.length === 0 ? (
                      <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500 space-y-2">
                        <AlertCircle
                          size={32}
                          className="mx-auto text-gray-300"
                        />
                        <p className="font-medium text-gray-600">
                          No se encontraron tareas
                        </p>
                        <p className="text-xs text-gray-400">
                          Intenta cambiar el filtro o agregar una nueva tarea.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {filteredTasks.map((task) => {
                          const projectObj = projects.find(
                            (p) => p.id === task.projectId,
                          );
                          const priorityBorder = {
                            Alta: "border-l-red-500",
                            Media: "border-l-amber-400",
                            Baja: "border-l-blue-400",
                          };

                          return (
                            <div
                              key={task.id}
                              className={`bg-white p-4 rounded-xl shadow-sm border border-gray-200/80 border-l-4 ${
                                priorityBorder[task.priority] ||
                                "border-l-amber-400"
                              } transition-all hover:shadow-md space-y-3`}
                            >
                              {/* Fila Superior: Título + Prioridad + Proyecto | Acciones */}
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1 min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <h3
                                      className={`font-semibold text-[15px] ${
                                        task.status === "Completada"
                                          ? "line-through text-gray-400"
                                          : "text-gray-900"
                                      }`}
                                    >
                                      {task.title}
                                    </h3>

                                    <select
                                      value={task.priority || "Media"}
                                      onChange={(e) =>
                                        handleUpdatePriority(
                                          task,
                                          e.target.value,
                                        )
                                      }
                                      className={`text-[11px] px-2 py-0.5 rounded-md font-semibold border cursor-pointer focus:outline-none transition-colors ${
                                        priorityColors[task.priority] ||
                                        priorityColors.Media
                                      }`}
                                    >
                                      <option
                                        value="Baja"
                                        className="bg-white text-gray-800"
                                      >
                                        Baja
                                      </option>
                                      <option
                                        value="Media"
                                        className="bg-white text-gray-800"
                                      >
                                        Media
                                      </option>
                                      <option
                                        value="Alta"
                                        className="bg-white text-gray-800"
                                      >
                                        Alta
                                      </option>
                                    </select>

                                    {projectObj && (
                                      <span className="text-[11px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md font-medium">
                                        📁 {projectObj.title}
                                      </span>
                                    )}
                                  </div>

                                  {task.description && (
                                    <p className="text-sm text-gray-500 break-words">
                                      {task.description}
                                    </p>
                                  )}
                                </div>

                                {/* Barra de acciones unificada a la derecha */}
                                <div className="flex items-center gap-1 shrink-0 bg-gray-50 p-1 rounded-lg border border-gray-100">
                                  <button
                                    type="button"
                                    onClick={() => openEditAssigneesModal(task)}
                                    title="Asignar o editar colaboradores"
                                    className="p-1.5 text-indigo-600 hover:bg-indigo-100/70 rounded-md transition-colors cursor-pointer"
                                  >
                                    <Users size={16} />
                                  </button>

                                  <span className="w-px h-4 bg-gray-200 mx-0.5" />

                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(task, "Pendiente")
                                    }
                                    title="Marcar como Pendiente"
                                    className={`p-1.5 rounded-md transition-colors ${
                                      task.status === "Pendiente"
                                        ? "text-indigo-600 bg-white shadow-xs"
                                        : "text-gray-400 hover:text-gray-600"
                                    }`}
                                  >
                                    <Clock size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(task, "En Progreso")
                                    }
                                    title="Marcar En Progreso"
                                    className={`p-1.5 rounded-md transition-colors ${
                                      task.status === "En Progreso"
                                        ? "text-amber-600 bg-white shadow-xs"
                                        : "text-gray-400 hover:text-amber-600"
                                    }`}
                                  >
                                    <PlayCircle size={16} />
                                  </button>
                                  <button
                                    onClick={() =>
                                      handleUpdateStatus(task, "Completada")
                                    }
                                    title="Marcar Completada"
                                    className={`p-1.5 rounded-md transition-colors ${
                                      task.status === "Completada"
                                        ? "text-emerald-600 bg-white shadow-xs"
                                        : "text-gray-400 hover:text-emerald-600"
                                    }`}
                                  >
                                    <CheckCircle2 size={16} />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteAction(task)}
                                    title="Eliminar Tarea"
                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors cursor-pointer"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {/* Fila Inferior: Estado, Fecha, Creador y Colaboradores */}
                              <div className="flex items-center justify-between gap-3 pt-2.5 border-t border-gray-100 text-xs flex-wrap">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span
                                    className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-medium ${
                                      task.status === "Completada"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : task.status === "En Progreso"
                                          ? "bg-amber-50 text-amber-700"
                                          : "bg-gray-100 text-gray-700"
                                    }`}
                                  >
                                    <span
                                      className={`w-1.5 h-1.5 rounded-full ${
                                        task.status === "Completada"
                                          ? "bg-emerald-500"
                                          : task.status === "En Progreso"
                                            ? "bg-amber-500"
                                            : "bg-gray-400"
                                      }`}
                                    />
                                    {task.status}
                                  </span>

                                  {task.dueDate && (
                                    <span className="inline-flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200/70">
                                      <Calendar size={12} />
                                      {new Date(
                                        task.dueDate,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}

                                  {task.creator && (
                                    <span
                                      title={`Creado por ${task.creator.email}`}
                                      className="text-gray-400 pl-1"
                                    >
                                      Por{" "}
                                      <strong className="font-medium text-gray-600">
                                        {task.creator.full_name ||
                                          task.creator.email}
                                      </strong>
                                    </span>
                                  )}
                                </div>

                                {/* Colaboradores con avatar de inicial */}
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  {Array.isArray(task.assignees) &&
                                  task.assignees.length > 0 ? (
                                    task.assignees.map((person) => {
                                      const displayName =
                                        person.full_name || person.email;
                                      const initial = displayName
                                        .charAt(0)
                                        .toUpperCase();
                                      return (
                                        <span
                                          key={person.id}
                                          title={person.email}
                                          className="inline-flex items-center gap-1.5 text-[11px] bg-emerald-50/80 text-emerald-800 border border-emerald-200/80 pr-2.5 pl-1 py-0.5 rounded-full font-medium"
                                        >
                                          <span className="w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                                            {initial}
                                          </span>
                                          {displayName}
                                        </span>
                                      );
                                    })
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() =>
                                        openEditAssigneesModal(task)
                                      }
                                      className="text-[11px] text-gray-400 hover:text-indigo-600 transition-colors cursor-pointer"
                                    >
                                      + Sin colaboradores
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </>
        )}
      </main>
      {/* Modal para editar colaboradores de una tarea ya creada */}
      {editingTask && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveAssignees}
            className="bg-white rounded-xl shadow-lg border border-gray-100 w-full max-w-md p-5 space-y-4"
          >
            <div>
              <h3 className="text-base font-bold text-gray-800">
                Editar colaboradores
              </h3>
              <p className="text-xs text-gray-500 truncate mt-0.5">
                Tarea: {editingTask.title}
              </p>
            </div>

            <div className="max-h-56 overflow-y-auto border border-gray-200 rounded-lg p-2 space-y-1 bg-gray-50/50">
              {availableUsers.length === 0 ? (
                <p className="text-xs text-gray-400 py-2 text-center">
                  No hay usuarios disponibles
                </p>
              ) : (
                availableUsers.map((person) => {
                  const checked = editAssignees.includes(person.id);
                  return (
                    <label
                      key={person.id}
                      className={`flex items-center justify-between px-2.5 py-1.5 rounded-md text-xs cursor-pointer transition-colors ${
                        checked
                          ? "bg-indigo-50 text-indigo-800 font-medium"
                          : "hover:bg-gray-100 text-gray-700"
                      }`}
                    >
                      <span className="truncate">
                        {person.full_name || person.email}
                      </span>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEditAssignee(person.id)}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </label>
                  );
                })
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Nota de solicitud (opcional)
              </label>
              <input
                type="text"
                value={requestNote}
                onChange={(e) => setRequestNote(e.target.value)}
                placeholder="Ej. Te agrego para avanzar juntos..."
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-xs bg-gray-50/50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setEditingTask(null)}
                className="px-3.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={savingAssignees}
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 rounded-lg shadow-sm transition-colors"
              >
                {savingAssignees ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Modal para solicitar eliminación de tarea */}
      {deleteRequestTask && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
          <form
            onSubmit={handleSendDeleteRequest}
            className="bg-white rounded-2xl max-w-md w-full p-5 shadow-xl border border-gray-100 space-y-3"
          >
            <h3 className="text-base font-bold text-gray-900">
              Solicitar eliminación de tarea
            </h3>
            <p className="text-xs text-gray-600">
              No eres el creador de <strong>"{deleteRequestTask.title}"</strong>
              . Se enviará una notificación al creador para que apruebe o
              rechace la eliminación.
            </p>
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1">
                Motivo o nota (opcional)
              </label>
              <textarea
                rows={2}
                value={deleteNote}
                onChange={(e) => setDeleteNote(e.target.value)}
                placeholder="Ej. Esta tarea ya está duplicada o ya no aplica..."
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setDeleteRequestTask(null)}
                className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 cursor-pointer"
              >
                Enviar solicitud
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
