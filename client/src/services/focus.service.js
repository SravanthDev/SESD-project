import apiClient from './api';

class FocusService {
  async getSessions(limit = 20) {
    return apiClient.get('/api/focus', { params: { limit } });
  }

  async createSession(data) {
    return apiClient.post('/api/focus', data);
  }
}

export default new FocusService();
