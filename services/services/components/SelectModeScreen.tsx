import React from 'react';
import type { Language, Mode } from '../types';
import { TRANSLATIONS } from '../constants';

interface SelectModeScreenProps {
  setMode: (mode: Mode) => void;
  lang: Language;
  setLang: (lang: Language) => void;
}

const SelectModeScreen: React.FC<SelectModeScreenProps> = ({ setMode, lang, setLang }) => {
  const t = TRANSLATIONS[lang];
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="text-center w-full max-w-md">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-8 drop-shadow-lg">💡 Ideas</h1>
        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => setMode('user')}
            className="bg-white/90 text-purple-700 font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-white transition-transform transform hover:scale-105"
          >
            {t.user_app}
          </button>
          <button
            onClick={() => setMode('admin')}
            className="bg-black/30 text-white font-bold text-lg py-4 px-6 rounded-xl shadow-lg hover:bg-black/40 transition-transform transform hover:scale-105"
          >
            {t.admin_panel}
          </button>
        </div>
        <div className="mt-8">
            <select value={lang} onChange={(e) => setLang(e.target.value as Language)} className="bg-transparent text-white border-2 border-white/50 rounded-lg px-3 py-1 font-semibold focus:outline-none focus:ring-2 focus:ring-white/80">
                <option value="en" style={{color: 'black'}}>English</option>
                <option value="hi" style={{color: 'black'}}>हिंदी</option>
            </select>
        </div>
      </div>
    </div>
  );
};

export default SelectModeScreen;
