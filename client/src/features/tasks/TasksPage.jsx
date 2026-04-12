import React, { useState, useEffect } from 'react';
import taskService from '../../services/task.service';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Check, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

const TasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('all');
  const [newTask, setNewTask] = useState({ title: '', group: 'daily', priority: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskService.getAllTasks();
      setTasks(response.data.tasks);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!newTask.title.trim()) return;

    try {
      await taskService.createTask(newTask);
      setNewTask({ title: '', group: 'daily', priority: 0 });
      fetchTasks();
      toast.success('Task created!');
    } catch (error) {
      toast.error('Failed to create task');
    }
  };

  const toggleTask = async (task) => {
    try {
      const newStatus = task.status === 'pending' ? 'completed' : 'pending';
      await taskService.updateTask(task._id, { status: newStatus });
      fetchTasks();
      toast.success(newStatus === 'completed' ? 'Completed! 🎉' : 'Reopened');
    } catch (error) {
      toast.error('Failed to update task');
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await taskService.deleteTask(taskId);
      fetchTasks();
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    }
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    if (filter === 'pending') return task.status === 'pending';
    if (filter === 'completed') return task.status === 'completed';
    return task.group === filter;
  });

  const groupedTasks = {
    daily: filteredTasks.filter(t => t.group === 'daily'),
    weekly: filteredTasks.filter(t => t.group === 'weekly'),
    longterm: filteredTasks.filter(t => t.group === 'longterm')
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const renderTask = (task) => (
    <div
      key={task._id}
      className={`flex items-center gap-4 p-4 rounded-xl transition-all ${
        task.status === 'completed'
          ? 'bg-emerald-500/10 border border-emerald-500/20'
          : 'bg-white/5 border border-white/10'
      }`}
      data-testid={`task-${task._id}`}
    >
      <button
        onClick={() => toggleTask(task)}
        className={`h-7 w-7 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
          task.status === 'completed'
            ? 'bg-emerald-500 border-emerald-500'
            : 'border-slate-500 hover:border-indigo-400'
        }`}
        data-testid={`task-toggle-${task._id}`}
      >
        {task.status === 'completed' && <Check className="w-4 h-4 text-white" />}
      </button>
      <div className="flex-1">
        <p className={task.status === 'completed' ? 'line-through text-slate-400' : ''}>
          {task.title}
        </p>
        {(filter === 'all' || filter === 'pending' || filter === 'completed') && (
          <p className="text-xs text-slate-500 capitalize">{task.group}</p>
        )}
      </div>
      {task.priority > 0 && (
        <div className="flex gap-1">
          {[...Array(task.priority)].map((_, i) => (
            <div key={i} className="h-2 w-2 rounded-full bg-indigo-500" />
          ))}
        </div>
      )}
      {task.carriedForward && (
        <span className="text-xs text-orange-400 bg-orange-500/10 px-2 py-1 rounded">Carried</span>
      )}
      <button
        onClick={() => deleteTask(task._id)}
        className="h-8 w-8 rounded-full flex items-center justify-center bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-all"
        data-testid={`task-delete-${task._id}`}
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );

  return (
    <div className="space-y-8" data-testid="tasks-page">
      <div>
        <h1 className="text-4xl sm:text-5xl tracking-tight font-light mb-2" data-testid="tasks-title">Task Manager</h1>
        <p className="text-base text-slate-400">Organize and conquer</p>
      </div>

      {/* Add Task Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6"
        data-testid="add-task-section"
      >
        <h2 className="text-xl font-medium mb-4">Create New Task</h2>
        <form onSubmit={addTask} className="space-y-4" data-testid="create-task-form">
          <input
            type="text"
            value={newTask.title}
            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            placeholder="Task title..."
            className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all w-full"
            data-testid="task-title-input"
          />
          <div className="flex gap-4 flex-wrap">
            <select
              value={newTask.group}
              onChange={(e) => setNewTask({ ...newTask, group: e.target.value })}
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              data-testid="task-group-select"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="longterm">Long-term</option>
            </select>
            <select
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: parseInt(e.target.value) })}
              className="bg-black/40 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
              data-testid="task-priority-select"
            >
              <option value="0">Normal Priority</option>
              <option value="1">Priority 1</option>
              <option value="2">Priority 2</option>
              <option value="3">Priority 3 (Top)</option>
            </select>
            <button
              type="submit"
              className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-lg px-6 py-3 font-medium transition-colors flex items-center gap-2"
              data-testid="create-task-button"
            >
              <Plus className="w-5 h-5" />
              Create Task
            </button>
          </div>
        </form>
      </motion.div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap" data-testid="task-filters">
        {['all', 'pending', 'completed', 'daily', 'weekly', 'longterm'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === f
                ? 'bg-indigo-500 text-white'
                : 'bg-white/5 text-slate-300 hover:bg-white/10'
            }`}
            data-testid={`filter-${f}`}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task Groups */}
      {(filter === 'all' || ['daily', 'weekly', 'longterm'].includes(filter)) ? (
        <div className="space-y-6">
          {Object.entries(groupedTasks).map(([group, groupTasks]) => (
            (filter === 'all' || filter === group) && (
              <motion.div
                key={group}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass rounded-2xl p-6"
                data-testid={`task-group-${group}`}
              >
                <h3 className="text-xl font-medium mb-4 capitalize">{group} Tasks ({groupTasks.length})</h3>
                <div className="space-y-3">
                  {groupTasks.length === 0 ? (
                    <p className="text-slate-400 text-sm" data-testid={`no-tasks-${group}`}>No {group} tasks</p>
                  ) : (
                    groupTasks.map(renderTask)
                  )}
                </div>
              </motion.div>
            )
          ))}
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-6"
          data-testid="filtered-tasks"
        >
          <h3 className="text-xl font-medium mb-4 capitalize">{filter} Tasks ({filteredTasks.length})</h3>
          <div className="space-y-3">
            {filteredTasks.length === 0 ? (
              <p className="text-slate-400 text-sm">No {filter} tasks</p>
            ) : (
              filteredTasks.map(renderTask)
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TasksPage;
