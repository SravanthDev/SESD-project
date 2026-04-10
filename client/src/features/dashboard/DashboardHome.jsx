import React, { useState, useEffect } from 'react';
import statsService from '../../services/stats.service';
import TopTasks from '../tasks/TopTasks';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { CheckCircle2, Clock, Flame, Target, TrendingUp, AlertCircle } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color, testId }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="glass rounded-2xl p-6 glass-hover"
    data-testid={testId}
  >
    <div className="flex items-center justify-between mb-4">
      <div className={`h-12 w-12 rounded-full flex items-center justify-center`}
        style={{ backgroundColor: `var(--stat-${color}-bg, rgba(99, 102, 241, 0.2))` }}
      >
        <Icon className="w-6 h-6" style={{ color: `var(--stat-${color}-fg, #818cf8)` }} />
      </div>
      <span className="text-3xl font-light" data-testid={`${testId}-value`}>{value}</span>
    </div>
    <p className="text-sm text-slate-400">{label}</p>
  </motion.div>
);

const DashboardHome = () => {
  const [stats, setStats] = useState(null);
  const [weekData, setWeekData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [statsRes, weekRes] = await Promise.all([
        statsService.getDashboardStats(),
        statsService.getWeeklyStats()
      ]);
      setStats(statsRes.data.stats);
      setWeekData(weekRes.data.weekData);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
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
    <div className="space-y-8" data-testid="dashboard-home">
      {/* Header */}
      <div>
        <h1 className="text-4xl sm:text-5xl tracking-tight font-light mb-2" data-testid="dashboard-title">
          Command Center
        </h1>
        <p className="text-base text-slate-400">Your productivity at a glance</p>
      </div>

      {/* Top 3 Tasks - Prominent */}
      <TopTasks onUpdate={fetchData} />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass rounded-2xl p-6 glass-hover" data-testid="stat-completed-today">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <span className="text-3xl font-light" data-testid="stat-completed-today-value">{stats?.completedToday || 0}</span>
          </div>
          <p className="text-sm text-slate-400">Completed Today</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.05 }} className="glass rounded-2xl p-6 glass-hover" data-testid="stat-pending">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Clock className="w-6 h-6 text-indigo-400" />
            </div>
            <span className="text-3xl font-light" data-testid="stat-pending-value">{stats?.pendingToday || 0}</span>
          </div>
          <p className="text-sm text-slate-400">Pending Tasks</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 }} className="glass rounded-2xl p-6 glass-hover" data-testid="stat-streak">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-6 h-6 text-orange-400" />
            </div>
            <span className="text-3xl font-light" data-testid="stat-streak-value">{stats?.avgStreak || 0}d</span>
          </div>
          <p className="text-sm text-slate-400">Avg Habit Streak</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.15 }} className="glass rounded-2xl p-6 glass-hover" data-testid="stat-focus">
          <div className="flex items-center justify-between mb-4">
            <div className="h-12 w-12 rounded-full bg-purple-500/20 flex items-center justify-center">
              <Target className="w-6 h-6 text-purple-400" />
            </div>
            <span className="text-3xl font-light" data-testid="stat-focus-value">{stats?.focusSessions || 0}</span>
          </div>
          <p className="text-sm text-slate-400">Focus Sessions</p>
        </motion.div>
      </div>

      {/* Weekly Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
        data-testid="weekly-chart"
      >
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="w-5 h-5 text-indigo-400" />
          <h2 className="text-2xl font-light">Weekly Progress</h2>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={weekData}>
            <defs>
              <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#818CF8" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#34D399" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="day" stroke="#64748B" style={{ fontSize: '12px' }} />
            <YAxis stroke="#64748B" style={{ fontSize: '12px' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: 'rgba(10, 10, 15, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#F8FAFC'
              }}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke="#818CF8"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCompleted)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Missed Tasks Warning */}
      {stats?.missedTasks > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-6 border-l-4 border-orange-500"
          data-testid="missed-tasks-alert"
        >
          <div className="flex items-start gap-4">
            <div className="h-10 w-10 rounded-full bg-orange-500/20 flex items-center justify-center flex-shrink-0">
              <AlertCircle className="w-5 h-5 text-orange-400" />
            </div>
            <div>
              <h3 className="text-lg font-medium mb-1">Incomplete Tasks</h3>
              <p className="text-sm text-slate-400">
                You have {stats.missedTasks} overdue task{stats.missedTasks !== 1 ? 's' : ''}. Time to take action.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default DashboardHome;
