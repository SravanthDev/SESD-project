import { startOfDay, differenceInDays } from 'date-fns';
import { AppError } from '../../core/AppError.js';
import habitRepository from './habit.repository.js';

const MAX_HABITS = 5;

class HabitService {
  async getAll(userId) {
    return habitRepository.findByUser(userId);
  }

  async create(userId, { name }) {
    const count = await habitRepository.countByUser(userId);
    if (count >= MAX_HABITS) {
      throw AppError.badRequest(`Maximum ${MAX_HABITS} habits allowed`);
    }
    return habitRepository.create({ userId, name });
  }

  async complete(userId, habitId) {
    const habit = await habitRepository.findById(habitId, userId);
    if (!habit) throw AppError.notFound('Habit');

    const today = startOfDay(new Date());
    const alreadyCompleted = habit.completedDates.some(
      date => startOfDay(date).getTime() === today.getTime()
    );

    if (alreadyCompleted) {
      throw AppError.badRequest('Habit already completed today');
    }

    habit.completedDates.push(today);
    habit.lastCompletedAt = today;
    this._calculateStreak(habit);

    return habit.save();
  }

  /** Pure streak calculation — easily testable in isolation */
  _calculateStreak(habit) {
    const sortedDates = habit.completedDates
      .map(d => startOfDay(d))
      .sort((a, b) => b - a);

    let currentStreak = 1;
    for (let i = 0; i < sortedDates.length - 1; i++) {
      if (differenceInDays(sortedDates[i], sortedDates[i + 1]) === 1) {
        currentStreak++;
      } else {
        break;
      }
    }

    habit.currentStreak = currentStreak;
    habit.longestStreak = Math.max(habit.longestStreak, currentStreak);
  }

  async update(userId, habitId, { name }) {
    const habit = await habitRepository.update(habitId, userId, { name });
    if (!habit) throw AppError.notFound('Habit');
    return habit;
  }

  async delete(userId, habitId) {
    const habit = await habitRepository.delete(habitId, userId);
    if (!habit) throw AppError.notFound('Habit');
    return { message: 'Habit deleted' };
  }
}

export default new HabitService();
