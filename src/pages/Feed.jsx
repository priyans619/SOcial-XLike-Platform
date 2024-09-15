import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp, query, where, getDocs, orderBy, doc, getDoc } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

const Feed = ({ fetchCounts }) => {
  const [tweet, setTweet] = useState('');
  const [feed, setFeed] = useState([]);
  const [isWriting, setIsWriting] = useState(false); //to manage textarea visibility
  const { currentUser } = useAuth();

  const handlePost = async () => {
    if (tweet.trim() === '') return;

    try {
      await addDoc(collection(db, 'tweets'), {
        text: tweet,
        timestamp: serverTimestamp(),
        userId: currentUser.uid,
      });
      setTweet('');
      fetchCounts(); // Fetch counts after posting a tweet
      alert('Tweet posted');
      fetchFeed(); // Refresh the feed
      setIsWriting(false); // Hide the textarea after posting
    } catch (error) {
      console.error('Error posting tweet: ', error);
    }
  };

  const fetchFeed = async () => {
    if (!currentUser) return;

    try {
      // Fetch the list of users the current user is following
      const followingQuery = query(
        collection(db, 'following'),
        where('userId', '==', currentUser.uid)
      );
      const followingSnapshot = await getDocs(followingQuery);
      const followingList = followingSnapshot.docs.map(doc => doc.data().followingId);

      if (followingList.length === 0) {
        setFeed([]);
        return;
      }

      // Fetch tweets from the users the current user is following
      const tweetsQuery = query(
        collection(db, 'tweets'),
        where('userId', 'in', followingList),
        orderBy('timestamp', 'desc')
      );
      const tweetsSnapshot = await getDocs(tweetsQuery);
      const tweetsList = tweetsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      // Fetch user details for each tweet using the document ID
      const userDetailsPromises = tweetsList.map(async (tweet) => {
        const userDocRef = doc(db, 'users', tweet.userId);
        const userSnapshot = await getDoc(userDocRef);
        const userData = userSnapshot.data() || {};
        return { ...tweet, displayName: userData.displayName || 'Unknown' };
      });

      const tweetsWithUserDetails = await Promise.all(userDetailsPromises);

      setFeed(tweetsWithUserDetails);
    } catch (error) {
      console.error('Error fetching feed: ', error);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, [currentUser]);

  return (
    <div className="max-w-xl mx-auto p-4">
      <button
        onClick={() => setIsWriting(prev => !prev)} // Toggle the textarea visibility
        className="bg-[#f07499] text-white py-1 px-6 rounded mb-2"
      >
        Write
      </button>

      {isWriting && ( // Conditionally render the textarea and Post button
        <div className="">
          <textarea
            value={tweet}
            onChange={(e) => setTweet(e.target.value)}
            placeholder="What's happening?"
            className="w-full p-2 border border-gray-300 rounded mb-2"
          />
          <div className="flex justify-end">
            <button
              onClick={handlePost}
              className="bg-[#f07499] text-white py-1 px-6 rounded"
              disabled={tweet.trim() === ''}
            >
              Post
            </button>
          </div>
        </div>
      )}

      <div className="mt-2">
        {feed.length > 0 ? (
          <ul>
            {feed.map(post => (
              <li key={post.id} className="mb-4 p-4 border rounded-2xl bg-white flex items-start space-x-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {post.displayName[0]} {/* Assuming first letter of displayName */}
                </div>
                <div className="flex-1 mt-2">
                  <div className="flex justify-between">
                    <h1 className="text-black text-lg ml-1">{post.displayName}</h1>
                    <p className="text-gray-500 text-sm">{formatDistanceToNow(post.timestamp?.toDate())} ago</p>
                  </div>
                  <p className="text-gray-500 mt-2 mb-2">{post.text}</p>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No tweets found in your feed.</p>
        )}
      </div>
    </div>
  );
};

export default Feed;
