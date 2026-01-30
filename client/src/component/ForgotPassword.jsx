import React, { useState } from 'react';
import { Mail, Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { sendOtpToUser, verifyOtpToUser } from '../services/sendOTP';
import { useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [currentStep, setCurrentStep] = useState('email'); // 'email' or 'otp'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0); // NEW

  const navigate = useNavigate();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);

    try {
      const response = await sendOtpToUser(email);
      if (response) {
        setSuccess('OTP sent to your email successfully!');
        setTimeout(() => {
          setCurrentStep('otp');
          setSuccess('');
        }, 1500);

        // Start cooldown timer when first OTP is sent
        setResendCooldown(60);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } else {
        throw new Error('Failed to send OTP');
      }
    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      prevInput?.focus();
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    setLoading(true);

    try {
      const response = await verifyOtpToUser(email, otpString);

      if (response.status) {
        setSuccess('OTP verified successfully! Redirecting...');
        navigate('/reset-password');
      } else {
        throw new Error('Invalid OTP');
      }
    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setSuccess('');

    if (resendCooldown > 0) return; // Prevent spamming

    setLoading(true);

    try {
      const response = await sendOtpToUser(email);
      if (response.status) {
        setSuccess('OTP resent successfully!');
        setOtp(['', '', '', '', '', '']);

        // Start cooldown timer again
        setResendCooldown(60);
        const timer = setInterval(() => {
          setResendCooldown((prev) => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

      } else {
        throw new Error('Failed to resend OTP');
      }
    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">
            {currentStep === 'email' ? 'Forgot Password?' : 'Enter OTP'}
          </h2>
          <p className="text-gray-400">
            {currentStep === 'email'
              ? "No worries, we'll send you reset instructions."
              : `We've sent a 6-digit code to ${email}`}
          </p>
        </div>

        {/* Email Step */}
        {currentStep === 'email' && (
          <form onSubmit={handleEmailSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  placeholder="Enter your email"
                  disabled={loading}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-900/50 border border-green-500 rounded-lg p-3 flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-700 text-white py-3 cursor-pointer px-4 rounded-lg font-semibold hover:bg-emerald-600 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending OTP...
                </div>
              ) : (
                'Send Reset Instructions'
              )}
            </button>
          </form>
        )}

        {/* OTP Step */}
        {currentStep === 'otp' && (
          <form onSubmit={handleOtpSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Enter 6-digit OTP
              </label>
              <div className="flex justify-between space-x-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-12 text-center text-xl font-semibold bg-gray-700 border border-gray-600 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    maxLength={1}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {error && (
              <div className="bg-red-900/50 border border-red-500 rounded-lg p-3">
                <p className="text-red-300 text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-900/50 border border-green-500 rounded-lg p-3 flex items-center">
                <CheckCircle className="w-4 h-4 text-green-400 mr-2" />
                <p className="text-green-300 text-sm">{success}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-emerald-800 focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Verifying...
                </div>
              ) : (
                'Verify OTP'
              )}
            </button>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentStep('email')}
                className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to email
              </button>

              <button
                type="button"
                onClick={handleResendOtp}
                disabled={loading || resendCooldown > 0}
                className="text-blue-400 hover:text-blue-300 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resendCooldown > 0 ? `Resend OTP in ${resendCooldown}s` : 'Resend OTP'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
