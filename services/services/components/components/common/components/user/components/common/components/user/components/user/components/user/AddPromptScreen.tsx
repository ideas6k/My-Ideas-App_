import React, { useState } from 'react';
import { CATEGORIES } from '../../constants';
import type { Prompt } from '../../types';

interface AddPromptScreenProps {
  onAddPrompt: (newPrompt: Omit<Prompt, 'id' | 'rating' | 'approved' | 'author' | 'authorId'>) => void;
  t: { [key: string]: string };
}

const AddPromptScreen: React.FC<AddPromptScreenProps> = ({ onAddPrompt, t }) => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [text, setText] = useState('');
  const [image, setImage] = useState('💡');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !desc || !category || !text) {
      alert('Please fill all fields');
      return;
    }
    onAddPrompt({ title, desc, category, text, image });
  };

  return (
    <div>
      <div className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-green-500">➕ Submit Prompt</h1>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-4">
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div>
            <label htmlFor="title" className="font-semibold text-sm text-gray-700">Title</label>
            <input id="title" type="text" placeholder="e.g., React Weather App" value={title} onChange={e => setTitle(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
          </div>
          <div>
            <label htmlFor="desc" className="font-semibold text-sm text-gray-700">Short Description</label>
            <textarea id="desc" placeholder="e.g., A simple app to display weather." value={desc} onChange={e => setDesc(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={2} required></textarea>
          </div>
          <div className="flex gap-4">
            <div className="flex-grow">
              <label htmlFor="category" className="font-semibold text-sm text-gray-700">Category</label>
              <select id="category" value={category} onChange={e => setCategory(e.target.value)} className="w-full mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
              </select>
            </div>
            <div>
               <label htmlFor="image" className="font-semibold text-sm text-gray-700">Icon</label>
               <input id="image" type="text" value={image} onChange={e => setImage(e.target.value)} className="w-20 text-center mt-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" maxLength={2} />
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <label htmlFor="text" className="font-semibold text-sm text-gray-700">Prompt Text</label>
            </div>
            <textarea id="text" placeholder="The full text of your prompt..." value={text} onChange={e => setText(e.target.value)} className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" rows={6} required></textarea>
          </div>
          <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg font-bold hover:bg-green-700 transition-colors disabled:bg-gray-400">
            {t.submit}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPromptScreen;
