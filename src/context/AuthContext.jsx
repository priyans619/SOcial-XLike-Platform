import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { auth, db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [postCount, setPostCount] = useState(0);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false); // Set loading to false once the user state is determined

      if (user) {
        await fetchCounts(user.uid);
      }
    });
    return unsubscribe;
  }, []);

  const fetchCounts = async () => {
    if (currentUser) {
      try {
        // Fetch posts count
        const postsQuery = query(collection(db, 'tweets'), where('userId', '==', currentUser.uid));
        const postsSnapshot = await getDocs(postsQuery);
        setPostCount(postsSnapshot.size);
  
        // Fetch followers count (if implemented similarly)
        const followersQuery = query(collection(db, 'followers'), where('userId', '==', currentUser.uid));
        const followersSnapshot = await getDocs(followersQuery);
        setFollowerCount(followersSnapshot.size);
  
        // Fetch following count (if implemented similarly)
        const followingQuery = query(collection(db, 'following'), where('userId', '==', currentUser.uid));
        const followingSnapshot = await getDocs(followingQuery);
        setFollowingCount(followingSnapshot.size);
      } catch (error) {
        console.error('Error fetching counts: ', error);
      }
    }
  };
  

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    postCount,
    followerCount,
    followingCount,
    fetchCounts,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
