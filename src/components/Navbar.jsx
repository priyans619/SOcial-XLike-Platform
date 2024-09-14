import React from 'react';
import { useAuth } from '../context/AuthContext';
import { NavLink } from 'react-router-dom';

const Navbar = () => {
  const { currentUser, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  return (
    <nav className="bg-gray-50 border-b-0 shadow-md p-4 flex justify-between items-center">
      <div className="text-[#f07499] text-2xl font-bold ml-10">
        TweetX
      </div>
      <div className="space-x-4 mr-12">
        <NavLink 
          to="/feed" 
          className={({ isActive }) => isActive ? "text-[#f07499]" : "text-black"}
        >
          Feed
        </NavLink>
        <NavLink 
          to="/users" 
          className={({ isActive }) => isActive ? "text-[#f07499]" : "text-black"}
        >
          Users
        </NavLink>
        <NavLink 
          to="/profile" 
          className={({ isActive }) => isActive ? "text-[#f07499]" : "text-black"}
        >
          Profile
        </NavLink>
        <button onClick={handleLogout} className="text-black">
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
