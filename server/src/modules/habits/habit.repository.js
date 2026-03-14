import Habit from './habit.model.js';

class HabitRepository {
  async findByUser(userId) {
    return Habit.find({ userId }).sort({ createdAt: -1 });
  }

  async findById(id, userId) {
    return Habit.findOne({ _id: id, userId });
  }

  async countByUser(userId) {
    return Habit.countDocuments({ userId });
  }

  async create(data) {
    const habit = new Habit(data);
    return habit.save();
  }

  async update(id, userId, updates) {
    return Habit.findOneAndUpdate({ _id: id, userId }, updates, { new: true });
  }

  async delete(id, userId) {
    return Habit.findOneAndDelete({ _id: id, userId });
  }
}

export default new HabitRepository();
