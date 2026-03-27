import apiClient from './api';

class JournalService {
  async getAll(limit = 10) {
    return apiClient.get('/api/journals', { params: { limit } });
  }

  async getByDate(date) {
    return apiClient.get(`/api/journals/date/${date}`);
  }

  async createOrUpdate(data) {
    return apiClient.post('/api/journals', data);
  }

  async delete(id) {
    return apiClient.delete(`/api/journals/${id}`);
  }
}

export default new JournalService();
