import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { 
  Users, 
  ShieldAlert, 
  Search, 
  ArrowLeft, 
  Trash2, 
  Edit3, 
  LogOut,
  Shield,
  User,
  X
} from "lucide-react";

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("TODOS");
  const navigate = useNavigate();

  // Estados para el Modal de Edición
  const [editingUser, setEditingUser] = useState(null);
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editRole, setEditRole] = useState("USER");
  const [editPassword, setEditPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get("/admin/users");
      const usersData = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsers(usersData);
    } catch (err) {
      console.error("Error al obtener usuarios:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (user) => {
    setEditingUser(user);
    setEditName(user.full_name || user.name || "");
    setEditEmail(user.email || "");
    setEditRole(user.role || "USER");
    setEditPassword("");
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    try {
      const payload = {
        full_name: editName,
        email: editEmail,
        role: editRole,
      };

      if (editPassword && editPassword.trim() !== "") {
        payload.password = editPassword;
      }

      const res = await api.put(`/admin/users/${editingUser.id}`, payload);
      const updated = res.data.user || res.data;

      setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...payload, ...updated } : u));
      setEditingUser(null);
    } catch (err) {
      console.error("Error al actualizar usuario:", err);
      alert("Hubo un error al actualizar los datos del usuario.");
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este usuario?")) return;
    try {
      await api.delete(`/admin/users/${id}`);
      setUsers(users.filter(u => u.id !== id));
    } catch (err) {
      console.error("Error al eliminar usuario:", err);
    }
  };

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch = 
        (user.full_name && user.full_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (user.email && user.email.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesRole = roleFilter === "TODOS" ? true : user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchTerm, roleFilter]);

  const stats = useMemo(() => {
    const total = users.length;
    const admins = users.filter(u => u.role === "ADMIN").length;
    const regularUsers = total - admins;
    return { total, admins, regularUsers };
  }, [users]);

  return (
    <div className="h-screen bg-gray-50 flex overflow-hidden">
      {/* Sidebar Lateral Fijo */}
      <aside className="w-64 bg-white border-r border-gray-200 hidden md:flex flex-col justify-between p-6 shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2 text-indigo-600">
            <ShieldAlert size={28} className="stroke-[2.5]" />
            <h1 className="text-xl font-bold tracking-tight">AdminPanel</h1>
          </div>

          <nav className="space-y-1">
            <button
              onClick={() => navigate("/dashboard")}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50 hover:text-indigo-600 transition"
            >
              <ArrowLeft size={18} /> Volver al Dashboard
            </button>
            <div className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium bg-indigo-50 text-indigo-700">
              <Users size={18} /> Gestión de Usuarios
            </div>
          </nav>
        </div>

        <div className="pt-6 border-t border-gray-100">
          <button
            onClick={() => navigate("/login")}
            className="w-full flex items-center gap-2 text-sm text-gray-600 hover:text-red-600 transition font-medium px-3 py-2"
          >
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Contenido Principal con Scroll Interno Organizado */}
      <main className="flex-1 p-6 md:p-10 flex flex-col h-full overflow-hidden max-w-7xl mx-auto">
        
        {/* Cabecera y Estadísticas (Fijas, sin scroll) */}
        <div className="space-y-6 shrink-0 pb-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Panel de Administración</h2>
              <p className="text-sm text-gray-500">Supervisa, filtra y administra los usuarios registrados en TaskHub.</p>
            </div>
            <button
              onClick={() => navigate("/dashboard")}
              className="md:hidden flex items-center gap-2 bg-indigo-50 text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium"
            >
              <ArrowLeft size={16} /> Volver al Dashboard
            </button>
          </div>

          {/* Tarjetas de Estadísticas */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
                <Users size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Total Usuarios</p>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                <Shield size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Administradores</p>
                <p className="text-2xl font-bold text-gray-800">{stats.admins}</p>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-4">
              <div className="p-3 bg-green-50 text-green-600 rounded-xl">
                <User size={24} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">Usuarios Regulares</p>
                <p className="text-2xl font-bold text-gray-800">{stats.regularUsers}</p>
              </div>
            </div>
          </div>

          {/* Controles de Búsqueda y Filtros */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search size={18} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o correo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
              />
            </div>

            <div className="flex items-center gap-2 w-full md:w-auto">
              {["TODOS", "ADMIN", "USER"].map((role) => (
                <button
                  key={role}
                  onClick={() => setRoleFilter(role)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold transition ${
                    roleFilter === role
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  {role === "TODOS" ? "Todos" : role === "ADMIN" ? "Admins" : "Usuarios"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Contenedor de la Tabla con Scroll Interno Independiente */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 overflow-hidden flex flex-col mb-4">
          {loading ? (
            <p className="text-sm text-gray-500 py-12 text-center">Cargando usuarios...</p>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <Users size={32} className="mx-auto text-gray-300" />
              <p className="text-sm font-medium text-gray-600">No se encontraron usuarios</p>
              <p className="text-xs text-gray-400">Prueba con otro término de búsqueda o filtro.</p>
            </div>
          ) : (
            <div className="overflow-y-auto flex-1">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-gray-50 border-b border-gray-100 text-xs font-semibold text-gray-500 uppercase tracking-wider z-10">
                  <tr>
                    <th className="py-4 px-6">Usuario</th>
                    <th className="py-4 px-6">Correo Electrónico</th>
                    <th className="py-4 px-6">Rol Actual</th>
                    <th className="py-4 px-6 text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {filteredUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-gray-50/50 transition">
                      <td className="py-4 px-6 font-medium text-gray-800">
                        {u.full_name || u.name || "Sin Nombre"}
                      </td>
                      <td className="py-4 px-6 text-gray-500">{u.email}</td>
                      <td className="py-4 px-6">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                            u.role === "ADMIN"
                              ? "bg-purple-50 text-purple-700 border border-purple-200"
                              : "bg-blue-50 text-blue-700 border border-blue-200"
                          }`}
                        >
                          {u.role === "ADMIN" ? <Shield size={12} /> : <User size={12} />}
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-6 text-right space-x-2">
                        <button
                          onClick={() => handleOpenEdit(u)}
                          className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-xl text-xs font-medium transition inline-flex items-center gap-1"
                        >
                          <Edit3 size={14} /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id)}
                          title="Eliminar Usuario"
                          className="p-1.5 bg-gray-100 hover:bg-red-50 hover:text-red-600 text-gray-600 rounded-xl transition inline-flex items-center"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Modal flotante para Editar Usuario */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 space-y-4 animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-lg font-bold text-gray-800">Editar Usuario</h3>
              <button 
                onClick={() => setEditingUser(null)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nombre Completo</label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Correo Electrónico</label>
                <input
                  type="email"
                  value={editEmail}
                  onChange={(e) => setEditEmail(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Nueva Contraseña (Opcional)</label>
                <input
                  type="password"
                  placeholder="Dejar en blanco para mantener la actual"
                  value={editPassword}
                  onChange={(e) => setEditPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 uppercase mb-1">Rol del Sistema</label>
                <select
                  value={editRole}
                  onChange={(e) => setEditRole(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50"
                >
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 text-xs font-medium text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 shadow-sm transition"
                >
                  Guardar Cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;