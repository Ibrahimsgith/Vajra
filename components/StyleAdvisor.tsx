
import React, { useState, useCallback } from 'react';
import { getStyleAdvice } from '../services/geminiService';
import { StyleAdvice } from '../types';
import { SparkleIcon } from './icons/SparkleIcon';

interface StyleAdvisorProps {
  onClose: () => void;
}

export const StyleAdvisor: React.FC<StyleAdvisorProps> = ({ onClose }) => {
  const [occasion, setOccasion] = useState('');
  const [advice, setAdvice] = useState<StyleAdvice | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetAdvice = useCallback(async () => {
    if (!occasion.trim()) {
      setError('Please enter an occasion.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const resultJson = await getStyleAdvice(occasion);
      const parsedAdvice = JSON.parse(resultJson);
      setAdvice(parsedAdvice);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, [occasion]);

  return (
    <div 
      className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 m-4 transform transition-all duration-300 relative"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
        <div className="text-center">
            <SparkleIcon className="w-10 h-10 mx-auto text-amber-800 mb-2" />
          <h2 className="text-2xl font-bold font-serif text-amber-900">AI Style Advisor</h2>
          <p className="text-gray-600 mt-2 mb-6">Describe an occasion, and I'll suggest the perfect piece of jewelry.</p>
        </div>

        <div className="space-y-4">
          <textarea
            value={occasion}
            onChange={(e) => setOccasion(e.target.value)}
            placeholder="e.g., A summer wedding in the countryside..."
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-700 transition-shadow"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={handleGetAdvice}
            className="w-full bg-amber-800 text-white font-bold py-3 px-4 rounded-lg hover:bg-amber-900 transition-colors disabled:bg-gray-400 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              'Get Advice'
            )}
          </button>
        </div>

        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
        
        {advice && (
          <div className="mt-6 p-5 border-t border-gray-200 animate-fade-in">
            <h3 className="text-lg font-semibold font-serif text-gray-800 mb-3">Your Personal Recommendation:</h3>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2 text-sm">
                <p><strong>Jewelry Type:</strong> {advice.jewelryType}</p>
                <p><strong>Metal:</strong> {advice.metal}</p>
                <p><strong>Gemstone:</strong> {advice.gemstone}</p>
                <p className="pt-2 italic text-gray-700">"{advice.styleDescription}"</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
