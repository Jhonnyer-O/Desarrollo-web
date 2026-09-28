import { useState, useEffect, useContext, useMemo } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axios';
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
  CheckCheck
} from 'lucide-react';

const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Campos del Formulario
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Media');
  const [dueDate, setDueDate] = useState('');

  // Filtros y Búsqueda
  const [filterStatus, setFilterStatus] = useState('Todas');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get('/tasks');
      const tasksData = Array.isArray(res.data) ? res.data : (res.data.tasks || []);
      setTasks(tasksData);
    } catch (err) {
      console.error('Error al obtener tareas:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    try {
      const payload = {
        title,
        description,
        priority,
        dueDate: dueDate || null
      };

      const res = await api.post('/tasks', payload);
      const newTask = res.data.task || res.data;
      setTasks([newTask, ...tasks]);
      
      // Reset Form
      setTitle('');
      setDescription('');
      setPriority('Media');
      setDueDate('');
    } catch (err) {
      console.error('Error al crear la tarea:', err);
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
        prevTasks.map((t) => (t.id === task.id ? { ...t, ...updatedTask, status: newStatus } : t))
      );
    } catch (err) {
      console.error('Error al actualizar estado:', err.response?.data || err.message);
    }
  };

  const handleDeleteTask = async (id) => {
    if (!id) return;
    try {
      await api.delete(`/tasks/${id}`);
      setTasks((prevTasks) => prevTasks.filter((t) => t.id !== id));
    } catch (err) {
      console.error('Error al eliminar tarea:', err);
    }
  };

  // Estadísticas Calculadas
  const stats = useMemo(() => {
    const total = tasks.length;
    const pending = tasks.filter((t) => t.status === 'Pendiente').length;
    const inProgress = tasks.filter((t) => t.status === 'En Progreso').length;
    const completed = tasks.filter((t) => t.status === 'Completada').length;
    return { total, pending, inProgress, completed };
  }, [tasks]);

  // Tareas Filtradas y Buscadas
  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesStatus =
        filterStatus === 'Todas' ? true : task.status === filterStatus;
      const matchesSearch =
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (task.description && task.description.toLowerCase().includes(searchTerm.toLowerCase()));
      return matchesStatus && matchesSearch;
    });
  }, [tasks, filterStatus, searchTerm]);

  // Colores para Prioridades
  const priorityColors = {
    Alta: 'bg-red-50 text-red-700 border-red-200',
    Media: 'bg-orange-50 text-orange-700 border-orange-200',
    Baja: 'bg-blue-50 text-blue-700 border-blue-200',
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
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-600">
              Hola, <strong className="text-gray-900">{user?.fullName || user?.name || 'Usuario'}</strong>
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

      <main className="max-w-6xl mx-auto p-6 space-y-6">
        {/*Tarjetas de Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg">
              <ListTodo size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Total Tareas</p>
              <p className="text-xl font-bold text-gray-800">{stats.total}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-gray-100 text-gray-600 rounded-lg">
              <Clock size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Pendientes</p>
              <p className="text-xl font-bold text-gray-800">{stats.pending}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-yellow-50 text-yellow-600 rounded-lg">
              <PlayCircle size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">En Progreso</p>
              <p className="text-xl font-bold text-gray-800">{stats.inProgress}</p>
            </div>
          </div>

          <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex items-center gap-3">
            <div className="p-2.5 bg-green-50 text-green-600 rounded-lg">
              <CheckCheck size={22} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">Completadas</p>
              <p className="text-xl font-bold text-gray-800">{stats.completed}</p>
            </div>
          </div>
        </div>

        {/* Layout Principal: Form + Tareas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Formulario de Creación */}
          <div className="md:col-span-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit space-y-4">
            <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
              <Plus size={20} className="text-indigo-600" />
              Nueva Tarea
            </h2>
            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Título</label>
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
                <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Descripción</label>
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
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Prioridad</label>
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
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1">Fecha Límite</label>
                  <input
                    type="date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full px-2 py-1.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs bg-gray-50/50"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 rounded-lg text-sm transition-colors shadow-sm"
              >
                Guardar Tarea
              </button>
            </form>
          </div>

          {/* Listado con Buscador y Filtros */}
          <div className="md:col-span-2 space-y-4">
            {/* Buscador y Control de Filtros */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 space-y-3">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Buscar tareas por título o descripción..."
                  className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                />
              </div>

              {/* Botones de Filtro */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-1">
                {['Todas', 'Pendiente', 'En Progreso', 'Completada'].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      filterStatus === status
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    {status === 'Todas' ? 'Todas' : status}
                  </button>
                ))}
              </div>
            </div>

            {/* Lista de Tareas */}
            {loading ? (
              <p className="text-sm text-gray-500 py-8 text-center">Cargando tareas...</p>
            ) : filteredTasks.length === 0 ? (
              <div className="bg-white p-12 rounded-xl shadow-sm border border-gray-100 text-center text-gray-500 space-y-2">
                <AlertCircle size={32} className="mx-auto text-gray-300" />
                <p className="font-medium text-gray-600">No se encontraron tareas</p>
                <p className="text-xs text-gray-400">Intenta cambiar el filtro o agregar una nueva tarea.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-start justify-between gap-4 transition-all hover:shadow-md"
                  >
                    <div className="space-y-2 flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3
                          className={`font-semibold ${
                            task.status === 'Completada' ? 'line-through text-gray-400' : 'text-gray-800'
                          }`}
                        >
                          {task.title}
                        </h3>

                        {/* Badge de Prioridad */}
                        {task.priority && (
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${priorityColors[task.priority] || priorityColors.Media}`}>
                            {task.priority}
                          </span>
                        )}
                      </div>

                      {task.description && (
                        <p className="text-sm text-gray-600 break-words overflow-hidden">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-3 pt-1 text-xs text-gray-500 flex-wrap">
                        {/* Status Badge */}
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full font-medium ${
                            task.status === 'Completada'
                              ? 'bg-green-100 text-green-700'
                              : task.status === 'En Progreso'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {task.status}
                        </span>

                        {/* Fecha Límite */}
                        {task.dueDate && (
                          <span className="flex items-center gap-1 text-gray-500 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">
                            <Calendar size={12} />
                            {new Date(task.dueDate).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Iconos de Acción */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleUpdateStatus(task, 'Pendiente')}
                        title="Marcar como Pendiente"
                        className={`p-1.5 rounded-md transition-colors ${
                          task.status === 'Pendiente'
                            ? 'text-indigo-600 bg-indigo-50 font-bold'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Clock size={18} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(task, 'En Progreso')}
                        title="Marcar En Progreso"
                        className={`p-1.5 rounded-md transition-colors ${
                          task.status === 'En Progreso'
                            ? 'text-yellow-600 bg-yellow-50 font-bold'
                            : 'text-gray-400 hover:text-yellow-600'
                        }`}
                      >
                        <PlayCircle size={18} />
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(task, 'Completada')}
                        title="Marcar Completada"
                        className={`p-1.5 rounded-md transition-colors ${
                          task.status === 'Completada'
                            ? 'text-green-600 bg-green-50 font-bold'
                            : 'text-gray-400 hover:text-green-600'
                        }`}
                      >
                        <CheckCircle2 size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteTask(task.id)}
                        title="Eliminar Tarea"
                        className="p-1.5 text-gray-400 hover:text-red-600 rounded-md transition-colors ml-1"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;