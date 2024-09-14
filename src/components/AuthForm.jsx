import { useState } from 'react';

const AuthForm = ({ isLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const { currentUser } = useAuth();

  return (
    <div className="mt-8">
      {error && <p className="text-red-500">{error}</p>}
      <form id={isLogin ? "login-form" : "signup-form"}>
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
