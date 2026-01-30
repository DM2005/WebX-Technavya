import React, { useState } from 'react';
import { Save, AlertCircle, CheckCircle, MapPin, IdCard, FlaskConical } from 'lucide-react';
import { updateLab } from '../services/labServices';

const testOptions = [
  "X-Ray",
  "Blood Test",
  "MRI",
  "CT Scan",
  "Ultrasound",
  "Urine Test",
  "ECG",
  "Cholesterol",
  "Diabetes",
  "Allergy",
];

const UpdateLabProfile = ({ labData}) => {
  const [formData, setFormData] = useState({
    address: labData?.address || "",
    licenseNumber: labData?.licenseNumber || "",
    testTypes: labData?.testTypes || [],
    // Location update will be optional
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTestTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      testTypes: prev.testTypes.includes(type)
        ? prev.testTypes.filter(t => t !== type)
        : [...prev.testTypes, type]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!formData.address || !formData.licenseNumber || formData.testTypes.length === 0) {
      setMessage("All required fields must be filled.");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      await updateLab(formData);
      setMessage("Lab profile updated successfully!");
      setMessageType("success");
    } catch (error) {
      setMessage(error?.error || "Failed to update lab profile.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-gray-900 rounded-xl border border-green-500/30">
      <h2 className="text-2xl text-white font-bold mb-4">Update Lab Profile 🧪</h2>

      {message && (
        <div className={`flex items-center p-4 mb-4 rounded-xl
          ${messageType === 'success' ? "bg-green-700/20 text-green-300" : "bg-red-700/20 text-red-300"}
        `}>
          {messageType === 'success' ? <CheckCircle className="mr-2" /> : <AlertCircle className="mr-2" />}
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Address Field */}
        <div className="space-y-1">
          <label className="text-gray-300 flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-green-400" />
            Address *
          </label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            placeholder="Enter lab address"
          />
        </div>

        {/* License Number */}
        <div className="space-y-1">
          <label className="text-gray-300 flex items-center">
            <IdCard className="w-4 h-4 mr-2 text-green-400" />
            License Number *
          </label>
          <input
            type="text"
            name="licenseNumber"
            value={formData.licenseNumber}
            onChange={handleInputChange}
            className="w-full p-2 rounded bg-gray-800 border border-gray-600 text-white"
            placeholder="Enter license number"
          />
        </div>

        {/* Test Types */}
        <div className="space-y-2">
          <label className="flex items-center text-gray-300">
            <FlaskConical className="w-4 h-4 mr-2 text-green-400" />
            Select Test Types Offered *
          </label>
          <div className="grid grid-cols-2 gap-2 text-white">
            {testOptions.map(test => (
              <label key={test} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.testTypes.includes(test)}
                  onChange={() => handleTestTypeChange(test)}
                  className="accent-green-500"
                />
                <span>{test}</span>
              </label>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded text-white font-semibold ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-green-600 hover:bg-green-500"
          }`}
        >
          {loading ? "Updating..." : "Update Lab Info"}
        </button>
      </form>
    </div>
  );
};

export default UpdateLabProfile;
