import Task from './task.model.js';

/** Repository — SRP: encapsulates all Task data access */
class TaskRepository {
  async find(query, sort = { priority: -1, createdAt: -1 }) {
    return Task.find(query).sort(sort);
  }

  async findWithLimit(query, sort, limit) {
    return Task.find(query).sort(sort).limit(limit);
  }

  async findById(id, userId) {
    return Task.findOne({ _id: id, userId });
  }

  async create(data) {
    const task = new Task(data);
    return task.save();
  }

  async createMany(tasks) {
    return Task.insertMany(tasks);
  }

  async update(id, userId, updates) {
    return Task.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
  }

  async delete(id, userId) {
    return Task.findOneAndDelete({ _id: id, userId });
  }

  async count(query) {
    return Task.countDocuments(query);
  }
}

export default new TaskRepository();
