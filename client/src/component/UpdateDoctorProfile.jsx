import React, { useState } from "react";
import { User, Stethoscope, Calendar, CreditCard, Building, GraduationCap } from "lucide-react";
import { doctorProfileApi } from "../services/doctorServices";
const UpdateDoctorProfile = ({ doctorDetails }) => {
  const [formData, setFormData] = useState({
    gender: "",
    specialization: "",
    experience: "",
    licenseNumber: "",
    hospitalId: "",
    education: "",
    userId : doctorDetails?._id
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setMessage(""); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log(formData)

      const response = await doctorProfileApi(formData)
      if(response){
        console.log("Doctor profile updated successfully !!", response);
        setMessage("Profile updated successfully!");
      }
    } catch (err) {
      console.log(err)
      setMessage("Error updating profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { name: "gender", label: "gender", type: "select", icon: User, required: true,
      options: ["", "male", "female", "other"] },
    { name: "specialization", label: "Specialization", type: "text", icon: Stethoscope, required: true },
    { name: "experience", label: "Experience (Years)", type: "number", icon: Calendar, min: 0, max: 60 },
    { name: "licenseNumber", label: "License Number", type: "text", icon: CreditCard, required: true },
    { name: "hospitalId", label: "Hospital ID", type: "text", icon: Building, required: true },
    { name: "education", label: "Education", type: "text", icon: GraduationCap },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-lg">Updating profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-600 to-blue-600 p-6 text-center">
            <h2 className="text-3xl font-bold text-white flex items-center justify-center gap-3">
              <Stethoscope className="w-8 h-8" />
              Update Your Profile
            </h2>
          </div>

          <div className="p-8">
            {/* Message */}
            {message && (
              <div className={`p-4 rounded-lg mb-6 ${
                message.includes("success") 
                  ? "bg-green-900 text-green-100 border border-green-700" 
                  : "bg-red-900 text-red-100 border border-red-700"
              }`}>
                {message}
              </div>
            )}

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map(field => {
                const Icon = field.icon;
                return (
                  <div key={field.name}>
                    <label className=" text-gray-200 font-medium mb-2 flex items-center gap-2">
                      <Icon className="w-5 h-5 text-gray-400" />
                      {field.label} {field.required && <span className="text-red-400">*</span>}
                    </label>
                    
                    {field.type === "select" ? (
                      <select
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        required={field.required}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {field.options.map(option => (
                          <option key={option} value={option.toLowerCase()}>
                            {option || "Select " + field.label}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <input
                        type={field.type}
                        name={field.name}
                        value={formData[field.name]}
                        onChange={handleChange}
                        min={field.min}
                        max={field.max}
                        required={field.required}
                        className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder={`Enter ${field.label.toLowerCase()}`}
                      />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Submit Button */}
            <div className="text-center mt-8">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-gradient-to-r from-emerald-600 to-blue-600 hover:from-emerald-700 hover:to-blue-700 px-8 py-3 rounded-lg text-white font-semibold transition-all duration-200 disabled:opacity-50"
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateDoctorProfile;