import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import {
  LayoutDashboard,
  CheckSquare,
  BookOpen,
  Target,
  Brain,
  Timer,
  LogOut
} from 'lucide-react';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);

  const navItems = [
    { path: '/', icon: LayoutDashboard, label: 'Dashboard', testId: 'nav-dashboard' },
    { path: '/tasks', icon: CheckSquare, label: 'Tasks', testId: 'nav-tasks' },
    { path: '/journal', icon: BookOpen, label: 'Journal', testId: 'nav-journal' },
    { path: '/habits', icon: Target, label: 'Habits', testId: 'nav-habits' },
    { path: '/ai-coach', icon: Brain, label: 'AI Coach', testId: 'nav-ai-coach' },
    { path: '/focus', icon: Timer, label: 'Focus', testId: 'nav-focus' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={onClose}
          data-testid="sidebar-overlay"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 glass z-50 transition-transform duration-300 ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
        data-testid="sidebar"
      >
        <div className="flex flex-col h-full p-6">
          {/* Logo */}
          <div className="mb-8" data-testid="sidebar-logo">
            <h1 className="text-2xl font-light tracking-tight">LifeOS AI</h1>
            <p className="text-xs text-slate-400 mt-1">Control Room</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={onClose}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? 'bg-indigo-500/20 border border-indigo-500/30 text-white'
                      : 'text-slate-300 hover:bg-white/5 hover:text-white border border-transparent'
                  }`}
                  data-testid={item.testId}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="border-t border-white/10 pt-4 space-y-3">
            <div className="flex items-center gap-3 px-2" data-testid="user-info">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-indigo-500 to-emerald-400 flex items-center justify-center text-white font-medium">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center gap-2 px-4 py-2 text-slate-300 hover:text-white hover:bg-red-500/10 rounded-lg transition-all"
              data-testid="logout-button"
            >
              <LogOut className="w-4 h-4" />
              <span className="text-sm">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
