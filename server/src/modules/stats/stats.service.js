import mongoose from 'mongoose';
import { startOfDay, endOfDay, startOfWeek, subDays } from 'date-fns';
import taskRepository from '../tasks/task.repository.js';
import focusRepository from '../focus/focus.repository.js';
import habitRepository from '../habits/habit.repository.js';

/** Stats service — aggregates data from multiple repositories (SRP: only analytics logic) */
class StatsService {
  async getDashboard(userId) {
    const today = new Date();
    const weekStart = startOfWeek(today);
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const [completedToday, pendingToday, completedWeek, missedTasks, focusSessions, habits] =
      await Promise.all([
        taskRepository.count({
          userId, status: 'completed',
          completedAt: { $gte: startOfDay(today), $lte: endOfDay(today) }
        }),
        taskRepository.count({
          userId, status: 'pending',
          date: { $gte: startOfDay(today), $lte: endOfDay(today) }
        }),
        taskRepository.count({
          userId, status: 'completed', completedAt: { $gte: weekStart }
        }),
        taskRepository.count({
          userId, status: 'pending', date: { $lt: startOfDay(today) }
        }),
        focusRepository.count({
          userId, date: { $gte: startOfWeek(today) }
        }),
        habitRepository.findByUser(userId),
      ]);

    const totalFocusMinutes = await focusRepository.aggregate([
      { $match: { userId: userObjectId, date: { $gte: weekStart } } },
      { $group: { _id: null, total: { $sum: '$duration' } } }
    ]);

    const focusMinutes = totalFocusMinutes[0]?.total || 0;
    const avgStreak = habits.length > 0
      ? habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length
      : 0;

    return {
      completedToday, pendingToday, completedWeek, missedTasks,
      focusSessions, focusMinutes,
      avgStreak: Math.round(avgStreak * 10) / 10,
      totalHabits: habits.length
    };
  }

  async getWeekly(userId) {
    const today = new Date();
    const userObjectId = new mongoose.Types.ObjectId(userId);
    const weekData = [];

    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const dayStart = startOfDay(date);
      const dayEnd = endOfDay(date);

      const [completed, focusMinutes] = await Promise.all([
        taskRepository.count({
          userId, status: 'completed',
          completedAt: { $gte: dayStart, $lte: dayEnd }
        }),
        focusRepository.aggregate([
          { $match: { userId: userObjectId, date: { $gte: dayStart, $lte: dayEnd } } },
          { $group: { _id: null, total: { $sum: '$duration' } } }
        ])
      ]);

      weekData.push({
        date: date.toISOString().split('T')[0],
        day: date.toLocaleDateString('en-US', { weekday: 'short' }),
        completed,
        focusMinutes: focusMinutes[0]?.total || 0
      });
    }

    return weekData;
  }
}

export default new StatsService();
