import React, { useState, useEffect } from 'react';
import habitService from '../../services/habit.service';
import { motion } from 'framer-motion';
import { Target, Plus, Check, Flame, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { startOfDay } from 'date-fns';

const HabitsPage = () => {
  const [habits, setHabits] = useState([]);
  const [newHabitName, setNewHabitName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await habitService.getAll();
      setHabits(response.data.habits);
    } catch (error) {
      console.error('Failed to fetch habits:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHabit = async (e) => {
    e.preventDefault();
    if (!newHabitName.trim()) return;

    if (habits.length >= 5) {
      toast.error('Maximum 5 habits allowed');
      return;
    }

    try {
      await habitService.create({ name: newHabitName });
      setNewHabitName('');
      fetchHabits();
      toast.success('Habit created!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to create habit');
    }
  };

  const completeHabit = async (habitId) => {
    try {
      await habitService.complete(habitId);
      fetchHabits();
      toast.success('Habit completed! 🔥');
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to complete habit');
    }
  };

  const deleteHabit = async (habitId) => {
    try {
      await habitService.delete(habitId);
      fetchHabits();
      toast.success('Habit deleted');
    } catch (error) {
      toast.error('Failed to delete habit');
    }
  };

  const isCompletedToday = (habit) => {
    const today = startOfDay(new Date()).getTime();
    return habit.completedDates.some(
      date => startOfDay(new Date(date)).getTime() === today
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="habits-page">
      <div>
        <h1 className="text-4xl sm:text-5xl tracking-tight font-light mb-2" data-testid="habits-title">Habit Tracker</h1>
        <p className="text-base text-slate-400">Build consistency, track streaks</p>
      </div>

      {/* Add Habit Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
        data-testid="add-habit-section"
      >
        <h2 className="text-xl font-medium mb-4">Create New Habit (Max 5)</h2>
        <form onSubmit={addHabit} className="flex gap-3" data-testid="create-habit-form">
          <input
            type="text"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            placeholder="Habit name (e.g., Morning workout, Read 30 min)..."
            className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
            disabled={habits.length >= 5}
            data-testid="habit-name-input"
          />
          <button
            type="submit"
            disabled={habits.length >= 5}
            className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-6 py-3 font-medium transition-colors focus:ring-2 focus:ring-indigo-500/50 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            data-testid="create-habit-button"
          >
            <Plus className="w-5 h-5" />
            Add Habit
          </button>
        </form>
      </motion.div>

      {/* Habits List */}
      <div className="grid gap-6 md:grid-cols-2" data-testid="habits-list">
        {habits.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="glass rounded-2xl p-12 text-center col-span-2"
            data-testid="no-habits-message"
          >
            <Target className="w-12 h-12 text-slate-500 mx-auto mb-4" />
            <p className="text-slate-400">No habits yet. Create your first one above!</p>
          </motion.div>
        ) : (
          habits.map((habit, index) => {
            const completedToday = isCompletedToday(habit);

            return (
              <motion.div
                key={habit._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                className="glass rounded-2xl p-6 relative overflow-hidden"
                data-testid={`habit-card-${habit._id}`}
              >
                {/* Streak background effect */}
                {habit.currentStreak > 0 && (
                  <div
                    className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-500/20 to-transparent blur-3xl"
                  />
                )}

                <div className="relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-medium mb-2" data-testid={`habit-name-${habit._id}`}>{habit.name}</h3>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Flame className="w-4 h-4 text-orange-400" />
                          <span data-testid={`habit-streak-${habit._id}`}>{habit.currentStreak} day streak</span>
                        </div>
                        <div className="text-slate-500">
                          Best: {habit.longestStreak}d
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => deleteHabit(habit._id)}
                      className="h-8 w-8 rounded-full flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
                      data-testid={`habit-delete-${habit._id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all"
                        style={{ width: `${Math.min(habit.currentStreak * 10, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Complete Button */}
                  <button
                    onClick={() => completeHabit(habit._id)}
                    disabled={completedToday}
                    className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all ${
                      completedToday
                        ? 'bg-emerald-500/20 text-emerald-400 border-2 border-emerald-500/30 cursor-not-allowed'
                        : 'bg-indigo-500 hover:bg-indigo-400 text-white'
                    }`}
                    data-testid={`habit-complete-${habit._id}`}
                  >
                    {completedToday ? (
                      <>
                        <Check className="w-5 h-5" />
                        Completed Today!
                      </>
                    ) : (
                      <>
                        <Target className="w-5 h-5" />
                        Mark as Done
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default HabitsPage;
