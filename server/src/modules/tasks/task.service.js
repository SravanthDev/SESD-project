import { startOfDay, endOfDay } from 'date-fns';
import { AppError } from '../../core/AppError.js';
import taskRepository from './task.repository.js';

/** Service — SRP: all task business logic (filtering, carry-forward, priority) */
class TaskService {
  async getTasks(userId, { group, date } = {}) {
    const query = { userId };
    if (group) query.group = group;
    if (date) {
      const targetDate = new Date(date);
      query.date = { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) };
    }
    return taskRepository.find(query);
  }

  async getTopPriority(userId) {
    const today = new Date();
    return taskRepository.findWithLimit(
      {
        userId,
        status: 'pending',
        date: { $gte: startOfDay(today), $lte: endOfDay(today) }
      },
      { priority: -1, createdAt: -1 },
      3
    );
  }

  async createTask(userId, { title, priority = 0, group = 'daily', date }) {
    return taskRepository.create({
      userId,
      title,
      priority,
      group,
      date: date || new Date()
    });
  }

  async updateTask(userId, taskId, updates) {
    if (updates.status === 'completed' && !updates.completedAt) {
      updates.completedAt = new Date();
    }

    const task = await taskRepository.update(taskId, userId, updates);
    if (!task) throw AppError.notFound('Task');
    return task;
  }

  async deleteTask(userId, taskId) {
    const task = await taskRepository.delete(taskId, userId);
    if (!task) throw AppError.notFound('Task');
    return { message: 'Task deleted' };
  }

  async carryForward(userId) {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const incompleteTasks = await taskRepository.find({
      userId,
      status: 'pending',
      date: { $gte: startOfDay(yesterday), $lte: endOfDay(yesterday) },
      carriedForward: false
    });

    const today = new Date();
    const newTasks = incompleteTasks.map(task => ({
      userId: task.userId,
      title: task.title,
      priority: task.priority,
      group: task.group,
      date: today,
      carriedForward: true
    }));

    if (newTasks.length > 0) {
      await taskRepository.createMany(newTasks);
    }

    return { message: `Carried forward ${newTasks.length} tasks`, count: newTasks.length };
  }
}

export default new TaskService();
