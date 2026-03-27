import apiClient from './api';

class StatsService {
  async getDashboardStats() {
    return apiClient.get('/api/stats/dashboard');
  }

  async getWeeklyStats() {
    return apiClient.get('/api/stats/weekly');
  }
}

export default new StatsService();
