import apiClient from './api';

class AuthService {
  async register(data) {
    return apiClient.post('/api/auth/register', data);
  }

  async login(data) {
    return apiClient.post('/api/auth/login', data);
  }

  async getCurrentUser() {
    return apiClient.get('/api/auth/me');
  }
}

export default new AuthService();
