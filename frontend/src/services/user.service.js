import api from './api';

export const getEmployeesList = async (params = {}) => {
  const response = await api.get('/users', { params });
  return response.data;
};

export const getEmployeeDetails = async (id) => {
  const response = await api.get(`/users/${id}`);
  return response.data;
};

export const createEmployeeProfile = async (employeeData) => {
  const response = await api.post('/users', employeeData);
  return response.data;
};

export const updateEmployeeProfile = async (id, employeeData) => {
  const response = await api.put(`/users/${id}`, employeeData);
  return response.data;
};

export const deleteEmployeeProfile = async (id) => {
  const response = await api.delete(`/users/${id}`);
  return response.data;
};
