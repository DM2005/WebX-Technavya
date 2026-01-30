import React from 'react';
import { User, Phone, Mail, IdCard, MapPin, FlaskConical } from 'lucide-react';

const LabProfileView = ({ labData }) => {
  console.log(labData)
  // const user = lab.userId;
// 
  return (
    <div className="space-y-4 text-white">
      <h2 className="text-2xl font-semibold text-green-400">Lab Profile</h2>

      <div className="bg-gray-900/50 p-4 rounded-xl border border-green-600/20 space-y-3">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-teal-400" />
          <span>Name:</span>
          <span className="ml-2 font-medium">{labData.name || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-2">
          <Phone className="w-5 h-5 text-teal-400" />
          <span>Phone:</span>
          <span className="ml-2 font-medium">{labData.phone || 'N/A'}</span>
        </div>

        <div className="flex items-center gap-2">
          <IdCard className="w-5 h-5 text-yellow-300" />
          <span>License :</span>
          <span className="ml-2 font-medium">{labData.licenseNumber}</span>
        </div>

        <div className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-cyan-400" />
          <span>Address:</span>
          <span className="ml-2 font-medium">{labData.address}</span>
        </div>

        <div className="flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-green-400" />
          <span>Test Types:</span>
          <span className="ml-2 font-medium">{labData.testTypes?.join(', ') || 'None'}</span>
        </div>
      </div>
    </div>
  );
};

export default LabProfileView;