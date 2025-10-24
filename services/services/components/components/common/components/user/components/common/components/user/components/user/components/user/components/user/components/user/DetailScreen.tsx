import React, { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../services/firebase';
import type { Prompt, UserScreen } from '../../types';

interface DetailScreenProps {
  prompt: Prompt;
  setScreen: (screen: UserScreen) => void;
  t: { [key: string]: string };
  onRatePrompt: (promptId: string, rating: number) => void;
}

const DetailScreen: React.FC<DetailScreenProps> = ({ prompt, setScreen, t, onRatePrompt }) => {
  const [copied, setCopied] = useState(false);
  const [userRating, setUserRating] = useState(0);
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

  const handleCopy = () => {
    navigator.clipboard.writeText(prompt.text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  
  const StarRating: React.FC<{ rating: number; onRatingChange: (newRating: number) => void }> = ({ rating, onRatingChange }) => {
      const [hoverRating, setHoverRating] = useState(0);
      return (
        <div>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => onRatingChange(star)}
                aria-label={`Rate ${star} stars`}
              >
                <Star
                  size={32}
                  className={`cursor-pointer transition-colors ${
                    (hoverRating || rating) >= star ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                  }`}
                />
              </button>
            ))}
          </div>
          {rating > 0 && <p className="text-sm text-gray-600 mt-2">Your rating: {rating} star{rating > 1 ? 's' : ''}</p>}
        </div>
      );
    };

  return (
    <div className="max-w-3xl mx-auto px-4 py-4">
      <button 
        onClick={() => setScreen('home')} 
        className="mb-4 px-4 py-2 bg-gray-600 text-white rounded-lg font-bold hover:bg-gray-700 transition"
      >
        ← {t.back}
      </button>
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-6xl mb-4">{prompt.image}</div>
        <h1 className="text-2xl font-bold mb-2">{prompt.title}</h1>
        <p className="text-gray-600 mb-4">{prompt.desc}</p>
        <div className="p-4 bg-gray-100 rounded-lg mb-4 text-sm whitespace-pre-wrap font-mono">{prompt.text}</div>
        <div className="mb-4 text-sm text-gray-700 space-y-1">
          <p><strong>Rating:</strong> <span className="font-semibold bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full">⭐ {prompt.rating}</span></p>
          <p><strong>By:</strong> <span className="font-semibold">{prompt.author}</span></p>
        </div>
        <button 
          onClick={handleCopy} 
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition mb-6"
        >
          {copied ? `✓ ${t.copied}` : t.copy}
        </button>

        <div className="pt-6 border-t">
            <h3 className="font-bold text-lg mb-2">Rate this prompt</h3>
            {auth.currentUser ? (
              loadingRating ? <p className="text-sm text-gray-500">Loading your rating...</p> : 
              <StarRating 
                rating={userRating} 
                onRatingChange={(newRating) => {
                  setUserRating(newRating); // Optimistic update
                  onRatePrompt(prompt.id, newRating);
                }}
              />
            ) : (
              <p className="text-sm text-gray-500">You must be logged in to rate prompts.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default DetailScreen;
