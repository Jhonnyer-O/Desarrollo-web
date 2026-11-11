import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({ full_name: '', email: '', password: '', role: 'USER' });

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setFormData({ full_name: user.full_name, email: user.email, password: '', role: user.role });
  };

  const handleUpdateSubmit = async (id) => {
    try {
      const response = await api.put(`/admin/users/${id}`, formData);
      console.log('Usuario actualizado:', response.data);
      setEditingUser(null);
      fetchUsers(); // Usamos fetchUsers para recargar la tabla correctamente
    } catch (error) {
      console.error('Error detallado al actualizar:', error.response?.data || error.message);
    }
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;
    
    try {
      await api.delete(`/admin/users/${id}`);
      fetchUsers(); // Recarga la lista de usuarios
    } catch (error) {
      console.error('Error al eliminar usuario:', error.response?.data || error.message);
    }
  };

  if (loading) return <div className="p-6 text-center">Cargando panel de administración...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">Panel de Administración de Usuarios</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Correo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {users.map((u) => (
              <tr key={u.id}>
                {editingUser === u.id ? (
                  <>
                    {/* Columna Nombre */}
                    <td className="px-6 py-4">
                      <input 
                        type="text" 
                        value={formData.full_name} 
                        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                        className="border rounded px-2 py-1 text-sm w-full"
                      />
                    </td>
                    {/* Columna Correo */}
                    <td className="px-6 py-4">
                      <input 
                        type="email" 
                        value={formData.email} 
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                        className="border rounded px-2 py-1 text-sm w-full"
                      />
                    </td>
                    {/* Columna Rol */}
                    <td className="px-6 py-4">
                      <select 
                        value={formData.role} 
                        onChange={(e) => setFormData({...formData, role: e.target.value})}
                        className="border rounded px-2 py-1 text-sm bg-white"
                      >
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                    {/* Columna Acciones (Contraseña + Guardar/Cancelar) */}
                    <td className="px-6 py-4 flex gap-2 items-center">
                      <input 
                        type="password" 
                        placeholder="Nueva contraseña (opc)" 
                        value={formData.password} 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="border rounded px-2 py-1 text-sm w-32"
                      />
                      <button onClick={() => handleUpdateSubmit(u.id)} className="bg-green-600 text-white px-3 py-1 rounded text-xs font-semibold">Guardar</button>
                      <button onClick={() => setEditingUser(null)} className="bg-gray-400 text-white px-3 py-1 rounded text-xs font-semibold">Cancelar</button>
                    </td>
                  </>
                ) : (
                  <>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{u.full_name}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">{u.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium flex gap-2">
          <button onClick={() => handleEditClick(u)} className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 px-3 py-1 rounded">Editar</button>
          <button onClick={() => handleDeleteUser(u.id)} className="text-red-600 hover:text-red-900 bg-red-50 px-3 py-1 rounded">Eliminar</button>
        </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}