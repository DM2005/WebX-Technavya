import { useState } from 'react';
import { Eye, EyeOff, User, Mail, Phone, Lock, Loader, ArrowRight, Loader2Icon } from 'lucide-react';
import { callAuthRegisterApi } from '../api/authServices';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_URL


const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'patient',
  });

  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({ name: '', email: '', phone: '', password: '', role: 'patient' });
  };

  async function callAuthLoginApi(email, password) {

    try {
      const response = await axios.post(
        `${baseUrl}/api/auth/login`,
        { email, password },
        { withCredentials: true }
      )

      return response?.data;

    } catch (error) {
      console.error("Login failed:", error)
      setErrorMessage(error?.response?.data?.message);
      console.log(error?.response?.data?.message);
    }
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      try {
        setIsLoading(true);
        const response = await callAuthRegisterApi(formData);
        if (response) {
          toast.success("Registered & Logged in successfully !!");
          if (response.user.role === 'hospitalAdmin') {
            navigate("/hospitalAdmin/dashboard");
          } else {
            navigate("/select-role");
          }
        }
      } catch (error) {
        console.error("Error in register User", error);
        setErrorMessage(error?.response?.data?.error || error?.response?.data?.message || "Registration failed");
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        setIsLoading(true);
        const response = await callAuthLoginApi(formData.email, formData.password);
        if (response) {
          navigate(`/${response.user.role}/dashboard`);
          toast.success("Logged in successfully !!");
        }
      } catch (error) {
        console.log("Error in callAuthLoginApi !!", error);
      } finally {
        setIsLoading(false);
      }
    }
  };






  return (
    <div className="flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-3xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl mb-4 shadow-lg">
            <User className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {isSignup ? 'Create Account' : 'Welcome Back'}
          </h2>
          <p className="text-gray-400 text-sm">
            {isSignup ? 'Join us and start your journey' : 'Sign in to continue your journey'}
          </p>
        </div>

        <div className="space-y-6">
          {isSignup && (
            <>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-300">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Enter your phone number"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                    required
                    maxLength={10}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Role</label>
                  <div className="relative">
                    <select
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      className="w-full pl-3 pr-4 py-3 bg-gray-80 rounded"
                    >
                      <option value="patient">Patient</option>
                      <option value="hospitalAdmin">Hospital</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

              </div>
            </>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-12 pr-12 py-3 bg-gray-800/50 border border-gray-700 rounded-xl text-white placeholder-gray-400 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-green-400 transition-colors"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {!isSignup && (
              <p className="text-sm text-gray-400">
                <button
                  type="button"
                  className="cursor-pointer"
                  onClick={() => navigate('/forgot-password')}
                >
                  forgot password?
                </button>
              </p>
            )}
          </div>
          <div className=' text-red-600 text-center'>
            {errorMessage}
          </div>

          <button
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="w-full cursor-pointer bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl hover:from-green-600 hover:to-emerald-700 focus:ring-4 focus:ring-green-500/20 transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center group disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader className="animate-spin w-5 h-5 mr-2" />
                Loading...
              </>
            ) : (
              <>
                {isSignup ? "Create Account" : "Sign In"}
                <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </div>

        <div className="mt-8 text-center">
          <p className="text-gray-400 text-sm">
            {isSignup ? 'Already have an account?' : "Don't have an account?"}
          </p>
          <button
            type="button"
            onClick={toggleMode}
            className="mt-2 text-green-400 font-semibold hover:text-green-300 transition-colors duration-200 relative group"
          >
            {isSignup ? 'Sign in here' : 'Create account'}
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-400 transition-all duration-200 group-hover:w-full"></span>
          </button>
        </div>

        <div className="mt-8 flex items-center">
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
          <div className="px-4">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          </div>
          <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-700 to-transparent"></div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
