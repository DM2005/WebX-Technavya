import React, { useState } from 'react';
import { Lock, ArrowLeft, CheckCircle } from 'lucide-react';
import { sendOtpToRegisterUser, verifyOtpForRegisterUser } from '../services/sendOTP';
import { useNavigate } from "react-router-dom";
import { callAuthRegisterApi } from '../api/authServices';
import { toast } from 'sonner';

const VerifyUser = ({ formData }) => {


  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [resendCooldown, setResendCooldown] = useState(0);

  const navigate = useNavigate();

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
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
      const response = await verifyOtpForRegisterUser(formData.email, otpString);
      if (response.status) {
        setSuccess('OTP verified successfully! Redirecting...');
        try {

          const res = await callAuthRegisterApi(formData);
          if (res) {
            toast.message("Logged in successfully !!");
            if (res.user.role === 'hospitalAdmin') {
              navigate("/hospitalAdmin/dashboard");
            } else {
              navigate("/select-role");
            }
          } else {
            console.log("Not getting register details");
          }
        } catch (error) {
          console.log("Error in callAuthRegisterApi !!", error);
        }
      } else {
        throw new Error();
      }
    } catch {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await sendOtpToRegisterUser(email);
      if (response.status) {
        setSuccess('OTP resent successfully!');
        setOtp(['', '', '', '', '', '']);
        setResendCooldown(60);
        const timer = setInterval(() => {
          setResendCooldown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      } else {
        throw new Error();
      }
    } catch {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mb-4">
            <Lock className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Enter OTP</h2>
        </div>

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
              onClick={() => navigate(-1)}
              className="flex items-center text-gray-400 hover:text-white transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
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
      </div>
    </div>
  );
};

export default VerifyUser;


