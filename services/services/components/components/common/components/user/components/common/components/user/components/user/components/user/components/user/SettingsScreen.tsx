import React from 'react';
import { User } from 'firebase/auth';
import { ChevronRight } from 'lucide-react';
import type { Language, UserScreen } from '../../types';

interface SettingsScreenProps {
  user: User;
  handleLogout: () => void;
  lang: Language;
  setLang: (lang: Language) => void;
  setScreen: (screen: UserScreen) => void;
  t: { [key: string]: string };
}

const SettingsScreen: React.FC<SettingsScreenProps> = ({ user, handleLogout, lang, setLang, setScreen, t }) => {
  return (
    <div>
      <div className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold">⚙️ {t.settings}</h1>
      </div>
      <div className="max-w-2xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
          <div className="pb-4 border-b">
            <p className="text-sm text-gray-500">Logged in as</p>
            <p className="font-semibold text-gray-800 break-words">{user.email}</p>
          </div>

          <button onClick={() => setScreen('profile')} className="w-full text-left bg-gray-50 hover:bg-gray-100 p-4 rounded-lg flex justify-between items-center transition">
            <div>
              <p className="font-bold text-gray-800">My Profile</p>
              <p className="text-sm text-gray-500">View your stats and account info</p>
            </div>
            <ChevronRight size={20} className="text-gray-400" />
          </button>

          <div>
            <label className="font-bold text-gray-700">{t.language}</label>
            <select 
              value={lang} 
              onChange={(e) => setLang(e.target.value as Language)} 
              className="w-full px-4 py-2 border rounded-lg mt-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी</option>
            </select>
          </div>
          <button 
            onClick={handleLogout} 
            className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition"
          >
            {t.logout}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsScreen;
