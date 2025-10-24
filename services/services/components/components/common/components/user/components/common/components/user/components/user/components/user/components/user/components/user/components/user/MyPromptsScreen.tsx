import React from 'react';
import { Edit } from 'lucide-react';
import type { Prompt, UserScreen } from '../../types';

interface MyPromptsScreenProps {
  myPrompts: Prompt[];
  t: { [key: string]: string };
  setScreen: (screen: UserScreen) => void;
}

const MyPromptCard: React.FC<{ prompt: Prompt; onEdit: (id: string) => void }> = ({ prompt, onEdit }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex items-start gap-4 border-l-4 border-blue-500">
    <div className="text-4xl mt-1">{prompt.image}</div>
    <div className="flex-1">
      <div className="flex justify-between items-start">
        <h3 className="font-bold text-lg">{prompt.title}</h3>
        <button 
          onClick={() => onEdit(prompt.id)} 
          className="text-gray-500 p-2 rounded-full hover:bg-gray-200 hover:text-gray-800 transition-colors flex-shrink-0"
          aria-label="Edit prompt"
        >
          <Edit size={18} />
        </button>
      </div>
      <p className="text-sm text-gray-600 mt-1">{prompt.desc}</p>
    </div>
  </div>
);

const MyPromptsScreen: React.FC<MyPromptsScreenProps> = ({ myPrompts, t, setScreen }) => {
  return (
    <div>
      <div className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-blue-600">👤 {t.my_prompts} ({myPrompts.length})</h1>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-4">
        {myPrompts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-5xl mb-4">✍️</p>
            <p className="text-gray-600">You haven't submitted any prompts yet.</p>
            <p className="text-sm text-gray-500 mt-2">Click the 'Add' button below to share your first prompt!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {myPrompts.map(p => (
              <MyPromptCard key={p.id} prompt={p} onEdit={(id) => setScreen(`edit-${id}`)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyPromptsScreen;
