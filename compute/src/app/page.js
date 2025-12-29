'use client';

import { useState } from 'react';
import ItemList from './components/ItemList';
import HealthMonitor from './components/HealthMonitor';
import LoadTester from './components/LoadTester';

export default function Home() {
  const [activeTab, setActiveTab] = useState('items');

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black font-sans">
      <main className="w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-black dark:text-zinc-50 mb-2">
            Scalable Application
          </h1>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Aplikasi dengan arsitektur scalable, reliable, dan aman
          </p>
        </div>

        <div className="mb-6 border-b border-zinc-200 dark:border-zinc-800">
          <nav className="flex space-x-4">
            <button
              onClick={() => setActiveTab('items')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'items'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Items
            </button>
            <button
              onClick={() => setActiveTab('health')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'health'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Health Monitor
            </button>
            <button
              onClick={() => setActiveTab('test')}
              className={`px-4 py-2 font-medium border-b-2 transition-colors ${
                activeTab === 'test'
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-200'
              }`}
            >
              Load Testing
            </button>
          </nav>
        </div>

        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm p-6">
          {activeTab === 'items' && <ItemList />}
          {activeTab === 'health' && <HealthMonitor />}
          {activeTab === 'test' && <LoadTester />}
        </div>

        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm">
          <h3 className="font-semibold mb-2">API Endpoints:</h3>
          <ul className="space-y-1 text-zinc-700 dark:text-zinc-300">
            <li><code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">GET /api/items?page=1&limit=10</code> - Get paginated items</li>
            <li><code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">GET /api/items/[id]</code> - Get item by ID</li>
            <li><code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">GET /api/search?q=query</code> - Search items</li>
            <li><code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">GET /api/health</code> - Health check</li>
            <li><code className="bg-zinc-200 dark:bg-zinc-800 px-2 py-1 rounded">GET /api/metrics</code> - System metrics</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
