import React, { useState } from 'react';
import { Heart, Star } from 'lucide-react';
import type { Prompt, UserScreen } from '../../types';

interface PromptCardProps {
  prompt: Prompt;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onView: (screen: UserScreen) => void;
  onRateClick: (prompt: Prompt) => void;
  t: { [key: string]: string };
}

const StarDisplay: React.FC<{ rating: number }> = ({ rating }) => {
  const roundedRating = Math.round(rating);
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star 
          key={i} 
          size={14} 
          className={i < roundedRating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"} 
        />
      ))}
      <span className="text-xs font-bold text-gray-600 ml-1">{rating.toFixed(1)}</span>
    </div>
  );
};


const PromptCard: React.FC<PromptCardProps> = ({ prompt, isFavorite, onToggleFavorite, onView, onRateClick, t }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-4 flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
      <div className="text-4xl mb-2">{prompt.image}</div>
      <h3 className="font-bold text-md mb-1 truncate">{prompt.title}</h3>
      <p className="text-xs text-gray-600 mb-3 flex-grow">{prompt.desc}</p>
      <div className="flex justify-between items-center mb-3">
        <button onClick={() => onRateClick(prompt)} className="p-1 rounded-full hover:bg-yellow-50">
          <StarDisplay rating={prompt.rating} />
        </button>
        <button onClick={() => onToggleFavorite(prompt.id)} className="p-1 rounded-full hover:bg-red-100 active:scale-90 transition-transform duration-150">
          <Heart size={16} className={`transition-all duration-300 transform ${isFavorite ? 'text-red-500 fill-red-500 scale-110' : 'text-gray-400'}`} />
        </button>
      </div>
      <div className="flex gap-2">
        <button 
          onClick={handleCopy} 
          className="flex-1 bg-blue-500 text-white text-xs py-2 rounded-lg font-bold hover:bg-blue-600 transition-colors"
        >
          {copied ? t.copied : t.copy}
        </button>
        <button 
          onClick={() => onView(`detail-${prompt.id}`)} 
          className="flex-1 bg-purple-500 text-white text-xs py-2 rounded-lg font-bold hover:bg-purple-600 transition-colors"
        >
          View
        </button>
      </div>
    </div>
  );
};

export default PromptCard;
