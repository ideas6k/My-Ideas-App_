import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { CATEGORIES } from '../../constants';
import PromptCard from '../common/PromptCard';
import type { Prompt, UserScreen } from '../../types';

interface HomeScreenProps {
  prompts: Prompt[];
  setScreen: (screen: UserScreen) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onRateClick: (prompt: Prompt) => void;
  t: { [key: string]: string };
}

const HomeScreen: React.FC<HomeScreenProps> = ({ prompts, setScreen, favorites, onToggleFavorite, onRateClick, t }) => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  
  const filtered = prompts.filter(p => 
    (!category || p.category === category) && 
    (p.title.toLowerCase().includes(search.toLowerCase()) || p.desc.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-4">
      <div className="mb-4 relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search prompts..." 
          value={search} 
          onChange={(e) => setSearch(e.target.value)} 
          className="w-full pl-10 pr-4 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
        />
      </div>

      <div className="flex gap-2 mb-4 overflow-x-auto pb-2 -mx-4 px-4">
        <button 
          onClick={() => setCategory('')} 
          className={`px-4 py-2 rounded-full font-bold whitespace-nowrap text-sm transition-colors ${!category ? 'bg-blue-600 text-white shadow' : 'bg-white hover:bg-gray-200'}`}
        >
          All
        </button>
        {CATEGORIES.map(c => (
          <button 
            key={c} 
            onClick={() => setCategory(category === c ? '' : c)} 
            className={`px-4 py-2 rounded-full font-bold whitespace-nowrap text-sm transition-colors ${category === c ? 'bg-blue-600 text-white shadow' : 'bg-white hover:bg-gray-200'}`}
          >
            {c.charAt(0).toUpperCase() + c.slice(1)}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filtered.map(p => (
          <PromptCard 
            key={p.id}
            prompt={p}
            isFavorite={favorites.includes(p.id)}
            onToggleFavorite={onToggleFavorite}
            onView={setScreen}
            onRateClick={onRateClick}
            t={t}
          />
        ))}
      </div>
    </div>
  );
};

export default HomeScreen;
