import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { auth, db } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore'; 

const AuthForm = ({ isLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!isLogin && password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      }
      else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update user profile with display name
        await updateProfile(user, { displayName: name });

        // Add user information to Firestore
        await setDoc(doc(db, 'users', user.uid), {
          displayName: name,
          email: user.email,
        });

        alert("User created successfully");
      }
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <div className="mt-8">
      {error && <p className="text-red-500">{error}</p>}
      <form id={isLogin ? "login-form" : "signup-form"} onSubmit={handleSubmit}>
        <div className="rounded-md space-y-6">
          {!isLogin && (
            <div className="mb-4">
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded-none block w-full px-3 py-2 border bg-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          )}
          <div className="mb-4">
            <input
              id="email-address"
              name="email"
              type="email"
              required
              className="appearance-none rounded-none block w-full px-3 py-2 border bg-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-none block w-full px-3 py-2 border bg-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {!isLogin && (
            <div>
              <input
                id="confirm-password"
                name="confirmPassword"
                type="password"
                required
                className="appearance-none rounded-none block w-full px-3 py-2 border bg-gray-200 placeholder-gray-500 text-gray-900 focus:outline-none focus:z-10 sm:text-sm"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
          )}

        </div>
      </form>
    </div>
  );
};

export default AuthForm;
