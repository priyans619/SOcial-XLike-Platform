import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = ({ postCount}) => {
  const { currentUser } = useAuth();

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
    </div>
  );
};

export default Profile;
