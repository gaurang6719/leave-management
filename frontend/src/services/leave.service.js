import api from './api';

export const applyForLeave = async (leaveData) => {
  const response = await api.post('/leaves', leaveData);
  return response.data;
};

export const fetchMyLeavesList = async (params = {}) => {
  const response = await api.get('/leaves/my-leaves', { params });
  return response.data;
};

export const fetchAllLeavesList = async (params = {}) => {
  const response = await api.get('/leaves', { params });
  return response.data;
};

export const updatePendingLeaveRequest = async (id, leaveData) => {
  const response = await api.put(`/leaves/${id}`, leaveData);
  return response.data;
};

export const cancelPendingLeaveRequest = async (id) => {
  const response = await api.post(`/leaves/${id}/cancel`);
  return response.data;
};

export const approveRejectLeaveRequest = async (id, decisionData) => {
  const response = await api.post(`/leaves/${id}/approve-reject`, decisionData);
  return response.data;
};

export const fetchLeaveStats = async () => {
  const response = await api.get('/leaves/stats');
  return response.data;
};
