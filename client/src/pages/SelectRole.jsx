import React, { useState } from 'react';
import {
  Stethoscope,
  User,
  Building2,
  TestTube,
  UserCheck,
  CheckCircle,
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { callRoleApi } from '../api/authServices';
import { useNavigate } from 'react-router-dom';
import { requestFCMToken } from "../utils/firebaseConfig.js";
import { updatePatient } from '../services/patientServices.jsx';

const roles = [
  {
    id: "doctor",
    name: "Doctor",
    icon: Stethoscope,
    description: "Diagnose and treat patients",
    color: "from-green-400 to-emerald-600"
  },
  {
    id: "patient",
    name: "Patient",
    icon: User,
    description: "Access medical records and appointments",
    color: "from-blue-400 to-blue-600"
  },
  {
    id: "hospitalAdmin",
    name: "Hospital Admin",
    icon: Building2,
    description: "Manage hospital operations",
    color: "from-purple-400 to-purple-600"
  },
  {
    id: "labAdmin",
    name: "Lab Admin",
    icon: TestTube,
    description: "Oversee laboratory operations",
    color: "from-orange-400 to-orange-600"
  },
  {
    id: "assistant",
    name: "Assistant",
    icon: UserCheck,
    description: "Support healthcare operations",
    color: "from-pink-400 to-pink-600"
  }
];

const SelectRole = () => {
  const [selectedRole, setSelectedRole] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const toast = {
    error: (msg) => alert(`❌ ${msg}`),
    success: (msg) => alert(`✅ ${msg}`),
  };

  const handleRoleSelect = async (roleId) => {
    setSelectedRole(roleId);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedRole) {
      toast.error("Please select a role");
      return;
    }

    setIsSubmitting(true);

    try {
      let tokenToSend = null;

      // Get FCM token for patients only
      if (selectedRole === 'patient') {
        try {
          tokenToSend = await requestFCMToken();
          console.log("FCM token:", tokenToSend);
          const verifyRole = await updatePatient();
          if (verifyRole) {
            console.log("Patient Verified !!");
          }
        } catch (error) {
          console.error("FCM Token Error:", error);
          toast.error("Notification permission denied or blocked.");
          // Continue without token - the backend can handle null fcmToken
        }
      }

      // Call the API with the token (or null for non-patients)
      const response = await callRoleApi(selectedRole, tokenToSend);

      if (response) {
        if (selectedRole === 'hospitalAdmin') {
          toast.success("Role selected successfully");
          navigate('/hospitalAdmin/dashboard');

        } else {
          toast.success("Role selected successfully");
          navigate(`/${selectedRole}/dashboard`);

        }

      }
    } catch (error) {
      console.error("Role selection failed:", error);
      toast.error("Failed to select role. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-52 h-52 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/5 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>

      <div className="relative bg-gray-900/80 backdrop-blur-xl border border-gray-800 rounded-2xl shadow-xl p-6 w-full max-w-md">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl mb-4 shadow-md">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-1">Choose Your Role</h2>
          <p className="text-gray-400 text-sm">Select the role that describes you best</p>
        </div>

        <div className="space-y-4">
          {roles.map((role) => {
            const Icon = role.icon;
            const isSelected = selectedRole === role.id;

            return (
              <div
                key={role.id}
                onClick={() => handleRoleSelect(role.id)}
                className={`relative group cursor-pointer transition-all duration-300 transform hover:scale-[1.01] ${isSelected
                    ? 'ring-2 ring-green-500 bg-gray-800/80'
                    : 'hover:bg-gray-800/50'
                  } rounded-xl`}
              >
                <div className="flex items-center p-4 bg-gray-800/30 border border-gray-700 rounded-xl backdrop-blur-sm">
                  <div className="flex items-center mr-3">
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${isSelected
                        ? 'border-green-500 bg-green-500'
                        : 'border-gray-500 group-hover:border-green-400'
                      }`}>
                      {isSelected && (
                        <CheckCircle className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <input
                      type="radio"
                      name="role"
                      value={role.id}
                      checked={isSelected}
                      onChange={() => handleRoleSelect(role.id)}
                      className="sr-only"
                    />
                  </div>

                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${role.color} flex items-center justify-center mr-4 shadow-md`}>
                    <Icon className="w-5 h-5 text-white" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-base font-semibold text-white group-hover:text-green-400 transition-colors">
                      {role.name}
                    </h3>
                    <p className="text-gray-400 text-xs">{role.description}</p>
                  </div>

                  {isSelected && (
                    <div className="ml-3">
                      <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
                    </div>
                  )}
                </div>

                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-green-500/0 via-green-500/5 to-green-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            );
          })}
        </div>

        <button
          type="submit"
          onClick={handleSubmit}
          disabled={!selectedRole || isSubmitting}
          className={`w-full py-3 rounded-xl font-medium text-base mt-6 transition-all duration-200 transform flex items-center justify-center group ${!selectedRole || isSubmitting
              ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 hover:scale-[1.02] active:scale-[0.98] shadow-md hover:shadow-lg'
            }`}
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
              Processing...
            </div>
          ) : (
            <>
              Confirm Role
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </button>

        <div className="mt-6 text-center">
          <p className="text-gray-500 text-xs">You can change your role later in settings</p>
        </div>

        <div className="absolute top-4 right-4 w-12 h-12 bg-gradient-to-br from-green-400/20 to-emerald-600/20 rounded-full blur-xl"></div>
        <div className="absolute bottom-4 left-4 w-10 h-10 bg-gradient-to-br from-blue-400/20 to-blue-600/20 rounded-full blur-xl"></div>
      </div>
    </div>
  );
};

export default SelectRole;