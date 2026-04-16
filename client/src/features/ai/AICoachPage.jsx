import React, { useState } from 'react';
import aiService from '../../services/ai.service';
import { motion } from 'framer-motion';
import { Brain, Lightbulb, TrendingDown, BookOpen, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

const AICoachPage = () => {
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [responseType, setResponseType] = useState('');

  const askAI = async (endpoint, type, loadingMsg) => {
    setLoading(true);
    setResponseType(type);
    toast.info(loadingMsg);

    try {
      const res = await (endpoint === 'plan-day' ? aiService.planDay() : endpoint === 'analyze-productivity' ? aiService.analyzeProductivity() : endpoint === 'summarize-journal' ? aiService.summarizeJournal() : aiService.suggestImprovements());
      const key = Object.keys(res.data)[0];
      setResponse(res.data[key]);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error(error.response?.data?.error || 'AI request failed');
      setResponse(null);
    } finally {
      setLoading(false);
    }
  };

  const aiActions = [
    {
      title: 'Plan My Day',
      description: 'Get a strategic plan for today based on your tasks and habits',
      icon: Lightbulb,
      endpoint: 'plan-day',
      type: 'plan',
      bgColor: 'bg-indigo-500/20',
      textColor: 'text-indigo-400',
      testId: 'plan-day-button'
    },
    {
      title: 'Why Am I Unproductive?',
      description: 'Brutal honest analysis of your productivity patterns',
      icon: TrendingDown,
      endpoint: 'analyze-productivity',
      type: 'analysis',
      bgColor: 'bg-orange-500/20',
      textColor: 'text-orange-400',
      testId: 'analyze-productivity-button'
    },
    {
      title: 'Summarize My Journal',
      description: 'Get insights from your recent journal entries',
      icon: BookOpen,
      endpoint: 'summarize-journal',
      type: 'summary',
      bgColor: 'bg-emerald-500/20',
      textColor: 'text-emerald-400',
      testId: 'summarize-journal-button'
    },
    {
      title: 'Suggest Improvements',
      description: 'Actionable suggestions to level up your productivity',
      icon: Sparkles,
      endpoint: 'suggest-improvements',
      type: 'suggestions',
      bgColor: 'bg-purple-500/20',
      textColor: 'text-purple-400',
      testId: 'suggest-improvements-button'
    }
  ];

  return (
    <div className="space-y-8" data-testid="ai-coach-page">
      <div>
        <h1 className="text-4xl sm:text-5xl tracking-tight font-light mb-2" data-testid="ai-coach-title">
          AI Coach
        </h1>
        <p className="text-base text-slate-400">Your strict but helpful productivity advisor</p>
      </div>

      {/* AI Actions Grid */}
      <div className="grid gap-6 md:grid-cols-2" data-testid="ai-actions-grid">
        {aiActions.map((action, index) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.endpoint}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => askAI(action.endpoint, action.type, `Analyzing...`)}
              disabled={loading}
              className="glass rounded-2xl p-6 text-left glass-hover disabled:opacity-50 disabled:cursor-not-allowed group"
              data-testid={action.testId}
            >
              <div className={`h-14 w-14 rounded-full ${action.bgColor} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-7 h-7 ${action.textColor}`} />
              </div>
              <h3 className="text-xl font-medium mb-2">{action.title}</h3>
              <p className="text-sm text-slate-400">{action.description}</p>
            </motion.button>
          );
        })}
      </div>

      {/* Loading State */}
      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-12 text-center"
          data-testid="ai-loading"
        >
          <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-indigo-500/20 mb-4 animate-pulse">
            <Brain className="w-8 h-8 text-indigo-400" />
          </div>
          <p className="text-lg text-slate-300">AI Coach is thinking...</p>
          <p className="text-sm text-slate-500 mt-2">Analyzing your data</p>
        </motion.div>
      )}

      {/* Response */}
      {response && !loading && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass rounded-2xl p-8 border-l-4 border-indigo-500"
          data-testid="ai-response"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="h-12 w-12 rounded-full bg-indigo-500/20 flex items-center justify-center">
              <Brain className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-2xl font-light">Coach's Response</h2>
              <p className="text-xs text-slate-500 capitalize">{responseType}</p>
            </div>
          </div>
          <div className="prose prose-invert max-w-none">
            <div className="whitespace-pre-wrap text-slate-200 leading-relaxed" data-testid="ai-response-text">
              {response}
            </div>
          </div>
        </motion.div>
      )}

      {/* Initial State */}
      {!response && !loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-12 text-center"
          data-testid="ai-empty-state"
        >
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-6">
            <Brain className="w-10 h-10 text-indigo-400" />
          </div>
          <h3 className="text-2xl font-light mb-2">Ready to Coach</h3>
          <p className="text-slate-400 max-w-md mx-auto">
            Select an action above to get personalized insights from your AI coach. The coach analyzes your tasks, habits, and journals to provide strict but helpful guidance.
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AICoachPage;
