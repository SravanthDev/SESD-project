import apiClient from './api';

class HabitService {
  async getAll() {
    return apiClient.get('/api/habits');
  }

  async create(data) {
    return apiClient.post('/api/habits', data);
  }

  async complete(id) {
    return apiClient.post(`/api/habits/${id}/complete`);
  }

  async update(id, data) {
    return apiClient.patch(`/api/habits/${id}`, data);
  }

  async delete(id) {
    return apiClient.delete(`/api/habits/${id}`);
  }
}

export default new HabitService();
