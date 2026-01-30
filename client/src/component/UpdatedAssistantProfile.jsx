import React, { useState } from 'react';
import { User, Building2, UserPlus, CheckCircle, AlertCircle, Stethoscope, Save } from 'lucide-react';
import { updateAssistantProfile } from '../services/assistantServices';
import { toast } from 'sonner';


const AssistantForm = () => {
  const [formData, setFormData] = useState({
    doctorId: '',
    hospitalId: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async () => {
    if (!isFormValid) return;
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await updateAssistantProfile(formData);
      if(response?.success){
        toast.success("Profile Updated Successfully !!")
        console.log(response)

      }
    } catch (error) {
      setSubmitStatus('error');
      console.error('Error creating assistant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = formData.doctorId && formData.hospitalId;

  return (
    <div className=" flex items-center justify-center   ">
      <div className="w-full max-w-lg">
        {/* Main Card */}
        <div className="mt-12 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl shadow-2xl p-7 border border-green-500/20 backdrop-blur-sm">
          
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex justify-center items-center gap-2 mb-1">
              <UserPlus className="w-8 h-8 text-blue-400" />
              <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-green-300 bg-clip-text text-transparent">
                Create Assistant
              </h2>
            </div>
            <p className="text-gray-400 mt-2">Register a new assistant in the system</p>
          </div>

          {/* Message Display */}
          {submitStatus && (
            <div className={`flex items-center p-4 mb-6 rounded-xl border backdrop-blur-sm transition-all duration-300 ${
              submitStatus === 'success' 
                ? 'bg-green-900/30 text-green-200 border-green-500/50 shadow-green-500/20' 
                : 'bg-red-900/30 text-red-200 border-red-500/50 shadow-red-500/20'
            } shadow-lg`}>
              {submitStatus === 'success' ? (
                <CheckCircle className="w-5 h-5 mr-3 text-green-400" />
              ) : (
                <AlertCircle className="w-5 h-5 mr-3 text-red-400" />
              )}
              {submitStatus === 'success' 
                ? 'Assistant created successfully!' 
                : 'Failed to create assistant. Please try again.'}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            

            {/* Doctor ID Field */}
            <div className="group  mb-10">
              <label className="mb-4 flex items-center text-sm font-medium text-gray-300  group-hover:text-green-400 transition-colors">
                <Stethoscope className="w-4 h-4 mr-2 text-green-400" />
                Doctor ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="doctorId"
                  value={formData.doctorId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-green-500/30 backdrop-blur-sm"
                  placeholder="Enter doctor ID"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Hospital ID Field */}
            <div className="group">
              <label className="flex items-center text-sm font-medium text-gray-300 mb-4 group-hover:text-green-400 transition-colors">
                <Building2 className="w-4 h-4 mr-2 text-green-400" />
                Hospital ID
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="hospitalId"
                  value={formData.hospitalId}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 text-white placeholder-gray-400 transition-all duration-300 hover:border-green-500/30 backdrop-blur-sm"
                  placeholder="Enter hospital ID"
                  required
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              onClick={handleSubmit}
              disabled={!isFormValid || isSubmitting}
              className={`w-full mt-10 flex items-center justify-center py-3 px-6 rounded-xl font-semibold transition-all duration-300 shadow-lg ${
                isSubmitting || !isFormValid
                  ? 'bg-gray-600/50 cursor-not-allowed text-gray-400 border border-gray-600/50'
                  : 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-black border border-green-500/50 hover:shadow-green-500/25 hover:scale-[1.02] active:scale-[0.98]'
              } transform`}
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-400 mr-3"></div>
                  Creating Assistant...
                </div>
              ) : (
                <>
                  <Save className="w-5 h-5 mr-3" />
                  Create Assistant
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Assistant will be created with verification status set to false by default
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssistantForm;