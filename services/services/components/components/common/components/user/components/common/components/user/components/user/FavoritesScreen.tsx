import React from 'react';
import PromptCard from '../common/PromptCard';
import type { Prompt, UserScreen } from '../../types';

interface FavoritesScreenProps {
  favPrompts: Prompt[];
  setScreen: (screen: UserScreen) => void;
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onRateClick: (prompt: Prompt) => void;
  t: { [key: string]: string };
}

const FavoritesScreen: React.FC<FavoritesScreenProps> = ({ favPrompts, setScreen, favorites, onToggleFavorite, onRateClick, t }) => {
  return (
    <div>
      <div className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-red-500">❤️ {t.favorites}</h1>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-4">
        {favPrompts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">💔</p>
            <p className="text-gray-600">You haven't favorited any prompts yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {favPrompts.map(p => (
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
        )}
      </div>
    </div>
  );
};

export default FavoritesScreen;
