import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

const Followers = () => {
  const { currentUser } = useAuth();
  const [followers, setFollowers] = useState([]);

  useEffect(() => {
    const fetchFollowers = async () => {
      if (!currentUser) return;

      try {
        const followersQuery = query(
          collection(db, 'followers'),
          where('followingId', '==', currentUser.uid)
        );
        const followersSnapshot = await getDocs(followersQuery);
        const followersList = followersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFollowers(followersList);
      } catch (error) {
        console.error('Error fetching followers: ', error);
      }
    };

    fetchFollowers();
  }, [currentUser]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Followers</h2>
      {followers.length > 0 ? (
        <ul>
          {followers.map(follower => (
            <li key={follower.id} className="mb-4 p-4 border rounded">
              <p className="text-gray-800">{follower.displayName}</p>
              <p className="text-gray-500 text-sm">{follower.email}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No followers found.</p>
      )}
    </div>
  );
};

export default Followers;
