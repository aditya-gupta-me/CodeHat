import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../Firebase";

const AuthContext = createContext(null);

/**
 * Provides auth state to the entire app via React Context.
 * Subscribes to Firebase onAuthStateChanged once and shares user state
 * across all consumers. Also handles remember-me session persistence
 * and fetches Firestore user profile data (username).
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleSignOut = useCallback(async () => {
    sessionStorage.removeItem("sessionOnly");
    sessionStorage.removeItem("sessionStart");
    sessionStorage.removeItem("appInitialized");
    localStorage.removeItem("rememberMeData");
    await signOut(auth);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);

        // Fetch username from Firestore
        try {
          const docSnap = await getDoc(doc(db, "users", firebaseUser.uid));
          if (docSnap.exists()) {
            setUsername(docSnap.data().username || firebaseUser.email);
          } else {
            setUsername(firebaseUser.email);
          }
        } catch {
          setUsername(firebaseUser.email);
        }

        // Check remember-me expiry
        const rememberData = localStorage.getItem("rememberMeData");
        if (rememberData) {
          try {
            const { timestamp, rememberMe } = JSON.parse(rememberData);
            const fourteenDays = 14 * 24 * 60 * 60 * 1000;
            if (Date.now() - timestamp > fourteenDays || !rememberMe) {
              localStorage.removeItem("rememberMeData");
              await signOut(auth);
              return;
            }
          } catch {
            localStorage.removeItem("rememberMeData");
            await signOut(auth);
            return;
          }
        }
      } else {
        setUser(null);
        setUsername(null);
        sessionStorage.removeItem("sessionOnly");
      }

      setLoading(false);
    });

    // Detect fresh browser session
    const sessionStart = sessionStorage.getItem("sessionStart");
    const appInitialized = sessionStorage.getItem("appInitialized");
    if (!sessionStart && !appInitialized) {
      sessionStorage.setItem("sessionStart", Date.now().toString());
      sessionStorage.setItem("appInitialized", "true");
      const rememberData = localStorage.getItem("rememberMeData");
      if (!rememberData && auth.currentUser) {
        signOut(auth);
      }
    } else if (!appInitialized) {
      sessionStorage.setItem("appInitialized", "true");
    }

    return () => unsubscribe();
  }, []);

  const value = {
    user,
    username,
    loading,
    signOut: handleSignOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Hook to access auth state from any component.
 * Must be used within an AuthProvider.
 *
 * @returns {{ user: object|null, username: string|null, loading: boolean, signOut: () => Promise<void> }}
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
