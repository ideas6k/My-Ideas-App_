import React, { useState, useEffect } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from './services/firebase';
import UserApp from './components/user/UserApp';
import AdminApp from './components/admin/AdminApp';
import UserLoginScreen from './components/user/UserLoginScreen';
import { TRANSLATIONS, ADMIN_UIDS } from './constants';
import type { Language } from './types';

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [lang, setLang] = useState<Language>('en');
  const t = TRANSLATIONS[lang];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(ADMIN_UIDS.includes(currentUser.uid));
      } else {
        setIsAdmin(false);
      }
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Authenticating...</p>
      </div>
    );
  }

  if (!user) {
    return <UserLoginScreen />;
  }

  if (isAdmin) {
    return <AdminApp lang={lang} setLang={setLang} t={t} />;
  } else {
    return <UserApp lang={lang} setLang={setLang} t={t} />;
  }
}
