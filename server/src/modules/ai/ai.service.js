import { startOfDay, endOfDay, subDays } from 'date-fns';
import { GroqProvider } from './providers/groq.provider.js';
import taskRepository from '../tasks/task.repository.js';
import journalRepository from '../journal/journal.repository.js';
import habitRepository from '../habits/habit.repository.js';

/**
 * AI Service — orchestrates data gathering and prompt construction.
 * Depends on AIProvider abstraction (DIP) — provider is injected via constructor.
 */
class AIService {
  constructor(provider) {
    this.provider = provider;
  }

  async planDay(userId) {
    const today = new Date();
    const [tasks, habits, recentJournal] = await Promise.all([
      taskRepository.find({
        userId, status: 'pending',
        date: { $gte: startOfDay(today), $lte: endOfDay(today) }
      }),
      habitRepository.findByUser(userId),
      journalRepository.findOne({ userId }),
    ]);

    const prompt = `You are a strict but helpful life coach. Based on the user's data, create a focused daily plan.

Tasks for today (${tasks.length}):
${tasks.map(t => `- ${t.title} (Priority: ${t.priority})`).join('\n')}

Active habits (${habits.length}):
${habits.map(h => `- ${h.name} (Current streak: ${h.currentStreak} days)`).join('\n')}

Recent energy level: ${recentJournal ? recentJournal.energyLevel + '/5' : 'No data'}

Provide:
1. Priority order for tasks
2. Best time blocks for each
3. Habit integration suggestions
4. One strict reminder about execution

Be concise and actionable. No fluff.`;

    return this.provider.complete(prompt);
  }

  async analyzeProductivity(userId) {
    const today = new Date();
    const weekAgo = subDays(today, 7);

    const [missedTasks, completedTasks, journals, habits] = await Promise.all([
      taskRepository.find({ userId, status: 'pending', date: { $lt: startOfDay(today) } }),
      taskRepository.count({ userId, status: 'completed', completedAt: { $gte: weekAgo } }),
      journalRepository.find({ userId, date: { $gte: weekAgo } }, { date: -1 }, 7),
      habitRepository.findByUser(userId),
    ]);

    const avgEnergy = journals.length > 0
      ? journals.reduce((acc, j) => acc + j.energyLevel, 0) / journals.length : 0;
    const brokenStreaks = habits.filter(h => h.currentStreak === 0).length;

    const prompt = `You are a strict life coach analyzing poor productivity. Be direct and honest.

Data from the past 7 days:
- Completed tasks: ${completedTasks}
- Missed/pending tasks: ${missedTasks.length}
- Average energy level: ${avgEnergy.toFixed(1)}/5
- Broken habit streaks: ${brokenStreaks}/${habits.length}
- Journal entries: ${journals.length}/7

Recent missed tasks:
${missedTasks.slice(0, 5).map(t => `- ${t.title}`).join('\n')}

Provide:
1. The brutal truth about what's not working
2. 3 specific behavioral changes needed
3. One immediate action to take today

No sugar-coating. Be strict but constructive.`;

    return this.provider.complete(prompt, { temperature: 0.8, maxTokens: 600 });
  }

  async summarizeJournal(userId, days = 7) {
    const since = subDays(new Date(), days);
    const journals = await journalRepository.find(
      { userId, date: { $gte: since } }, { date: -1 }, days
    );

    if (journals.length === 0) {
      return null;
    }

    const prompt = `Summarize these journal entries as a strict life coach would. Identify patterns, energy trends, and avoidance behaviors.

Entries:
${journals.map(j => `
Date: ${j.date.toLocaleDateString()}
What I did: ${j.whatIDid}
What I avoided: ${j.whatIAvoided || 'Nothing noted'}
Energy: ${j.energyLevel}/5`).join('\n---')}

Provide:
1. Key patterns observed
2. Energy trends
3. Avoidance patterns
4. One actionable insight

Be insightful and direct.`;

    return this.provider.complete(prompt);
  }

  async suggestImprovements(userId) {
    const today = new Date();
    const weekAgo = subDays(today, 7);

    const [tasks, habits, journals, completedCount] = await Promise.all([
      taskRepository.find({ userId, date: { $gte: weekAgo } }),
      habitRepository.findByUser(userId),
      journalRepository.find({ userId, date: { $gte: weekAgo } }, { date: -1 }, 7),
      taskRepository.count({ userId, status: 'completed', completedAt: { $gte: weekAgo } }),
    ]);

    const completionRate = tasks.length > 0 ? (completedCount / tasks.length) * 100 : 0;
    const avgStreak = habits.length > 0
      ? habits.reduce((acc, h) => acc + h.currentStreak, 0) / habits.length : 0;

    const prompt = `As a behavioral psychology-focused life coach, suggest concrete improvements.

Current metrics:
- Task completion rate: ${completionRate.toFixed(1)}%
- Total tasks: ${tasks.length}
- Active habits: ${habits.length}
- Average habit streak: ${avgStreak.toFixed(1)} days
- Journal consistency: ${journals.length}/7 days

Provide:
1. One system-level improvement (how they organize work)
2. One behavioral change (mindset/approach)
3. One tactical change (specific action)

Focus on reducing decision fatigue and increasing execution. Be specific and actionable.`;

    return this.provider.complete(prompt, { temperature: 0.8 });
  }
}

// Dependency injection: inject the concrete Groq provider
export default new AIService(new GroqProvider());
