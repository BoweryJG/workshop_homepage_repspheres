import React, { createContext, useContext, useState, useEffect } from 'react';
import supabase from '../supabase';

// Create an authentication context
const AuthContext = createContext();

// Hook for easy access to the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Authentication provider component
export function AuthProvider({ children }) {
  // State for the current user
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to sign in with Google
  const signInWithGoogle = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
    }
  };

  // Function to sign in with Facebook
  const signInWithFacebook = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: window.location.origin,
        },
      });
      if (error) throw error;
    } catch (error) {
      console.error('Error signing in with Facebook:', error.message);
    }
  };

  // Function to sign out
  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Error signing out:', error.message);
    }
  };

  // Effect to set up auth state listener and handle initial session
  useEffect(() => {
    // Get the current session
    const initializeAuth = async () => {
      setLoading(true);
      
      // Check active session
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        setUser(currentUser);
      }
      
      // Set up auth state change listener
      const { data: authListener } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          if (session) {
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);
          } else {
            setUser(null);
          }
          setLoading(false);
        }
      );
      
      setLoading(false);
      
      // Clean up subscription on unmount
      return () => {
        if (authListener && authListener.subscription) {
          authListener.subscription.unsubscribe();
        }
      };
    };

    initializeAuth();
  }, []);

  // Values to provide through the context
  const value = {
    user,
    loading,
    signInWithGoogle,
    signInWithFacebook,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
