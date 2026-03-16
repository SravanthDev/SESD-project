import FocusSession from './focus.model.js';

class FocusRepository {
  async find(query, limit = 20) {
    return FocusSession.find(query).sort({ date: -1 }).limit(limit);
  }

  async create(data) {
    const session = new FocusSession(data);
    return session.save();
  }

  async count(query) {
    return FocusSession.countDocuments(query);
  }

  async aggregate(pipeline) {
    return FocusSession.aggregate(pipeline);
  }
}

export default new FocusRepository();
