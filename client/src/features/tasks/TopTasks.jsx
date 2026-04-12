import React, { useState, useEffect } from 'react';
import taskService from '../../services/task.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check } from 'lucide-react';
import { toast } from 'sonner';

const TopTasks = ({ onUpdate }) => {
  const [tasks, setTasks] = useState([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTopTasks();
  }, []);

  const fetchTopTasks = async () => {
    try {
      const response = await taskService.getTopTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    try {
      await taskService.createTask({
        title: newTaskTitle,
        priority: tasks.length < 3 ? 3 : 0,
        group: 'daily'
      });
      setNewTaskTitle('');
      fetchTopTasks();
      onUpdate?.();
      toast.success('Task added!');
    } catch (error) {
      toast.error('Failed to add task');
    }
  };

  const toggleTask = async (task) => {
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      await taskService.updateTask(task._id, { status: newStatus });
      fetchTopTasks();
      onUpdate?.();
      toast.success(newStatus === 'completed' ? 'Task completed! 🎉' : 'Task reopened');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  if (loading) {
    return (
      <div className="glass rounded-2xl p-6 h-96 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass rounded-2xl p-8 border-2 border-indigo-500/20"
      data-testid="top-tasks"
    >
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl font-light tracking-tight" data-testid="top-tasks-title">
            Top 3 Priority Tasks
          </h2>
          <span className="text-xs uppercase tracking-[0.2em] font-bold text-slate-500">
            Focus Zone
          </span>
        </div>
        <p className="text-sm text-slate-400">Your most important tasks for today</p>
      </div>

      {/* Task List */}
      <div className="space-y-4 mb-6">
        <AnimatePresence mode="popLayout">
          {tasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-slate-400"
              data-testid="no-tasks-message"
            >
              <p>No priority tasks yet. Add your first one below!</p>
            </motion.div>
          ) : (
            tasks.map((task, index) => (
              <motion.div
                key={task._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ delay: index * 0.1 }}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
                  task.status === 'completed'
                    ? 'bg-emerald-500/10 border border-emerald-500/20'
                    : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}
                data-testid={`task-item-${index}`}
              >
                <button
                  onClick={() => toggleTask(task)}
                  className={`h-8 w-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                    task.status === 'completed'
                      ? 'bg-emerald-500 border-emerald-500'
                      : 'border-slate-500 hover:border-indigo-400'
                  }`}
                  data-testid={`task-toggle-${index}`}
                >
                  {task.status === 'completed' && <Check className="w-5 h-5 text-white" />}
                </button>
                <div className="flex-1">
                  <p
                    className={`text-base ${
                      task.status === 'completed'
                        ? 'line-through text-slate-400'
                        : 'text-white'
                    }`}
                    data-testid={`task-title-${index}`}
                  >
                    {task.title}
                  </p>
                </div>
                {task.priority > 0 && task.status === 'pending' && (
                  <div className="flex gap-1">
                    {[...Array(task.priority)].map((_, i) => (
                      <div key={i} className="h-2 w-2 rounded-full bg-indigo-500" />
                    ))}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Add Task Form */}
      <form onSubmit={addTask} className="flex gap-3" data-testid="add-task-form">
        <input
          type="text"
          value={newTaskTitle}
          onChange={(e) => setNewTaskTitle(e.target.value)}
          placeholder="Add a new priority task..."
          className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
          data-testid="new-task-input"
        />
        <button
          type="submit"
          className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-6 py-3 font-medium transition-colors focus:ring-2 focus:ring-indigo-500/50 flex items-center gap-2"
          data-testid="add-task-button"
        >
          <Plus className="w-5 h-5" />
          <span className="hidden sm:inline">Add</span>
        </button>
      </form>
    </motion.div>
  );
};

export default TopTasks;
