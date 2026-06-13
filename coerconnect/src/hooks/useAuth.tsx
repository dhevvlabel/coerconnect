import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  User 
} from 'firebase/auth';
import { auth, db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, getDoc, setDoc, getDocFromServer } from 'firebase/firestore';
import { UserProfile } from '../types';

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      try {
        if (authUser) {
          setUser(authUser);
          try {
            // Try fetching with a small timeout or just catch the "offline" error gracefully
            const userDocRef = doc(db, 'users', authUser.uid);
            const userDoc = await getDoc(userDocRef).catch(err => {
              if (err.message?.includes('offline')) {
                console.warn("Firestore is offline, using auth fallback");
                return null;
              }
              throw err;
            });

            if (userDoc?.exists()) {
              setProfile(userDoc.data() as UserProfile);
            } else {
              const newProfile: UserProfile = {
                uid: authUser.uid,
                displayName: authUser.displayName,
                photoURL: authUser.photoURL,
                email: authUser.email,
                createdAt: new Date().toISOString(),
              };
              
              // Only try to set if we have a chance
              try {
                await setDoc(userDocRef, newProfile);
                setProfile(newProfile);
              } catch (innerError) {
                // If it fails (e.g. offline or rules), we still set the local profile state
                setProfile(newProfile);
              }
            }
          } catch (error) {
            console.error("Auth profile fetch fatal error:", error);
          }
        } else {
          setUser(null);
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return unsubscribe;
  }, []);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error: any) {
      // Don't throw for common cancellation errors
      if (
        error.code === 'auth/cancelled-popup-request' ||
        error.code === 'auth/popup-closed-by-user'
      ) {
        console.log("Sign-in cancelled or popup closed.");
        return;
      }
      
      if (error.code === 'auth/unauthorized-domain') {
        const domain = window.location.hostname;
        alert(`Domain "${domain}" is not authorized for sign-in. \n\nTo fix this:\n1. Go to Firebase Console\n2. Authentication > Settings > Authorized domains\n3. Add "${domain}" to the list.`);
      } else {
        console.error("Sign-in error:", error);
        alert(`Authentication error: ${error.message}`);
      }
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
