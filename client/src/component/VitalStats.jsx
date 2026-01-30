import React, { useState, useRef, useEffect } from 'react';
import { X, Heart, Thermometer, Droplets, Activity } from 'lucide-react';
import { updateVitalsForUser } from '../services/patientServices';

export function VitalSignsForm({ appointment, onClose }) {
  const [formData, setFormData] = useState({
    heartRate: '',
    bloodPressure: '',
    temperature: '',
    oxygenLevel: '',
  });

  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose(); // Close modal if clicked outside
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const id = appointment?.bookedBy?._id;


  const handleSubmit = async(e)=>{
    e.preventDefault();
    try {
      const response = await updateVitalsForUser(formData, id);
      if(response.success) {
        console.log('Vital signs updated successfully:', response);
      }
    } catch (error) {
      console.error('Error updating vital signs:', error);
    }
    onClose();
  }

  
 

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div
        ref={modalRef}
        className="bg-slate-900 p-8 rounded-xl w-[90%] md:w-[60%] lg:w-[40%] max-h-[90vh] overflow-hidden"
      >
        {/* Header with Close Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-white">Update Vital Signs</h2>
          <button
            onClick={onClose}
            className="text-slate-400 cursor-pointer hover:text-red-500 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 overflow-y-auto scrollbar-hide">
          {/* Heart Rate */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-200 font-medium">
              <Heart className="text-red-500" size={18} />
              Heart Rate
            </label>
            <input
              type="number"
              name="heartRate"
              value={formData.heartRate}
              onChange={handleInputChange}
              placeholder="72 bpm"
              className="w-full bg-slate-700 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />

          </div>

          {/* Blood Pressure */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-200 font-medium">
              <Droplets className="text-blue-500" size={18} />
              Blood Pressure
            </label>
            <input
              type="text"
              name="bloodPressure"
              value={formData.bloodPressure}
              onChange={handleInputChange}
              placeholder="120/80"
              className="w-full bg-slate-700 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />

          </div>

          {/* Temperature */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-200 font-medium">
              <Thermometer className="text-orange-500" size={18} />
              Temperature
            </label>
            <input
              type="number"
              step="0.1"
              name="temperature"
              value={formData.temperature}
              onChange={handleInputChange}
              placeholder="98.6"
              className="w-full bg-slate-700 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
            <span className="text-slate-400 text-sm">degrees Fahrenheit</span>
          </div>

          {/* Oxygen Level */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-slate-200 font-medium">
              <Activity className="text-green-500" size={18} />
              Oxygen Saturation %
            </label>
            <input
              type="number"
              name="oxygenLevel"
              value={formData.oxygenLevel}
              onChange={handleInputChange}
              placeholder="98"
              min="0"
              max="100"
              className="w-full bg-slate-700 text-white rounded-full px-4 py-3 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />

          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-emerald-700 text-white px-6 py-2 rounded-md hover:bg-emerald-900 cursor-pointer transition"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
