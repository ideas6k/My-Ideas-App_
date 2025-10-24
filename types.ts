export interface Prompt {
  id: string;
  title: string;
  desc: string;
  category: string;
  text: string;
  rating: number;
  author: string;
  authorId?: string;
  image: string;
  approved: boolean;
  createdAt?: any; // To allow for Firestore ServerTimestamp
}

export type Language = 'en' | 'hi';
export type Mode = 'select' | 'user' | 'admin';
export type UserScreen = 'home' | 'fav' | 'add' | 'myPrompts' | 'settings' | 'profile' | 'assistant' | string; // string for detail view
export type AdminScreen = 'dashboard' | 'pending' | 'approved' | 'analytics' | 'add';

export interface Translations {
  [key: string]: {
    [key: string]: string;
  };
}
