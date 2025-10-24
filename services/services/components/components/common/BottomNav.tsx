import React from 'react';
import type { UserScreen } from '../../types';

interface BottomNavProps {
  screen: UserScreen;
  setScreen: (screen: UserScreen) => void;
  t: { [key: string]: string };
}

const NavItem: React.FC<{ icon: string; label: string; isActive: boolean; onClick: () => void }> = ({ icon, label, isActive, onClick }) => (
  <button 
    onClick={onClick} 
    className={`flex flex-col items-center justify-center text-xs font-bold transition-colors duration-200 flex-1 min-w-0 py-1 ${isActive ? 'text-blue-600' : 'text-gray-500 hover:text-blue-500'}`}
  >
    <span className={`text-2xl transition-transform duration-200 mb-0.5 ${isActive ? 'scale-110' : ''}`}>{icon}</span>
    <span className="leading-tight truncate">{label}</span>
  </button>
);

const BottomNav: React.FC<BottomNavProps> = ({ screen, setScreen, t }) => {
  const navItems = [
    { id: 'home', icon: '🏠', label: t.home },
    { id: 'fav', icon: '❤️', label: t.favorites },
    { id: 'add', icon: '➕', label: t.add },
    { id: 'assistant', icon: '🤖', label: t.assistant },
    { id: 'myPrompts', icon: '👤', label: t.my_prompts },
    { id: 'settings', icon: '⚙️', label: t.settings },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm border-t shadow-lg z-50">
      <div className="max-w-6xl mx-auto flex justify-around">
        {navItems.map(item => (
          <NavItem 
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={screen === item.id}
            onClick={() => setScreen(item.id as UserScreen)}
          />
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
