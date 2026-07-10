import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { getSettings, updateSettings } from '../services/api';
import { Save, Loader2 } from 'lucide-react';

export function Settings() {
  const { data: currentSettings, isLoading } = useQuery({
    queryKey: ['settings'],
    queryFn: getSettings,
  });

  const [settings, setSettings] = useState({
    chunk_size: 500,
    chunk_overlap: 100,
    top_k_retrieval: 5,
    temperature: 0.0,
    embedding_model: 'BAAI/bge-small-en-v1.5',
    llm_provider: 'gemini'
  });

  useEffect(() => {
    if (currentSettings) {
      setSettings(currentSettings);
    }
  }, [currentSettings]);

  const mutation = useMutation({
    mutationFn: updateSettings,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({
      ...prev,
      [name]: name === 'chunk_size' || name === 'chunk_overlap' || name === 'top_k_retrieval' 
        ? parseInt(value) 
        : name === 'temperature' ? parseFloat(value) : value
    }));
  };

  const handleSave = () => {
    mutation.mutate(settings);
  };

  if (isLoading) {
    return <div className="flex justify-center p-12"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white">Settings</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Configure the RAG pipeline parameters.</p>
      </div>

      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl p-6 shadow-sm space-y-6">
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Document Processing</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chunk Size (Tokens)</label>
              <input 
                type="number" 
                name="chunk_size"
                value={settings.chunk_size} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Chunk Overlap</label>
              <input 
                type="number" 
                name="chunk_overlap"
                value={settings.chunk_overlap} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Embedding Model</label>
            <select 
              name="embedding_model"
              value={settings.embedding_model}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="BAAI/bge-small-en-v1.5">BAAI/bge-small-en-v1.5</option>
              <option value="all-MiniLM-L6-v2">all-MiniLM-L6-v2</option>
            </select>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-2">Retrieval & Generation</h2>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Top-K Retrieval</label>
              <input 
                type="number" 
                name="top_k_retrieval"
                value={settings.top_k_retrieval} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Temperature (0.0 - 1.0)</label>
              <input 
                type="number"
                step="0.1"
                min="0"
                max="1" 
                name="temperature"
                value={settings.temperature} 
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">LLM Provider</label>
            <select 
              name="llm_provider"
              value={settings.llm_provider}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="gemini">Google Gemini API</option>
              <option value="openai" disabled>OpenAI (Coming Soon)</option>
              <option value="groq" disabled>Groq (Coming Soon)</option>
            </select>
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={handleSave}
            disabled={mutation.isPending}
            className="flex items-center justify-center w-full sm:w-auto px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {mutation.isPending ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
            Save Settings
          </button>
          {mutation.isSuccess && <p className="mt-2 text-sm text-green-600 dark:text-green-400">Settings saved successfully!</p>}
        </div>
      </div>
    </div>
  );
}
