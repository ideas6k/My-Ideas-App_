import React from 'react';

interface AchievementBadgeProps {
  icon: string;
  name: string;
  description: string;
  unlocked: boolean;
}

const AchievementBadge: React.FC<AchievementBadgeProps> = ({ icon, name, description, unlocked }) => {
  return (
    <div className={`relative group flex flex-col items-center text-center p-2 transition-all duration-300 ${unlocked ? 'opacity-100' : 'opacity-30 grayscale'}`}>
      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-2 transition-all duration-300 ${unlocked ? 'bg-gradient-to-br from-yellow-300 to-orange-400 shadow-lg' : 'bg-gray-200'}`}>
        {icon}
      </div>
      <p className="text-xs font-bold text-gray-700">{name}</p>
      <div className="absolute bottom-full mb-2 w-48 bg-gray-800 text-white text-xs rounded py-1 px-2 text-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10">
        {description}
        <svg className="absolute text-gray-800 h-2 w-full left-0 top-full" x="0px" y="0px" viewBox="0 0 255 255">
          <polygon className="fill-current" points="0,0 127.5,127.5 255,0"/>
        </svg>
      </div>
    </div>
  );
};

export default AchievementBadge;
