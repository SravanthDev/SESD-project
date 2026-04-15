import React, { useState, useEffect, useRef } from 'react';
import focusService from '../../services/focus.service';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Timer } from 'lucide-react';
import { toast } from 'sonner';

const FocusPage = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionDuration, setSessionDuration] = useState(25);
  const [sessions, setSessions] = useState([]);
  const intervalRef = useRef(null);

  useEffect(() => {
    fetchSessions();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleSessionComplete();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, timeLeft]);

  const fetchSessions = async () => {
    try {
      const response = await focusService.getSessions(10);
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Failed to fetch sessions:', error);
    }
  };

  const handleSessionComplete = async () => {
    setIsRunning(false);
    toast.success('Focus session complete! 🎉');

    try {
      await axios.post(`${API_URL}/api/focus`, {
        duration: sessionDuration,
        type: 'pomodoro'
      });
      fetchSessions();
    } catch (error) {
      console.error('Failed to save session:', error);
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setTimeLeft(sessionDuration * 60);
  };

  const changeDuration = (minutes) => {
    setSessionDuration(minutes);
    setTimeLeft(minutes * 60);
    setIsRunning(false);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = ((sessionDuration * 60 - timeLeft) / (sessionDuration * 60)) * 100;

  return (
    <div className="space-y-8" data-testid="focus-page">
      <div>
        <h1 className="text-4xl sm:text-5xl tracking-tight font-light mb-2" data-testid="focus-title">Focus Timer</h1>
        <p className="text-base text-slate-400">Pomodoro technique for deep work</p>
      </div>

      {/* Timer */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-2xl p-12 text-center relative overflow-hidden"
        data-testid="pomodoro-timer"
      >
        {/* Circular Progress Background */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-indigo-500"
              style={{
                strokeDasharray: 283,
                strokeDashoffset: 283 - (283 * progress) / 100,
                transform: 'rotate(-90deg)',
                transformOrigin: '50% 50%',
                transition: 'stroke-dashoffset 1s linear'
              }}
            />
          </svg>
        </div>

        <div className="relative z-10">
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500/20 mb-8">
            <Timer className="w-8 h-8 text-indigo-400" />
          </div>

          {/* Time Display */}
          <div className="mb-8">
            <div
              className="text-8xl font-light tracking-tighter mb-4"
              style={{ fontVariantNumeric: 'tabular-nums' }}
              data-testid="timer-display"
            >
              {formatTime(timeLeft)}
            </div>
            <div className="h-2 w-64 mx-auto bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-emerald-400 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <button
              onClick={toggleTimer}
              className="h-16 w-16 rounded-full flex items-center justify-center bg-indigo-500 hover:bg-indigo-400 text-white transition-all focus:ring-2 focus:ring-indigo-500/50"
              data-testid="timer-toggle-button"
            >
              {isRunning ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
            </button>
            <button
              onClick={resetTimer}
              className="h-16 w-16 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white border border-white/10 transition-all"
              data-testid="timer-reset-button"
            >
              <RotateCcw className="w-6 h-6" />
            </button>
          </div>

          {/* Duration Presets */}
          <div className="flex items-center justify-center gap-3" data-testid="duration-presets">
            {[15, 25, 45, 60].map((mins) => (
              <button
                key={mins}
                onClick={() => changeDuration(mins)}
                disabled={isRunning}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                  sessionDuration === mins
                    ? 'bg-indigo-500 text-white'
                    : 'bg-white/5 text-slate-300 hover:bg-white/10'
                }`}
                data-testid={`duration-${mins}`}
              >
                {mins}m
              </button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Recent Sessions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-6"
        data-testid="recent-sessions"
      >
        <h2 className="text-2xl font-light mb-6">Recent Sessions</h2>
        <div className="space-y-3">
          {sessions.length === 0 ? (
            <p className="text-slate-400 text-center py-8" data-testid="no-sessions-message">No sessions yet. Complete your first one!</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session._id}
                className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-xl"
                data-testid={`session-${session._id}`}
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-500/20 flex items-center justify-center">
                    <Timer className="w-5 h-5 text-indigo-400" />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{session.duration} minute session</p>
                    <p className="text-xs text-slate-500">
                      {new Date(session.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
                <div className="text-xs uppercase tracking-[0.2em] font-bold text-emerald-400">
                  Completed
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default FocusPage;
