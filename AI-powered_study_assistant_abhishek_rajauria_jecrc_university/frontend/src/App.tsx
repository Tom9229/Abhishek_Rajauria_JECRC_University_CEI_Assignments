import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { Chat } from './pages/Chat';
import { Settings } from './pages/Settings';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <button 
          onClick={() => setDarkMode(!darkMode)}
          className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm"
          title="Toggle Theme"
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="chat" element={<Chat />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
