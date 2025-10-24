import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, addDoc, serverTimestamp, doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, query, orderBy, getDocs, where } from 'firebase/firestore';
import { User, onAuthStateChanged, signOut, updateProfile } from 'firebase/auth';
import { Star, X } from 'lucide-react';
import { db, auth } from '../../services/firebase';
import HomeScreen from './HomeScreen';
import FavoritesScreen from './FavoritesScreen';
import AddPromptScreen from './AddPromptScreen';
import SettingsScreen from './SettingsScreen';
import DetailScreen from './DetailScreen';
import MyPromptsScreen from './MyPromptsScreen';
import BottomNav from '../common/BottomNav';
import UserLoginScreen from './UserLoginScreen';
import UserProfileScreen from './UserProfileScreen';
import EditPromptScreen from './EditPromptScreen';
import AssistantScreen from './AssistantScreen';
import type { Prompt, Language, UserScreen } from '../../types';

// Rating Modal Component
interface RatingModalProps {
  prompt: Prompt;
  onClose: () => void;
  onRatePrompt: (promptId: string, rating: number) => void;
}

const RatingModal: React.FC<RatingModalProps> = ({ prompt, onClose, onRatePrompt }) => {
  const [userRating, setUserRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loadingRating, setLoadingRating] = useState(true);
  
  useEffect(() => {
    const fetchUserRating = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) {
        setLoadingRating(false);
        return;
      }
      try {
        const ratingDocRef = doc(db, 'prompts', prompt.id, 'ratings', currentUser.uid);
        const docSnap = await getDoc(ratingDocRef);
        if (docSnap.exists()) {
          setUserRating(docSnap.data().rating);
        }
      } catch (error) {
        console.error("Error fetching user rating:", error);
      } finally {
        setLoadingRating(false);
      }
    };

    fetchUserRating();
  }, [prompt.id]);
  
  const handleRatingClick = (newRating: number) => {
    setUserRating(newRating);
    onRatePrompt(prompt.id, newRating);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()} style={{ animation: 'fade-in-up 0.3s ease-out forwards' }}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Rate this Idea</h2>
        <p className="text-gray-600 mb-6 truncate">{prompt.title}</p>
        {loadingRating ? (
          <div className="h-12 flex items-center justify-center"><p className="text-sm text-gray-500">Loading your previous rating...</p></div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button key={star} onMouseEnter={() => setHoverRating(star)} onMouseLeave={() => setHoverRating(0)} onClick={() => handleRatingClick(star)} aria-label={`Rate ${star} stars`}>
                  <Star size={40} className={`cursor-pointer transition-all duration-150 transform hover:scale-110 ${(hoverRating || userRating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
            {userRating > 0 && <p className="text-sm text-gray-600 mt-4">Your rating: {userRating} star{userRating > 1 ? 's' : ''}</p>}
          </div>
        )}
      </div>
      <style>{`@keyframes fade-in-up { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
};

// Edit Profile Modal Component
interface EditProfileModalProps {
    user: User;
    onClose: () => void;
    onUpdateProfile: (displayName: string) => Promise<void>;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user, onClose, onUpdateProfile }) => {
    const [displayName, setDisplayName] = useState(user.displayName || '');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        await onUpdateProfile(displayName);
        setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative" onClick={(e) => e.stopPropagation()} style={{ animation: 'fade-in-up 0.3s ease-out forwards' }}>
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <X size={24} />
                </button>
                <h2 className="text-xl font-bold text-gray-800 mb-6">Edit Profile</h2>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="displayName">
                            Display Name
                        </label>
                        <input
                            id="displayName"
                            type="text"
                            value={displayName}
                            onChange={(e) => setDisplayName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:bg-gray-400">
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>
        </div>
    );
};

// Logout Confirmation Modal
const LogoutConfirmationModal: React.FC<{ onConfirm: () => void; onCancel: () => void; }> = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6 relative" style={{ animation: 'fade-in-up 0.3s ease-out forwards' }}>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Confirm Logout</h2>
        <p className="text-gray-600 mb-6">Are you sure you want to log out?</p>
        <div className="flex gap-4">
          <button onClick={onCancel} className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-bold hover:bg-gray-300 transition-colors">
            Cancel
          </button>
          <button onClick={onConfirm} className="flex-1 bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};


interface UserAppProps {
  lang: Language;
  setLang: (lang: Language) => void;
  t: { [key: string]: string };
}

const UserApp: React.FC<UserAppProps> = ({ lang, setLang, t }) => {
  const [screen, setScreen] = useState<UserScreen>('home');
  const [favorites, setFavorites] = useState<string[]>([]);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [myPrompts, setMyPrompts] = useState<Prompt[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [ratingModalPrompt, setRatingModalPrompt] = useState<Prompt | null>(null);
  const [isEditProfileModalOpen, setIsEditProfileModalOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setAuthLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const q = query(collection(db, 'prompts'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const promptsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      } as Prompt));
      setPrompts(promptsData);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching prompts: ", error);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      const userDocRef = doc(db, 'users', user.uid);
      const unsubFavorites = onSnapshot(userDocRef, (docSnap) => {
        if (docSnap.exists()) {
          setFavorites(docSnap.data().favorites || []);
        } else {
          setDoc(userDocRef, { email: user.email, favorites: [] });
          setFavorites([]);
        }
      });

      const myPromptsQuery = query(collection(db, 'prompts'), where('authorId', '==', user.uid));
      const unsubMyPrompts = onSnapshot(myPromptsQuery, (querySnapshot) => {
        const userPromptsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as Prompt));
        userPromptsData.sort((a, b) => {
            const dateA = a.createdAt?.toDate()?.getTime() || 0;
            const dateB = b.createdAt?.toDate()?.getTime() || 0;
            return dateB - dateA;
        });
        setMyPrompts(userPromptsData);
      }, (error) => {
          console.error("Error fetching user's prompts:", error);
          alert("Could not fetch your submitted prompts. Please check your connection.");
      });

      return () => {
        unsubFavorites();
        unsubMyPrompts();
      };
    } else {
      setFavorites([]);
      setMyPrompts([]);
    }
  }, [user]);

  const handleToggleFavorite = async (promptId: string) => {
    if (!user) return;
    const userDocRef = doc(db, 'users', user.uid);
    const isCurrentlyFavorite = favorites.includes(promptId);

    setFavorites(prevFavorites => isCurrentlyFavorite ? prevFavorites.filter(id => id !== promptId) : [...prevFavorites, promptId]);

    try {
      await updateDoc(userDocRef, { favorites: isCurrentlyFavorite ? arrayRemove(promptId) : arrayUnion(promptId) });
    } catch (error) {
      console.error("Error updating favorites:", error);
      setFavorites(prevFavorites => isCurrentlyFavorite ? [...prevFavorites, promptId] : prevFavorites.filter(id => id !== promptId));
      alert("Could not update favorites. Please try again.");
    }
  };

  const handleAddPrompt = async (newPrompt: Omit<Prompt, 'id' | 'rating' | 'approved' | 'author' | 'authorId'>) => {
    if (!user) {
      alert("You must be logged in to submit a prompt.");
      return;
    }
    try {
      await addDoc(collection(db, 'prompts'), {
        ...newPrompt,
        rating: 0,
        approved: true, // Automatically approved
        author: user.displayName || user.email || 'Anonymous',
        authorId: user.uid,
        createdAt: serverTimestamp(),
      });
      alert('Prompt submitted successfully!');
      setScreen('myPrompts');
    } catch (error) {
      console.error("Error adding prompt: ", error);
      alert('Failed to submit prompt. Please try again.');
    }
  };
  
  const handleUpdatePrompt = async (promptId: string, updatedData: Omit<Prompt, 'id' | 'rating' | 'approved' | 'author' | 'authorId'>) => {
    const promptRef = doc(db, 'prompts', promptId);
    try {
      await updateDoc(promptRef, {
        ...updatedData,
        approved: true, 
      });
      alert('Prompt updated successfully!');
      setScreen('myPrompts');
    } catch (error) {
      console.error("Error updating prompt:", error);
      alert("Failed to update prompt. Please try again.");
    }
  };

  const handleRatePrompt = async (promptId: string, newRating: number) => {
    if (!user) {
      alert("You must be logged in to rate a prompt.");
      return;
    }
    
    const ratingDocRef = doc(db, 'prompts', promptId, 'ratings', user.uid);
    const promptDocRef = doc(db, 'prompts', promptId);

    try {
      await setDoc(ratingDocRef, { rating: newRating });
      const ratingsCollectionRef = collection(db, 'prompts', promptId, 'ratings');
      const ratingsSnapshot = await getDocs(ratingsCollectionRef);
      const ratings = ratingsSnapshot.docs.map(doc => doc.data().rating as number);
      if (ratings.length > 0) {
        const averageRating = ratings.reduce((acc, r) => acc + r, 0) / ratings.length;
        await updateDoc(promptDocRef, { rating: parseFloat(averageRating.toFixed(1)) });
      }
    } catch (error) {
      console.error("Error rating prompt:", error);
      alert("Could not submit your rating. Please try again.");
    }
  };

  const handleUpdateProfile = async (displayName: string) => {
    if (!auth.currentUser) {
        alert("You are not logged in.");
        return;
    }
    try {
        await updateProfile(auth.currentUser, { displayName });
        setUser({ ...auth.currentUser });
        alert("Profile updated successfully!");
        setIsEditProfileModalOpen(false);
    } catch (error) {
        console.error("Error updating profile: ", error);
        alert("Failed to update profile. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsLogoutModalOpen(true);
  };
  
  const handleConfirmLogout = async () => {
    await signOut(auth);
    setIsLogoutModalOpen(false);
  };

  const handleOpenRatingModal = (prompt: Prompt) => setRatingModalPrompt(prompt);
  const handleCloseRatingModal = () => setRatingModalPrompt(null);
  const handleOpenEditProfileModal = () => setIsEditProfileModalOpen(true);

  if (authLoading) {
    return <div className="min-h-screen flex items-center justify-center">Authenticating...</div>;
  }
  
  if (!user) {
    return <UserLoginScreen />;
  }

  const renderScreen = () => {
    if (screen.startsWith('detail-')) {
      const id = screen.split('-')[1];
      const prompt = prompts.find(p => p.id === id);
      if (prompt) {
        return <DetailScreen prompt={prompt} setScreen={setScreen} t={t} onRatePrompt={handleRatePrompt} />;
      }
    }
    
    if (screen.startsWith('edit-')) {
      const id = screen.split('-')[1];
      const prompt = myPrompts.find(p => p.id === id);
      if (prompt) {
        return <EditPromptScreen prompt={prompt} onUpdatePrompt={handleUpdatePrompt} t={t} setScreen={setScreen} />;
      }
    }
    
    switch (screen) {
      case 'home':
        return <HomeScreen prompts={prompts} setScreen={setScreen} favorites={favorites} onToggleFavorite={handleToggleFavorite} onRateClick={handleOpenRatingModal} t={t} />;
      case 'fav':
        const favPrompts = prompts.filter(p => favorites.includes(p.id));
        return <FavoritesScreen favPrompts={favPrompts} setScreen={setScreen} favorites={favorites} onToggleFavorite={handleToggleFavorite} onRateClick={handleOpenRatingModal} t={t}/>;
      case 'add':
        return <AddPromptScreen onAddPrompt={handleAddPrompt} t={t} />;
      case 'assistant':
        return <AssistantScreen t={t} />;
      case 'myPrompts':
        return <MyPromptsScreen myPrompts={myPrompts} t={t} setScreen={setScreen} />;
      case 'settings':
        return <SettingsScreen user={user} handleLogout={handleLogout} lang={lang} setLang={setLang} setScreen={setScreen} t={t} />;
      case 'profile':
        return <UserProfileScreen 
                  user={user} 
                  myPromptsCount={myPrompts.length}
                  favoritesCount={favorites.length}
                  setScreen={setScreen}
                  onEditProfileClick={handleOpenEditProfileModal}
                  t={t} 
                />;
      default:
        return <HomeScreen prompts={prompts} setScreen={setScreen} favorites={favorites} onToggleFavorite={handleToggleFavorite} onRateClick={handleOpenRatingModal} t={t} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 font-sans">
        {ratingModalPrompt && <RatingModal prompt={ratingModalPrompt} onClose={handleCloseRatingModal} onRatePrompt={handleRatePrompt} />}
        {isEditProfileModalOpen && user && <EditProfileModal user={user} onClose={() => setIsEditProfileModalOpen(false)} onUpdateProfile={handleUpdateProfile} />}
        {isLogoutModalOpen && <LogoutConfirmationModal onConfirm={handleConfirmLogout} onCancel={() => setIsLogoutModalOpen(false)} />}

        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-sm shadow-md">
            <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between items-center">
                <h1 className="text-2xl font-bold text-blue-600">💡 Ideas</h1>
                <div className="flex gap-2 items-center">
                    <select value={lang} onChange={(e) => setLang(e.target.value as Language)} className="px-2 py-1 border rounded bg-transparent font-semibold">
                        <option value="en">EN</option>
                        <option value="hi">HI</option>
                    </select>
                    <button onClick={handleLogout} className="px-3 py-1 bg-red-500 text-white rounded-md font-bold text-sm hover:bg-red-600 transition">Logout</button>
                </div>
            </div>
        </div>
        <main className="pb-24">
            {loading ? <div className="text-center py-20">Loading prompts...</div> : renderScreen()}
        </main>
        <BottomNav screen={screen} setScreen={setScreen} t={t} />
    </div>
  );
};

export default UserApp;
