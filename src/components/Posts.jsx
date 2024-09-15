// src/components/Posts.js
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs, doc, getDoc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

const Posts = () => {
  const { currentUser } = useAuth();
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTweets = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const tweetsQuery = query(
          collection(db, 'tweets'),
          where('userId', '==', currentUser.uid),
          orderBy('timestamp', 'desc')
        );
        const tweetsSnapshot = await getDocs(tweetsQuery);
        const tweetsList = await Promise.all(
          tweetsSnapshot.docs.map(async (tweetDoc) => {
            const tweetData = tweetDoc.data();
            console.log(`Fetching user data for userId: ${tweetData.userId}`);
            const userDoc = await getDoc(doc(db, 'users', tweetData.userId));
            if (!userDoc.exists()) {
              console.log(`User not found for userId: ${tweetData.userId}`);
            }
            const userData = userDoc.exists() ? userDoc.data() : { displayName: 'Unknown User' };
            return { id: tweetDoc.id, ...tweetData, displayName: userData.displayName };
          })
        );
        setTweets(tweetsList);
      } catch (error) {
        setError('Error fetching tweets.');
        console.error('Error fetching tweets: ', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTweets();
  }, [currentUser]);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="p-4">
      
      {tweets.length > 0 ? (
        <ul>
          {tweets.map(tweet => (
            <li key={tweet.id} className="mb-6 p-4 flex items-start space-x-4">
              <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {tweet.displayName[0]} {/* Assuming first letter of displayName */}
                </div>
              <div className="flex-1 mt-2">
                <div className="flex justify-between">
                  <h1 className="text-black text-lg ml-1">{tweet.displayName}</h1>
                  <p className="text-gray-500 text-sm">{formatDistanceToNow(tweet.timestamp?.toDate())} ago</p>
                </div>
                <p className="text-gray-500 mt-2 mb-2">{tweet.text}</p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tweets found.</p>
      )}
    </div>
  );
};

export default Posts;
