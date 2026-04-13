import React, { useState, useEffect } from 'react';
import journalService from '../../services/journal.service';
import { motion } from 'framer-motion';
import { BookOpen, Save } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

const JournalPage = () => {
  const [todayJournal, setTodayJournal] = useState({
    whatIDid: '',
    whatIAvoided: '',
    energyLevel: 3
  });
  const [pastJournals, setPastJournals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJournals();
  }, []);

  const fetchJournals = async () => {
    try {
      const today = format(new Date(), 'yyyy-MM-dd');
      const [todayRes, pastRes] = await Promise.all([
        journalService.getByDate(today),
        journalService.getAll(10)
      ]);

      if (todayRes.data.journal) {
        setTodayJournal(todayRes.data.journal);
      }
      setPastJournals(pastRes.data.journals);
    } catch (error) {
      console.error('Failed to fetch journals:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveJournal = async (e) => {
    e.preventDefault();

    try {
      await journalService.createOrUpdate(todayJournal);
      toast.success('Journal saved! 📔');
      fetchJournals();
    } catch (error) {
      toast.error('Failed to save journal');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8" data-testid="journal-page">
      <div>
        <h1 className="text-4xl sm:text-5xl tracking-tight font-light mb-2" data-testid="journal-title">Daily Journal</h1>
        <p className="text-base text-slate-400">Reflect on your day</p>
      </div>

      {/* Today's Journal */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-8"
        data-testid="today-journal-form"
      >
        <div className="flex items-center gap-3 mb-6">
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <h2 className="text-2xl font-light">Today's Entry</h2>
        </div>

        <form onSubmit={saveJournal} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2" data-testid="what-i-did-label">What I did today</label>
            <textarea
              value={todayJournal.whatIDid}
              onChange={(e) => setTodayJournal({ ...todayJournal, whatIDid: e.target.value })}
              placeholder="Describe your accomplishments, actions, and experiences..."
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all w-full min-h-[120px] resize-none"
              required
              data-testid="what-i-did-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" data-testid="what-i-avoided-label">What I avoided (optional)</label>
            <textarea
              value={todayJournal.whatIAvoided}
              onChange={(e) => setTodayJournal({ ...todayJournal, whatIAvoided: e.target.value })}
              placeholder="Tasks or challenges you put off..."
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all w-full min-h-[80px] resize-none"
              data-testid="what-i-avoided-input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-3" data-testid="energy-level-label">Energy Level</label>
            <div className="flex gap-3" data-testid="energy-level-selector">
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  onClick={() => setTodayJournal({ ...todayJournal, energyLevel: level })}
                  className={`h-14 w-14 rounded-full border-2 flex items-center justify-center font-medium transition-all ${
                    todayJournal.energyLevel === level
                      ? 'bg-indigo-500 border-indigo-500 text-white scale-110'
                      : 'border-white/20 text-slate-400 hover:border-indigo-400 hover:text-white'
                  }`}
                  data-testid={`energy-level-${level}`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-xs text-slate-500 mt-2">1 = Very Low, 5 = Very High</p>
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-6 py-3 font-medium transition-colors focus:ring-2 focus:ring-indigo-500/50 flex items-center justify-center gap-2"
            data-testid="save-journal-button"
          >
            <Save className="w-5 h-5" />
            Save Journal Entry
          </button>
        </form>
      </motion.div>

      {/* Past Journals */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
        data-testid="past-journals"
      >
        <h2 className="text-2xl font-light mb-6">Past Entries</h2>
        <div className="space-y-4">
          {pastJournals.length === 0 ? (
            <p className="text-slate-400 text-center py-8" data-testid="no-journals-message">No past entries yet</p>
          ) : (
            pastJournals.map((journal) => (
              <div
                key={journal._id}
                className="bg-white/5 border border-white/10 rounded-xl p-5"
                data-testid={`journal-entry-${journal._id}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium text-indigo-400">
                    {format(new Date(journal.date), 'MMMM d, yyyy')}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-500">Energy:</span>
                    <span className="text-sm font-medium">{journal.energyLevel}/5</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <p className="text-xs text-slate-500 mb-1">What I did:</p>
                    <p className="text-sm text-slate-200">{journal.whatIDid}</p>
                  </div>
                  {journal.whatIAvoided && (
                    <div>
                      <p className="text-xs text-slate-500 mb-1">What I avoided:</p>
                      <p className="text-sm text-slate-400 italic">{journal.whatIAvoided}</p>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default JournalPage;
