'use client';

import { useEffect, useState } from 'react';
import { fetchData, ModuleData } from '@/app/api/fetchData';

interface SearchData {
  query: string;
  type: string;
  PaidSearch: string;
}

export default function BasicResultPage() {
  const [searchData, setSearchData] = useState<SearchData | null>(null);
  const [loading, setLoading] = useState(true);
  const [modules, setModules] = useState<ModuleData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [totalModules, setTotalModules] = useState(0);
  const [isStreaming, setIsStreaming] = useState(false);

  useEffect(() => {
    if (searchData?.query && searchData?.type && searchData?.PaidSearch) {
      console.log("searchData", searchData);
      setIsStreaming(true);
      setModules([]);
      setCurrentIndex(0);
      
      fetchData(
        searchData.query,
        searchData.type,
        searchData.PaidSearch,
        (module: ModuleData, index: number, total: number) => {
          // This callback receives each module with 1-second delay
          setTotalModules(total);
          setCurrentIndex(index + 1);
          setModules(prev => [...prev, module]);
          
          // Stop streaming when all modules are received
          if (index + 1 === total) {
            setIsStreaming(false);
          }
        }
      );
    }
  }, [searchData]);

  useEffect(() => {
    // First try to get data from localStorage (for POST method)
    const storedData = localStorage.getItem('searchData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setSearchData(parsedData);
        localStorage.removeItem('searchData'); // Clean up after use
        setLoading(false);
        return;
      } catch (error) {
        console.error('Error parsing stored data:', error);
      }
    }
    
    // Fallback to URL parameters (for GET method)
    const urlParams = new URLSearchParams(window.location.search);
    const data: SearchData = {
      query: urlParams.get('query') || '',
      type: urlParams.get('type') || '',
      PaidSearch: urlParams.get('PaidSearch') || ''
    };
    
    setSearchData(data);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center bg-gradient-to-r from-teal-400 to-blue-500 bg-clip-text text-transparent">
          Basic Search Results
        </h1>
        
        {/* Streaming Progress */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-teal-400">Streaming Progress:</h2>
            <div className="text-white">
              {currentIndex} of {totalModules} modules loaded
              {isStreaming && <span className="ml-2 text-yellow-400 animate-pulse">Loading...</span>}
            </div>
          </div>
          <div className="bg-gray-800 rounded-full h-2 mb-4">
            <div 
              className="bg-gradient-to-r from-teal-400 to-blue-500 h-2 rounded-full transition-all duration-300"
              style={{ width: totalModules > 0 ? `${(currentIndex / totalModules) * 100}%` : '0%' }}
            ></div>
          </div>
        </div>

        {/* Live Module Display */}
        <div className="bg-gray-900 rounded-lg p-6 mb-8 max-h-96 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Live Module Feed:</h2>
          <div className="space-y-3">
            {modules.map((module, index) => (
              <div 
                key={index} 
                className="bg-gray-800 p-4 rounded-md border-l-4 border-teal-400 animate-fadeIn"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-bold">{module.module}</span>
                  <span className={`px-2 py-1 rounded text-xs ${
                    module.status === 'found' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
                  }`}>
                    {module.status}
                  </span>
                </div>
                <div className="text-gray-300 text-sm">
                  <span className="text-teal-300">{module.category.name}</span> - {module.category.description}
                </div>
                {Object.keys(module.data).length > 0 && (
                  <div className="text-xs text-gray-400 mt-2">
                    Data found: {Object.keys(module.data).length} fields
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="bg-gray-900 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Received Search Parameters:</h2>
          <div className="space-y-3">
            <div className="bg-gray-800 p-4 rounded-md">
              <span className="text-gray-400 font-medium">Query:</span>
              <span className="ml-3 text-white font-mono bg-gray-700 px-2 py-1 rounded">
                {searchData?.query || 'No query provided'}
              </span>
            </div>
            <div className="bg-gray-800 p-4 rounded-md">
              <span className="text-gray-400 font-medium">Search Type:</span>
              <span className="ml-3 text-white font-mono bg-gray-700 px-2 py-1 rounded">
                {searchData?.type || 'No type provided'}
              </span>
            </div>
            <div className="bg-gray-800 p-4 rounded-md">
              <span className="text-gray-400 font-medium">Paid Search:</span>
              <span className="ml-3 text-white font-mono bg-gray-700 px-2 py-1 rounded">
                {searchData?.PaidSearch || 'No paid search type provided'}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4 text-teal-400">Raw Data (JSON):</h2>
          <pre className="bg-gray-800 p-4 rounded-md text-green-400 font-mono text-sm overflow-x-auto">
            {JSON.stringify(searchData, null, 2)}
          </pre>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => window.close()}
            className="bg-gradient-to-r from-gray-700 to-gray-900 text-white px-6 py-3 rounded-lg hover:from-gray-600 hover:to-gray-800 transition-all duration-300"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
}
