import { User,  Phone, Mail, IdCard } from 'lucide-react';

const UpdatePatientProfile = ({ userData = {} }) => {
  

  return (
    <div className="flex items-center justify-center ">
      <div className="w-full max-w-lg border-none">
        {/* Main Card */}
        <div className="bg-gradient-to-br from-gray-900 via-black to-gray-800 rounded-2xl shadow-2xl p-7 border border-green-500/20 backdrop-blur-sm">
          
          {/* Header */}
        <div className="text-center mb-4">
        <div className="flex justify-center items-center gap-2 mb-1">
            <User className="w-8 h-8 text-blue-400" />
            <h2 className="text-3xl font-bold bg-gradient-to-r from-teal-500 to-green-300 bg-clip-text text-transparent">
            Update Patient Profile
            </h2>
        </div>
          </div>


          {/* User Information Display */}
          <div className="relative bg-gradient-to-r from-green-900/20 to-green-800/20 rounded-xl p-5 mb-4 border border-green-500/30 backdrop-blur-sm">
            <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-transparent rounded-xl"></div>
            <h3 className="text-xl font-semibold text-cyan-500 mb-4 flex items-center">
              <div className="w-2 h-2 bg-cyan-300 rounded-full mr-3 animate-pulse"></div>
              User Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center group">
                <User className="w-5 h-5 text-green-400 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-gray-300 text-sm min-w-[60px]">Name:</span>
                <span className="text-white ml-2 font-medium">{userData?.user?.name || 'N/A'}</span>
              </div>
              <div className="flex items-center group">
                <Phone className="w-5 h-5 text-green-400 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-gray-300 text-sm min-w-[60px]">Phone:</span>
                <span className="text-white ml-2 font-medium">{userData?.user?.phone || 'N/A'}</span>
              </div>
              <div className="flex items-center group">
                <Mail className="w-5 h-5 text-green-400 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-gray-300 text-sm min-w-[60px]">Email:</span>
                <span className="text-white ml-2 font-medium">{userData?.user?.email || 'N/A'}</span>
              </div>
              <div className="flex items-center group">
                <IdCard className="w-5 h-5 text-green-400 mr-3 group-hover:scale-110 transition-transform" />
                <span className="text-gray-300 text-sm min-w-[60px]">Id:</span>
                <span className="text-white ml-2 font-medium">{userData?.user?._id || 'N/A'}</span>
              </div>
            </div>
          </div>

      </div>


      

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-gray-500 text-sm">
            Your information is secure and encrypted
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpdatePatientProfile;