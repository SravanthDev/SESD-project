import apiClient from './api';

class AIService {
  async planDay() {
    return apiClient.post('/api/ai/plan-day');
  }

  async analyzeProductivity() {
    return apiClient.post('/api/ai/analyze-productivity');
  }

  async summarizeJournal(days = 7) {
    return apiClient.post('/api/ai/summarize-journal', { days });
  }

  async suggestImprovements() {
    return apiClient.post('/api/ai/suggest-improvements');
  }
}

export default new AIService();
