import apiClient from './api';

class TaskService {
  async getAllTasks(params) {
    return apiClient.get('/api/tasks', { params });
  }

  async getTopTasks() {
    return apiClient.get('/api/tasks/top');
  }

  async createTask(data) {
    return apiClient.post('/api/tasks', data);
  }

  async updateTask(id, data) {
    return apiClient.patch(`/api/tasks/${id}`, data);
  }

  async deleteTask(id) {
    return apiClient.delete(`/api/tasks/${id}`);
  }

  async carryForward() {
    return apiClient.post('/api/tasks/carry-forward');
  }
}

export default new TaskService();
