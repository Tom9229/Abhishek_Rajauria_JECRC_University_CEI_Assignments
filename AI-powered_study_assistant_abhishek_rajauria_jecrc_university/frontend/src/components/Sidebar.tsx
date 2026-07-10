import React from 'react';
import { NavLink } from 'react-router-dom';
import { BookOpen, MessageSquare, Settings, Library } from 'lucide-react';
import { cn } from '../lib/utils';

export function Sidebar() {
  const links = [
    { name: 'Dashboard', to: '/', icon: <Library className="w-5 h-5" /> },
    { name: 'Chat', to: '/chat', icon: <MessageSquare className="w-5 h-5" /> },
    { name: 'Settings', to: '/settings', icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <div className="w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 h-screen flex flex-col transition-colors duration-200">
      <div className="h-16 flex items-center px-6 border-b border-gray-200 dark:border-gray-800">
        <BookOpen className="w-6 h-6 text-blue-600 dark:text-blue-400 mr-3" />
        <span className="text-xl font-bold text-gray-900 dark:text-white">StudyAssist</span>
      </div>
      <nav className="flex-1 py-4 px-3 space-y-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700 dark:bg-blue-900/50 dark:text-blue-200'
                  : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800'
              )
            }
          >
            <span className="mr-3">{link.icon}</span>
            {link.name}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}
