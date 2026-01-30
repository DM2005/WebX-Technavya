
import axios from 'axios';
const baseUrl = import.meta.env.VITE_API_URL;
export const sendOtpToUser = async (email) => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/send-otp`, { email });
    return response.data;
  } catch (error) {
    throw new Error('Failed to send OTP');
  }
};

export const verifyOtpToUser = async (email, otp) => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/verify-otp`, { email, otp });
    return response.data;
  } catch (error) {
    throw new Error('Failed to verify OTP');
  }
}

export const resetPassword = async (email, newPassword) => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/reset-password`, { email, newPassword });
    return response.data;
  } catch (error) {
    throw new Error('Failed to reset password');
  }
}

export const verifyOtpForRegisterUser = async (email, otp) => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/verifyOtpForRegister`, { email, otp });
    return response.data;
  } catch (error) {
    throw new Error('Failed to verify OTP');
  }
}


export const sendOtpToRegisterUser = async (email) => {
  try {
    const response = await axios.post(`${baseUrl}/api/auth/sendOtpForRegister`, { email });
    return response.data;
  } catch (error) {
    throw new Error('Failed to send OTP');
  }
};



