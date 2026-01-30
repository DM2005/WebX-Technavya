import React from 'react';
import { Building2, UserPlus,User, Stethoscope, Hash } from 'lucide-react';

const InfoField = ({ icon: Icon, label, value }) => (
  <div className="group mb-6">
    <div className="flex items-center text-base text-gray-300  transition-colors">
      <Icon className="w-5 h-5 mr-3 text-green-400 group-hover:text-green-300 transition-colors" />
      <span className="font-semibold text-lg">{label}:</span>
      <span className="text-white text-lg ml-3">{value || "N/A"}</span>
    </div>
  </div>
);

const AssistantData = ({ assistantData,userData}) => {
  const assistant = assistantData?.assistant;


  const doctorName = assistant?.doctorId?.userId?.name;
  const doctorId = assistant?.doctorId?._id;
  const hospitalName = assistant?.hospitalId?.name;
  const hospitalId = assistant?.hospitalId?._id;
  const assistantName = userData?.user?.name
  const assistantId = assistant?._id

  return (
    <div className="flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <div className="mt-2 bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-3xl shadow-2xl p-10 border border-green-500/20 backdrop-blur-md">
          
          {/* Header */}
          <div className="text-center mb-12">
            <div className="flex justify-center items-center gap-3 mb-2">
              <UserPlus className="w-10 h-10 text-blue-400" />
              <h2 className="text-4xl font-bold bg-gradient-to-r from-teal-400 to-green-300 bg-clip-text text-transparent">
                Assistant Profile
              </h2>
            </div>
            <p className="text-gray-400 text-lg">Here are the details of your profile</p>
          </div>

          <div className="mb-10">
            <h3 className="text-xl text-white font-semibold mb-4 underline underline-offset-4">Assistant Info</h3>
            <InfoField icon={User} label="Assistant Name" value={assistantName} />
            <InfoField icon={Hash} label="Assistant Id" value={assistantId} />
          </div>

          {/* Doctor Info */}
          <div className="mb-10">
            <h3 className="text-xl text-white font-semibold mb-4 underline underline-offset-4">Doctor Info</h3>
            <InfoField icon={Stethoscope} label="Doctor Name" value={doctorName} />
            <InfoField icon={Hash} label="Doctor ID" value={doctorId} />
          </div>

          {/* Hospital Info */}
          <div>
            <h3 className="text-xl text-white font-semibold mb-4 underline underline-offset-4">Hospital Info</h3>
            <InfoField icon={Building2} label="Hospital Name" value={hospitalName} />
            <InfoField icon={Hash} label="Hospital ID" value={hospitalId} />
          </div>

        </div>
      </div>
    </div>
  );
};

export default AssistantData;
