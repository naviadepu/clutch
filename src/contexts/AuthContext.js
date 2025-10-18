'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  sendEmailVerification,
  createUserWithEmailAndPassword
} from 'firebase/auth';
import { auth } from '@/lib/firebase';

const AuthContext = createContext({});

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Function to validate .edu email
  const isValidEduEmail = (email) => {
    const eduEmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.edu$/;
    return eduEmailRegex.test(email);
  };

  // Sign in function
  const signIn = async (email, password) => {
    if (!isValidEduEmail(email)) {
      throw new Error('Please use a valid .edu email address');
    }
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // Sign up function
  const signUp = async (email, password) => {
    if (!isValidEduEmail(email)) {
      throw new Error('Please use a valid .edu email address');
    }
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Send email verification
      await sendEmailVerification(userCredential.user);
      return userCredential;
    } catch (error) {
      throw error;
    }
  };

  // Sign out function
  const logOut = async () => {
    setUser(null);
    await signOut(auth);
  };

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, logOut, loading, isValidEduEmail }}>
      {loading ? (
        <div className="w-full h-screen bg-gradient-to-b from-black to-pink-900 flex flex-col items-center justify-center text-white">
          <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full mx-auto mb-6 flex items-center justify-center animate-pulse">
            <div className="text-white text-2xl font-bold">C</div>
          </div>
          <h1 className="text-xl font-bold mb-2">Loading...</h1>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
};
