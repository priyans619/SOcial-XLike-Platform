import React from 'react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { } = useAuth();

  return (
    <nav className="bg-gray-50 border-b-0 shadow-md p-4 flex justify-between items-center">
      <div className="text-[#f07499] text-2xl font-bold ml-10">
        TweetX
      </div>
    </nav>
  );
};

export default Navbar;
