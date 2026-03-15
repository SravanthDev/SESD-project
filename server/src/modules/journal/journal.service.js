import { startOfDay, endOfDay } from 'date-fns';
import { AppError } from '../../core/AppError.js';
import journalRepository from './journal.repository.js';

class JournalService {
  async getAll(userId, limit = 10) {
    return journalRepository.find({ userId }, { date: -1 }, parseInt(limit));
  }

  async getByDate(userId, dateStr) {
    const targetDate = new Date(dateStr);
    return journalRepository.findOne({
      userId,
      date: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) }
    });
  }

  async createOrUpdate(userId, { whatIDid, whatIAvoided, energyLevel, date }) {
    const targetDate = date ? new Date(date) : new Date();

    const existing = await journalRepository.findOne({
      userId,
      date: { $gte: startOfDay(targetDate), $lte: endOfDay(targetDate) }
    });

    if (existing) {
      existing.whatIDid = whatIDid;
      existing.whatIAvoided = whatIAvoided;
      existing.energyLevel = energyLevel;
      return existing.save();
    }

    return journalRepository.create({ userId, whatIDid, whatIAvoided, energyLevel, date: targetDate });
  }

  async delete(userId, journalId) {
    const journal = await journalRepository.delete(journalId, userId);
    if (!journal) throw AppError.notFound('Journal');
    return { message: 'Journal deleted' };
  }
}

export default new JournalService();
