import axios from './axiosConfig'; 

// Obtener todos los proyectos del usuario
export const getProjects = async () => {
  const response = await axios.get('/api/projects');
  return response.data;
};

// Crear un nuevo proyecto
export const createProject = async (projectData) => {
  const response = await axios.post('/api/projects', projectData);
  return response.data;
};