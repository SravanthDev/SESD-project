import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'sonner';

// Context
import { AuthProvider, AuthContext } from './context/AuthContext';

// Features
import AuthPage from './features/auth/AuthPage';
import DashboardLayout from './features/dashboard/DashboardLayout';
import DashboardHome from './features/dashboard/DashboardHome';
import TasksPage from './features/tasks/TasksPage';
import JournalPage from './features/journal/JournalPage';
import HabitsPage from './features/habits/HabitsPage';
import AICoachPage from './features/ai/AICoachPage';
import FocusPage from './features/focus/FocusPage';

const ProtectedRoute = ({ children }) => {
  const { user } = useContext(AuthContext);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  const { user } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" replace /> : <AuthPage />} />
      
      <Route path="/" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<DashboardHome />} />
        <Route path="tasks" element={<TasksPage />} />
        <Route path="journal" element={<JournalPage />} />
        <Route path="habits" element={<HabitsPage />} />
        <Route path="focus" element={<FocusPage />} />
        <Route path="ai-coach" element={<AICoachPage />} />
      </Route>
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-indigo-500/30">
          <Toaster 
            theme="dark" 
            position="top-right"
            toastOptions={{
              className: 'bg-black/80 backdrop-blur-md border border-white/10 text-white',
            }}
          />
          <AppRoutes />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
