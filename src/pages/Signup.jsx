import { Link } from 'react-router-dom';
import AuthForm from '../components/AuthForm';

const Signup = () => {
  return (
    <div className="min-h-screen flex items-start justify-start ml-10">
      <div className="w-full max-w-md p-8 space-y-8 bg-gray-50">
        <div>
          <h1 className="text-3xl font-bold text-left text-[#f07499]">TweetX</h1>
          <Link to="/login" className="mt-8 inline-block font-medium text-black py-2 px-16 border border-black rounded-xl">
            Login
          </Link>
          <h2 className="text-2xl font-bold mt-16">Create Account</h2>
        </div>
        <AuthForm isLogin={false} />
        <div className="flex items-center justify-between mt-6">
          <button type="submit" form="signup-form" className="bg-[#f07499] text-white py-1 px-8 rounded">
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
