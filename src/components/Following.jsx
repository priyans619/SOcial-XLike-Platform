import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

const Following = () => {
  const { currentUser } = useAuth();
  const [following, setFollowing] = useState([]);

  useEffect(() => {
    const fetchFollowing = async () => {
      if (!currentUser) return;

      try {
        // Query to get all documents where the current user is the one following
        const followingQuery = query(
          collection(db, 'following'),
          where('userId', '==', currentUser.uid)
        );
        const followingSnapshot = await getDocs(followingQuery);

        // Extract user IDs from the following documents
        const followingUserIds = followingSnapshot.docs.map(doc => doc.data().followingId);

        // Fetch user details and follower count for each following user
        const userPromises = followingUserIds.map(async (userId) => {
          const userDoc = await getDoc(doc(db, 'users', userId));
          if (userDoc.exists()) {
            // Fetch follower count
            const followersQuery = query(
              collection(db, 'following'),
              where('followingId', '==', userId)
            );
            const followersSnapshot = await getDocs(followersQuery);
            const followerCount = followersSnapshot.size;

            return { id: userDoc.id, ...userDoc.data(), followerCount };
          }
          return null;
        });

        // Filter out null results and set state
        const users = (await Promise.all(userPromises)).filter(user => user !== null);
        setFollowing(users);

      } catch (error) {
        console.error('Error fetching following: ', error);
      }
    };

    fetchFollowing();
  }, [currentUser]);

  return (
    <div className="p-4">
      {following.length > 0 ? (
        <ul>
          {following.map(follow => (
            <li key={follow.id} className="mb-4 p-4 flex items-center justify-between space-x-4">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-white text-lg font-bold">
                  {follow.displayName[0]} {/* first letter of displayName */}
                </div>
                <div>
                  <p className="text-gray-800 text-lg">{follow.displayName}</p>
                  <p className="text-gray-500 text-xs ml-1">Following: {follow.followerCount}</p>
                </div>
              </div>
              <p className="text-gray-800 text-sm font-medium">Following</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No following found.</p>
      )}
    </div>
  );
};

export default Following;
