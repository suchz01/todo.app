import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { loginUser, registerUser } from "@/lib/api";
import { useUser } from "@/context/UserContext";
import { useGoogleLogin } from "@react-oauth/google";
const Login = () => {
  const navigate = useNavigate();
  const { fetchUser } = useUser();
  const [isSignup, setIsSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    confirmPassword: "",
  });

  const validateForm = () => {
    if (!formData.email || !formData.password) {
      setError("Please fill all required fields");
      return false;
    }
    if (isSignup) {
      if (!formData.name) {
        setError("Name is required");
        return false;
      }
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!validateForm()) return;
    
    setLoading(true);
    try {
      const response = isSignup 
        ? await registerUser(formData.name, formData.email, formData.password)
        : await loginUser(formData.email, formData.password);
      
      // Store token
      localStorage.setItem('token', response.token);
      fetchUser(); 
      
      // Redirect to dashboard
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const handleChange=() => {
    setIsSignup((prev) => !prev);
    setError("");
    setFormData({
      email: "",
      password: "",
      name: "",
      confirmPassword: "",
    });
  }
  const googleLogin = useGoogleLogin({
    onSuccess: async (codeResponse) => {
      try {
        const response = await fetch('https://www.googleapis.com/oauth2/v1/userinfo', {
          headers: {
            Authorization: `Bearer ${codeResponse.access_token}`
          }
        });
        const profileData = await response.json();

        const backendResponse = await fetch(`${import.meta.env.VITE_BACKEND}/auth/google`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email: profileData.email,
            name: profileData.name,
            googleId: profileData.id
          })
        });
        if (!backendResponse.ok) {
          throw new Error('Failed to authenticate with backend');
        }
        const data = await backendResponse.json();
        localStorage.setItem('token', data.token);
        fetchUser();
        navigate('/dashboard');
      } catch (error) {
        console.error("Error during Google login:", error);
        setError("Failed to login with Google");
      }
    },
    onError: (error) => {
      console.error("Google Login Failed:", error);
      setError("Google login failed");
    }
  });

  return (
    <div className="mt-16 min-h-screen md:mt-0 p-20 flex flex-col justify-center items-center text-center px-4">
      <div className="p-8 rounded-lg shadow-lg border border-gray-700/50 bg-gradient-to-r from-sky-300/10 to-sky-500/10 hover:from-sky-300/20 hover:to-sky-500/20 transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-sky-500/20 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">{isSignup ? "Sign Up" : "Login"}</h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 text-red-200 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignup && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          )}
          
          <input
            type="email"
            placeholder="Email"
            className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
            >
              {showPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
            </button>
          </div>
          
          {isSignup && (
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="w-full p-3 rounded-lg bg-gray-800/50 border border-gray-700 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-300"
              >
                {showConfirmPassword ? <AiOutlineEyeInvisible size={20} /> : <AiOutlineEye size={20} />}
              </button>
            </div>
          )}
          
          <button
            type="submit"
            disabled={loading}
            className="cursor-pointer w-full p-3 rounded-lg bg-sky-500 hover:bg-sky-600 transition text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span>Loading...</span>
            ) : (
              <span>{isSignup ? "Sign Up" : "Login"}</span>
            )}
          </button>
        </form>
        
        <div className="mt-4">
          <button 
            onClick={() => googleLogin()} 
            className="w-full p-3 rounded-lg border border-gray-700 hover:bg-gray-800/50 transition flex items-center justify-center gap-2 cursor-pointer"
          >
            <FcGoogle size={20} />
            <span>Continue with Google</span>
          </button>
        </div>
        
        <p className="mt-4 text-gray-400">
          {isSignup ? "Already have an account?" : "Don't have an account?"}
          <button
            onClick={() => handleChange()}
            className="ml-2 text-sky-500 hover:text-sky-400 cursor-pointer"
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
