import React, { useState } from 'react';
import {
  User,
  MapPin,
  Save,
  AlertCircle,
  CheckCircle,
  Phone,
  ShieldCheck,
} from 'lucide-react';
import { registerHospital } from '../services/hospitalsServices';
import { useNavigate } from 'react-router-dom';

 // 🔁 Make sure this service exists

const HospitalRegistration = ({ onRegistered = () => {} }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    licenseNumber: '',
    latitude: '',
    longitude: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [locationActive, setLocationActive] = useState(false);


  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLocationClick = () => {
    setLocationActive(prev => !prev);
    handleUseLocation();
  };

  const handleUseLocation = () => {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const { latitude, longitude } = pos.coords;
      setFormData((prev) => ({ ...prev, latitude, longitude }));
    },
    (err) => {
      console.error("Geolocation error:", err);
      if (err.code === 1) alert("Permission denied. Please allow location access.");
      else if (err.code === 2) alert("Location unavailable. Please check your connection or try again.");
      else if (err.code === 3) alert("Location request timed out.");
    }
  );
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, phone, address, licenseNumber, latitude, longitude } = formData;

    if (!name || !phone || !address || !licenseNumber || !latitude || !longitude) {
      setMessage("All required fields must be filled.");
      setMessageType("error");
      return;
    }

    const coordinates = [parseFloat(longitude), parseFloat(latitude)];

    setLoading(true);
    setMessage('');

    try {
      const response = await registerHospital(formData);
      console.log(formData);
      if(response.success){
        navigate('/hospitalAdmin/dashboard')
      }

      setMessage(response.message || "Hospital registered successfully.");
      setMessageType("success");
      onRegistered();
    } catch (error) {
      setMessage(error?.error || "An unexpected error occurred.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-black text-white px-4">
      <div className="w-full max-w-2xl">
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl shadow-2xl p-7 border border-green-500/20 backdrop-blur-sm relative">
          
          {/* Location Icon */}
          <MapPin
            size={28}
            className={`absolute top-4 right-4 cursor-pointer transition-colors ${
              locationActive ? 'text-emerald-400' : 'text-gray-400 hover:text-gray-200'
            }`}
            onClick={handleLocationClick}
            title="Use My Current Location"
          />

          <div className="text-center mb-6">
            <div className="flex justify-center items-center gap-2 mb-1">
              <ShieldCheck className="w-8 h-8 text-cyan-400" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-green-400 bg-clip-text text-transparent">
                Hospital Registration
              </h2>
            </div>
            <p className="text-gray-400 mt-1">Complete your hospital profile to get started</p>
          </div>

          {/* Alert Message */}
          {message && (
            <div className={`flex items-center p-4 mb-4 rounded-xl text-sm font-medium border ${
              messageType === 'success'
                ? 'bg-green-900/30 text-green-200 border-green-500/50'
                : 'bg-red-900/30 text-red-200 border-red-500/50'
            }`}>
              {messageType === 'success' ? <CheckCircle className="w-5 h-5 mr-2" /> : <AlertCircle className="w-5 h-5 mr-2" />}
              {message}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="text-sm text-gray-300">Hospital Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter hospital name"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Phone Number</label>
              <input
                name="phone"
                type="tel"
                maxLength={10}
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter phone number"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows={2}
                className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Enter hospital address"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">License Number</label>
              <input
                name="licenseNumber"
                value={formData.licenseNumber}
                onChange={handleChange}
                className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="License Number"
              />
            </div>

            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="text-sm text-gray-300">Latitude</label>
                <input
                  name="latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-600"
                  placeholder="Latitude"
                />
              </div>
              <div className="w-1/2">
                <label className="text-sm text-gray-300">Longitude</label>
                <input
                  name="longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={handleChange}
                  className="w-full p-3 rounded-xl bg-gray-800/50 text-white border border-gray-600"
                  placeholder="Longitude"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 text-black ${
                loading
                  ? 'bg-gray-500/30 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-green-400 hover:scale-[1.02]'
              }`}
            >
              {loading ? 'Registering...' : (
                <div className="flex items-center justify-center">
                  <Save className="w-5 h-5 mr-2" />
                  Register Hospital
                </div>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HospitalRegistration;
