import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, setDoc, query, where } from 'firebase/firestore';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [followedUsers, setFollowedUsers] = useState([]);
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = await Promise.all(
          usersSnapshot.docs.map(async doc => {
            const userData = doc.data();
            const followingQuery = query(
              collection(db, 'following'),
              where('userId', '==', doc.id)
            );
            const followingSnapshot = await getDocs(followingQuery);
            return {
              id: doc.id,
              ...userData,
              followingCount: followingSnapshot.size
            };
          })
        );
        setUsers(usersList.filter(user => user.id !== currentUser.uid)); // Exclude current user

        // Fetch followed users
        const followedQuery = query(
          collection(db, 'following'),
          where('userId', '==', currentUser.uid)
        );
        const followedSnapshot = await getDocs(followedQuery);
        const followedList = followedSnapshot.docs.map(doc => doc.data().followingId);
        setFollowedUsers(followedList);
      } catch (error) {
        console.error('Error fetching users: ', error);
      }
    };

    fetchUsers();
  }, [currentUser]);

  return (
    <div className="max-w-xl mx-auto justify-between p-4 mt-12">
      {users.length > 0 ? (
        <ul>
          {users.map(user => (
            <li key={user.id} className="mb-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <div className="bg-gray-200 text-gray-700 rounded-full w-10 h-10 flex items-center justify-center mr-4">
                    {user.displayName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-gray-500 text-lg font-semibold">{user.displayName}</p>
                    <p className="text-gray-500 text-xs ml-1">
                      Following: {user.followingCount}
                    </p>
                  </div>
                </div>
              </div>
              <hr className="border-gray-300 mt-10" />
            </li>
          ))}
        </ul>
      ) : (
        <p>No users found.</p>
      )}
    </div>
  );
};

export default Users;
