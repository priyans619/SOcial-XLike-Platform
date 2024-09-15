import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Posts from '../components/Posts';
import Followers from '../components/Followers';
import Following from '../components/Following';

const Profile = ({ postCount, fetchCounts }) => {
  const { currentUser } = useAuth();
  const [activeTab, setActiveTab] = useState('posts');
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  useEffect(() => {
    if (currentUser) {
      const fetchFollowerAndFollowingCounts = async () => {
        // Fetch followers count
        const followersQuery = query(collection(db, 'followers'), where('followingId', '==', currentUser.uid));
        const followersSnapshot = await getDocs(followersQuery);
        setFollowerCount(followersSnapshot.size);

        // Fetch following count
        const followingQuery = query(collection(db, 'following'), where('userId', '==', currentUser.uid));
        const followingSnapshot = await getDocs(followingQuery);
        setFollowingCount(followingSnapshot.size);
      };

      fetchCounts();  // Fetch post count
      fetchFollowerAndFollowingCounts(); // Fetch followers and following count
    }
  }, [currentUser, fetchCounts]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <div className="flex items-center mt-4">
        {currentUser?.photoURL ? (
          <img src={currentUser.photoURL} alt="Profile" className="w-24 h-24 rounded-full mr-4" />
        ) : (
          <div className="w-20 h-20 rounded-full mr-4 bg-gray-300 flex items-center justify-center">
            <span className="text-white">No Image</span>
          </div>
        )}
        <h1 className="text-2xl text-gray-500 font-semibold ml-12 mt-4 ">{currentUser?.displayName || 'User'}</h1>
      </div>

      <div className="flex justify-center space-x-8 ml-8 text-gray-500">
        <div className="text-center">
          <span className="">Posts:</span>
          <span className="ml-1">{postCount}</span>
        </div>
        <div className="text-center">
          <span className="">Followers:</span>
          <span className="ml-1">{followerCount}</span>
        </div>
        <div className="text-center">
          <span className="">Following:</span>
          <span className="ml-1">{followingCount}</span>
        </div>
      </div>

      <div className="relative mt-12">
        <div className="absolute inset-x-0 top-0 h-0.5 bg-gray-200"></div>
        <nav className="flex justify-center gap-16">
          <button
            onClick={() => setActiveTab('posts')}
            className={`relative py-2 px-2 focus:outline-none ${activeTab === 'posts' ? 'text-gray-600' : 'text-gray-400'
              }`}
          >
            {activeTab === 'posts' && (
              <div className="absolute inset-x-0 -top-0.5 h-0.5 bg-gray-500"></div>
            )}
            Posts
          </button>
          <button
            onClick={() => setActiveTab('followers')}
            className={`relative py-2 px-2 focus:outline-none ${activeTab === 'followers' ? 'text-gray-600' : 'text-gray-400'
              }`}
          >
            {activeTab === 'followers' && (
              <div className="absolute inset-x-0 -top-0.5 h-0.5 bg-gray-500"></div>
            )}
            Followers
          </button>
          <button
            onClick={() => setActiveTab('following')}
            className={`relative py-2 px-2 focus:outline-none ${activeTab === 'following' ? 'text-gray-600' : 'text-gray-400'
              }`}
          >
            {activeTab === 'following' && (
              <div className="absolute inset-x-0 -top-0.5 h-0.5 bg-gray-500"></div>
            )}
            Following
          </button>
        </nav>
      </div>

      <div className="mt-4">
        {activeTab === 'posts' && <Posts />}
        {activeTab === 'followers' && <Followers />}
        {activeTab === 'following' && <Following />}
      </div>
    </div>
  );
};

export default Profile;
