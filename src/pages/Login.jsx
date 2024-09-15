import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Login = () => {
  return (
    <div className="min-h-screen flex items-start justify-center">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-50 border-2 border-r-2 rounded-lg mt-14">
        <div>
          <h1 className="text-3xl font-bold text-left text-[#f07499]">TweetX</h1>
          <Link to="/signup" className="mt-8 inline-block font-medium text-black py-2 px-8 border border-black rounded-xl">
            Create Account
          </Link>
          <h2 className="text-2xl font-bold mt-16">Login</h2>
        </div>
        <AuthForm isLogin={true} />
        <div className="flex items-center justify-between mt-6">
          <Link to="/forgot-password" className="text-sm text-black-500 hover:underline">
            Forgot password?
          </Link>
          <button type="submit" form="login-form" className="bg-[#f07499] text-white py-1 px-8 rounded">
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;

