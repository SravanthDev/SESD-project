import focusRepository from './focus.repository.js';

class FocusService {
  async getSessions(userId, limit) {
    return focusRepository.find({ userId }, parseInt(limit) || 20);
  }

  async createSession(userId, { duration, type = 'pomodoro' }) {
    return focusRepository.create({ userId, duration, type });
  }
}

export default new FocusService();
