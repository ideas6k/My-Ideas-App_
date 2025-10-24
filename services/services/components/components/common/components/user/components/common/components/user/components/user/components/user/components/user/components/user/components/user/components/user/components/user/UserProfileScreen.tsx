import React, { useState } from 'react';
import { User } from 'firebase/auth';
import type { UserScreen } from '../../types';
import { ChevronLeft, Mail, Calendar, FileText, Heart, Edit, Share2, Copy } from 'lucide-react';
import AchievementBadge from './AchievementBadge';

interface UserProfileScreenProps {
  user: User;
  myPromptsCount: number;
  favoritesCount: number;
  setScreen: (screen: UserScreen) => void;
  onEditProfileClick: () => void;
  t: { [key: string]: string };
}

const StatCard: React.FC<{ icon: React.ReactNode; label: string; value: number }> = ({ icon, label, value }) => (
  <div className="bg-gray-100/50 rounded-lg p-4 flex items-center gap-4">
    <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
      {icon}
    </div>
    <div>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
      <p className="text-sm text-gray-500">{label}</p>
    </div>
  </div>
);

const UserProfileScreen: React.FC<UserProfileScreenProps> = ({ user, myPromptsCount, favoritesCount, setScreen, onEditProfileClick, t }) => {
  const [copied, setCopied] = useState(false);
  
  const creationDate = user.metadata.creationTime
    ? new Date(user.metadata.creationTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'N/A';
    
  const referralLink = `${window.location.origin}${window.location.pathname}?ref=${user.uid}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const displayName = user.displayName || user.email;

  const achievements = [
    {
      icon: '🌱',
      name: 'First Steps',
      description: 'Submit your very first prompt!',
      unlocked: myPromptsCount >= 1,
    },
    {
      icon: '✍️',
      name: 'Contributor',
      description: 'Submit 5 prompts.',
      unlocked: myPromptsCount >= 5,
    },
    {
      icon: '🚀',
      name: 'Prolific',
      description: 'Submit 10 or more prompts.',
      unlocked: myPromptsCount >= 10,
    },
    {
      icon: '❤️',
      name: 'Curator',
      description: 'Favorite 5 prompts.',
      unlocked: favoritesCount >= 5,
    },
    {
      icon: '😍',
      name: 'Super Fan',
      description: 'Favorite 15 or more prompts.',
      unlocked: favoritesCount >= 15,
    },
     {
      icon: '👋',
      name: 'Joined!',
      description: 'Welcome to the community!',
      unlocked: true,
    },
  ];

  return (
    <div>
      <div className="bg-white shadow-md p-4 flex items-center gap-4">
        <button onClick={() => setScreen('settings')} className="text-gray-600 hover:text-blue-600">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-blue-600">My Profile</h1>
      </div>
      <div className="max-w-3xl mx-auto px-4 py-6">
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-4xl font-bold flex-shrink-0">
              {displayName ? displayName.charAt(0).toUpperCase() : '?'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800 break-words truncate">{displayName}</h2>
                <button onClick={onEditProfileClick} className="ml-4 flex-shrink-0 bg-gray-200 text-gray-700 p-2 rounded-full hover:bg-gray-300 transition-colors">
                    <Edit size={16} />
                </button>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-2">
                <Mail size={16} />
                <span className="text-sm truncate">{user.email}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-500 mt-1">
                <Calendar size={16} />
                <span className="text-sm">Member since {creationDate}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <StatCard icon={<FileText size={24} />} label="Prompts Submitted" value={myPromptsCount} />
          <StatCard icon={<Heart size={24} />} label="Favorites" value={favoritesCount} />
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🏆 Achievements</h3>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                {achievements.map(ach => (
                    <AchievementBadge 
                        key={ach.name}
                        icon={ach.icon}
                        name={ach.name}
                        description={ach.description}
                        unlocked={ach.unlocked}
                    />
                ))}
            </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-4">
                <Share2 className="text-purple-600" size={20} />
                <h3 className="text-lg font-bold text-gray-800">Refer a Friend</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">Share this link with your friends to invite them to the app!</p>
            <div className="flex gap-2 items-center bg-gray-100 rounded-lg p-2">
                <input type="text" readOnly value={referralLink} className="bg-transparent w-full text-sm text-gray-700 outline-none" />
                <button onClick={handleCopy} className={`px-4 py-2 rounded-md font-semibold text-sm transition-colors flex items-center gap-1.5 ${copied ? 'bg-green-600 text-white' : 'bg-purple-600 text-white hover:bg-purple-700'}`}>
                    <Copy size={14} />
                    {copied ? 'Copied!' : 'Copy'}
                </button>
            </div>
        </div>

      </div>
    </div>
  );
};

export default UserProfileScreen;
